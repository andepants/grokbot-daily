/**
 * Durable rate limiter via Supabase SECURITY DEFINER RPCs (free tier).
 * Fails closed if the store is unreachable or misconfigured.
 */

export type RateResult = { ok: boolean; reason?: string };

function supabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secret = process.env.GBD_RATE_SECRET;
  if (!url || !key || !secret) return null;
  return { url: url.replace(/\/$/, ""), key, secret };
}

async function rpc<T>(fn: string, body: Record<string, unknown>): Promise<T | null> {
  const cfg = supabaseConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Sliding fixed window via durable store. Fail closed. */
export async function durableRateLimit(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<RateResult> {
  const cfg = supabaseConfig();
  if (!cfg) return { ok: false, reason: "store_unconfigured" };
  const allowed = await rpc<boolean>("gbd_rate_consume", {
    p_secret: cfg.secret,
    p_bucket: bucket,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (allowed === null) return { ok: false, reason: "store_error" };
  return { ok: allowed, reason: allowed ? undefined : "limited" };
}

export async function durableEmailLifetime(emailNorm: string, lifetimeLimit: number): Promise<RateResult> {
  const cfg = supabaseConfig();
  if (!cfg) return { ok: false, reason: "store_unconfigured" };
  const allowed = await rpc<boolean>("gbd_email_lifetime_consume", {
    p_secret: cfg.secret,
    p_email_norm: emailNorm,
    p_lifetime_limit: lifetimeLimit,
  });
  if (allowed === null) return { ok: false, reason: "store_error" };
  return { ok: allowed, reason: allowed ? undefined : "lifetime" };
}

/** Normalize email for limiter keys. */
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Subscribe confirmation send gates. Same {ok:false} reasons stay internal. */
export async function allowConfirmSend(ip: string, email: string): Promise<RateResult> {
  const emailNorm = normalizeEmail(email);
  const day = new Date().toISOString().slice(0, 10); // UTC day for global cap

  const ipOk = await durableRateLimit(`gbd:ip:${ip}`, 5, 60 * 60);
  if (!ipOk.ok) return ipOk;

  const emailDayOk = await durableRateLimit(`gbd:email24:${emailNorm}`, 1, 60 * 60 * 24);
  if (!emailDayOk.ok) return emailDayOk;

  const lifetimeOk = await durableEmailLifetime(emailNorm, 3);
  if (!lifetimeOk.ok) return lifetimeOk;

  const globalOk = await durableRateLimit(`gbd:global:${day}`, 300, 60 * 60 * 24);
  if (!globalOk.ok) return globalOk;

  return { ok: true };
}
