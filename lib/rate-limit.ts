/**
 * Durable rate limiter via Upstash Redis (Vercel KV Marketplace free tier).
 * Keys are HMAC-SHA256(pepper, value) — never raw IP/email. Fail closed.
 */
import { createHmac } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateResult = { ok: boolean; reason?: string };

const STORE_TIMEOUT_MS = 3000;
const TTL_IP_SEC = 60 * 60;
const TTL_EMAIL_SEC = 60 * 60 * 24;
const TTL_LIFE_SEC = 60 * 60 * 24 * 30;
const TTL_GLOBAL_SEC = 60 * 60 * 24;

function pepper(): string | null {
  const p = process.env.GBD_KEY_PEPPER;
  return p && p.length > 0 ? p : null;
}

/** HMAC-SHA256 hex digest for limiter keys only (never store raw PII). */
export function hashLimiterValue(value: string): string | null {
  const p = pepper();
  if (!p) return null;
  return createHmac("sha256", p).update(value).digest("hex");
}

/**
 * Normalise for limiter keys only (not for Resend delivery address):
 * trim, lower, strip +tags, drop dots for gmail/googlemail.
 */
export function normalizeEmail(email: string): string {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at <= 0) return e;
  let local = e.slice(0, at);
  const domain = e.slice(at + 1);
  const plus = local.indexOf("+");
  if (plus >= 0) local = local.slice(0, plus);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replace(/\./g, "");
  }
  return `${local}@${domain}`;
}

function redisFromEnv(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function withTimeout<T>(p: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      p,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("store_timeout")), STORE_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function windowLimiter(redis: Redis, limit: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(limit, window),
    prefix: "gbd",
    analytics: false,
    ephemeralCache: false,
  });
}

/** Fixed-window durable limit. Fail closed. */
export async function durableRateLimit(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<RateResult> {
  if (!pepper()) return { ok: false, reason: "store_unconfigured" };
  const redis = redisFromEnv();
  if (!redis) return { ok: false, reason: "store_unconfigured" };

  let window: `${number} ${"s" | "m" | "h" | "d"}`;
  if (windowSeconds % 86400 === 0) window = `${windowSeconds / 86400} d`;
  else if (windowSeconds % 3600 === 0) window = `${windowSeconds / 3600} h`;
  else if (windowSeconds % 60 === 0) window = `${windowSeconds / 60} m`;
  else window = `${windowSeconds} s`;

  try {
    const rl = windowLimiter(redis, limit, window);
    const { success } = await withTimeout(rl.limit(bucket));
    return { ok: success, reason: success ? undefined : "limited" };
  } catch {
    return { ok: false, reason: "store_error" };
  }
}

/** Lifetime unconfirmed-send counter with ~30d TTL. Fail closed. */
export async function durableEmailLifetime(emailHash: string, lifetimeLimit: number): Promise<RateResult> {
  if (!pepper()) return { ok: false, reason: "store_unconfigured" };
  const redis = redisFromEnv();
  if (!redis) return { ok: false, reason: "store_unconfigured" };
  const key = `gbd:life:${emailHash}`;
  try {
    const n = await withTimeout(redis.incr(key));
    if (typeof n !== "number" || Number.isNaN(n)) return { ok: false, reason: "store_error" };
    if (n === 1) {
      await withTimeout(redis.expire(key, TTL_LIFE_SEC));
    }
    if (n > lifetimeLimit) return { ok: false, reason: "lifetime" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "store_error" };
  }
}

/** Clear lifetime counter after successful confirm (N4). */
export async function clearEmailLifetime(email: string): Promise<void> {
  const emailHash = hashLimiterValue(normalizeEmail(email));
  const redis = redisFromEnv();
  if (!emailHash || !redis) return;
  try {
    await withTimeout(redis.del(`gbd:life:${emailHash}`));
  } catch {
    /* best-effort */
  }
}

/**
 * Subscribe confirmation send gates.
 * Global first (N4), then IP and email — so earlier gates are not burned when global denies.
 */
export async function allowConfirmSend(ip: string, email: string): Promise<RateResult> {
  const emailNorm = normalizeEmail(email);
  const ipHash = hashLimiterValue(ip);
  const emailHash = hashLimiterValue(emailNorm);
  if (!ipHash || !emailHash) return { ok: false, reason: "store_unconfigured" };

  const day = new Date().toISOString().slice(0, 10);

  const globalOk = await durableRateLimit(`global:${day}`, 300, TTL_GLOBAL_SEC);
  if (!globalOk.ok) return globalOk;

  const ipOk = await durableRateLimit(`ip:${ipHash}`, 5, TTL_IP_SEC);
  if (!ipOk.ok) return ipOk;

  const emailDayOk = await durableRateLimit(`email24:${emailHash}`, 1, TTL_EMAIL_SEC);
  if (!emailDayOk.ok) return emailDayOk;

  const lifetimeOk = await durableEmailLifetime(emailHash, 3);
  if (!lifetimeOk.ok) return lifetimeOk;

  return { ok: true };
}

export const __testing = {
  TTL_IP_SEC,
  TTL_EMAIL_SEC,
  TTL_LIFE_SEC,
  STORE_TIMEOUT_MS,
};
