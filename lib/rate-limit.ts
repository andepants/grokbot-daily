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
const GLOBAL_DAILY_LIMIT = 300;

/** Per-environment key prefix so preview/dev traffic can't burn prod budgets (S4). */
export function keyPrefix(): string {
  const env = process.env.VERCEL_ENV;
  const safe = env === "production" || env === "preview" ? env : "development";
  return `gbd:${safe}`;
}

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
 * trim, lower, strip +tags, map googlemail.com to gmail.com, drop gmail dots.
 */
export function normalizeEmail(email: string): string {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at <= 0) return e;
  let local = e.slice(0, at);
  const plus = local.indexOf("+");
  if (plus >= 0) local = local.slice(0, plus);
  let domain = e.slice(at + 1);
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") {
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
    prefix: keyPrefix(),
    analytics: false,
    ephemeralCache: false,
  });
}

type Window = `${number} ${"s" | "m" | "h" | "d"}`;

function toWindow(windowSeconds: number): Window {
  if (windowSeconds % 86400 === 0) return `${windowSeconds / 86400} d`;
  if (windowSeconds % 3600 === 0) return `${windowSeconds / 3600} h`;
  if (windowSeconds % 60 === 0) return `${windowSeconds / 60} m`;
  return `${windowSeconds} s`;
}

/** Read remaining quota without consuming it. Fail closed. */
export async function durablePeek(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<RateResult> {
  if (!pepper()) return { ok: false, reason: "store_unconfigured" };
  const redis = redisFromEnv();
  if (!redis) return { ok: false, reason: "store_unconfigured" };
  try {
    const rl = windowLimiter(redis, limit, toWindow(windowSeconds));
    const { remaining } = await withTimeout(rl.getRemaining(bucket));
    if (typeof remaining !== "number" || Number.isNaN(remaining)) {
      return { ok: false, reason: "store_error" };
    }
    return remaining > 0 ? { ok: true } : { ok: false, reason: "limited" };
  } catch {
    return { ok: false, reason: "store_error" };
  }
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

  try {
    const rl = windowLimiter(redis, limit, toWindow(windowSeconds));
    const { success } = await withTimeout(rl.limit(bucket));
    return { ok: success, reason: success ? undefined : "limited" };
  } catch {
    return { ok: false, reason: "store_error" };
  }
}

/**
 * Atomic INCR + EXPIRE (S1). Also re-applies the TTL if a key somehow has none,
 * so a counter can never become a permanent lockout.
 */
export const LIFETIME_LUA = `local n = redis.call('INCR', KEYS[1])
if n == 1 or redis.call('TTL', KEYS[1]) < 0 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[1]))
end
return n`;

function lifetimeKey(emailHash: string): string {
  return `${keyPrefix()}:life:${emailHash}`;
}

/** Lifetime unconfirmed-send counter with ~30d TTL. Fail closed. */
export async function durableEmailLifetime(emailHash: string, lifetimeLimit: number): Promise<RateResult> {
  if (!pepper()) return { ok: false, reason: "store_unconfigured" };
  const redis = redisFromEnv();
  if (!redis) return { ok: false, reason: "store_unconfigured" };
  try {
    const raw = await withTimeout(
      redis.eval<[number], number>(LIFETIME_LUA, [lifetimeKey(emailHash)], [TTL_LIFE_SEC]),
    );
    const n = Number(raw);
    if (!Number.isFinite(n)) return { ok: false, reason: "store_error" };
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
    await withTimeout(redis.del(lifetimeKey(emailHash)));
  } catch {
    /* best-effort */
  }
}

/**
 * Subscribe confirmation send gates (G1).
 * Peek global (no consume) → IP → email/day → lifetime → consume global last,
 * so blocked requests never burn the shared global daily budget.
 */
export async function allowConfirmSend(ip: string, email: string): Promise<RateResult> {
  const emailNorm = normalizeEmail(email);
  const ipHash = hashLimiterValue(ip);
  const emailHash = hashLimiterValue(emailNorm);
  if (!ipHash || !emailHash) return { ok: false, reason: "store_unconfigured" };

  const day = new Date().toISOString().slice(0, 10);
  const globalBucket = `global:${day}`;

  const globalPeek = await durablePeek(globalBucket, GLOBAL_DAILY_LIMIT, TTL_GLOBAL_SEC);
  if (!globalPeek.ok) return globalPeek;

  const ipOk = await durableRateLimit(`ip:${ipHash}`, 5, TTL_IP_SEC);
  if (!ipOk.ok) return ipOk;

  const emailDayOk = await durableRateLimit(`email24:${emailHash}`, 1, TTL_EMAIL_SEC);
  if (!emailDayOk.ok) return emailDayOk;

  const lifetimeOk = await durableEmailLifetime(emailHash, 3);
  if (!lifetimeOk.ok) return lifetimeOk;

  return await durableRateLimit(globalBucket, GLOBAL_DAILY_LIMIT, TTL_GLOBAL_SEC);
}

export const __testing = {
  TTL_IP_SEC,
  TTL_EMAIL_SEC,
  TTL_LIFE_SEC,
  STORE_TIMEOUT_MS,
};
