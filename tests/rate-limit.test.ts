import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const limitMock = vi.fn();
const remainingMock = vi.fn();
const incrMock = vi.fn();
const expireMock = vi.fn();
const evalMock = vi.fn();
const delMock = vi.fn();
const ratelimitOpts: Array<{ prefix?: string }> = [];

vi.mock("@upstash/redis", () => {
  class Redis {
    incr = incrMock;
    expire = expireMock;
    eval = evalMock;
    del = delMock;
    constructor(_opts: { url: string; token: string }) {}
  }
  return { Redis };
});

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    limit = limitMock;
    getRemaining = remainingMock;
    constructor(opts: { prefix?: string }) {
      ratelimitOpts.push(opts);
    }
    static fixedWindow(limit: number, window: string) {
      return { limit, window };
    }
  }
  return { Ratelimit };
});

describe("email normalisation (limiter keys)", () => {
  beforeEach(() => {
    process.env.GBD_KEY_PEPPER = "test-pepper";
    process.env.KV_REST_API_URL = "https://example.upstash.io";
    process.env.KV_REST_API_TOKEN = "token";
    vi.resetModules();
  });
  afterEach(() => {
    delete process.env.GBD_KEY_PEPPER;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
  });

  it("strips plus tags and gmail dots", async () => {
    const { normalizeEmail } = await import("@/lib/rate-limit");
    expect(normalizeEmail("V.ictim+news@Gmail.com")).toBe("victim@gmail.com");
    expect(normalizeEmail("v.ictim+x@googlemail.com")).toBe("victim@gmail.com");
    expect(normalizeEmail("a+1@example.com")).toBe("a@example.com");
    expect(normalizeEmail("a.b@example.com")).toBe("a.b@example.com");
  });

  it("hashes with pepper and never returns raw", async () => {
    const { hashLimiterValue, normalizeEmail } = await import("@/lib/rate-limit");
    const h = hashLimiterValue(normalizeEmail("user@gmail.com"));
    expect(h).toMatch(/^[a-f0-9]{64}$/);
    expect(h).not.toContain("user");
    expect(h).not.toContain("@");
  });
});

describe("durable rate limit (Upstash)", () => {
  beforeEach(() => {
    limitMock.mockReset();
    remainingMock.mockReset();
    remainingMock.mockResolvedValue({ remaining: 100, reset: 0, limit: 300 });
    incrMock.mockReset();
    expireMock.mockReset();
    evalMock.mockReset();
    delMock.mockReset();
    ratelimitOpts.length = 0;
    delete process.env.VERCEL_ENV;
    process.env.KV_REST_API_URL = "https://example.upstash.io";
    process.env.KV_REST_API_TOKEN = "token";
    process.env.GBD_KEY_PEPPER = "test-pepper";
    vi.resetModules();
  });

  afterEach(() => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.GBD_KEY_PEPPER;
    delete process.env.VERCEL_ENV;
  });

  it("fails closed when store is unconfigured", async () => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    const { durableRateLimit } = await import("@/lib/rate-limit");
    const r = await durableRateLimit("x:y", 5, 60);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("store_unconfigured");
  });

  it("fails closed when pepper missing", async () => {
    delete process.env.GBD_KEY_PEPPER;
    const { allowConfirmSend } = await import("@/lib/rate-limit");
    const r = await allowConfirmSend("1.1.1.1", "a@b.co");
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("store_unconfigured");
  });

  it("fails closed when Redis/ratelimit throws", async () => {
    limitMock.mockRejectedValueOnce(new Error("boom"));
    const { durableRateLimit } = await import("@/lib/rate-limit");
    const r = await durableRateLimit("ip:abc", 5, 3600);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("store_error");
  });

  it("does not touch the global counter when the IP is blocked (G1)", async () => {
    limitMock.mockResolvedValueOnce({ success: false }); // IP deny
    const { allowConfirmSend, hashLimiterValue } = await import("@/lib/rate-limit");
    const r = await allowConfirmSend("1.1.1.1", "a@b.co");
    expect(r.ok).toBe(false);
    expect(limitMock).toHaveBeenCalledTimes(1);
    expect(limitMock.mock.calls[0][0]).toBe(`ip:${hashLimiterValue("1.1.1.1")}`);
    expect(limitMock.mock.calls.some((c) => String(c[0]).startsWith("global:"))).toBe(false);
    expect(evalMock).not.toHaveBeenCalled();
  });

  it("does not consume the global counter when email or lifetime blocks (G1)", async () => {
    limitMock.mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({ success: false });
    const { allowConfirmSend } = await import("@/lib/rate-limit");
    expect((await allowConfirmSend("1.1.1.1", "a@b.co")).ok).toBe(false);
    limitMock.mockReset();
    limitMock.mockResolvedValue({ success: true });
    evalMock.mockResolvedValueOnce(4);
    expect((await allowConfirmSend("1.1.1.1", "a@b.co")).reason).toBe("lifetime");
    expect(limitMock.mock.calls.some((c) => String(c[0]).startsWith("global:"))).toBe(false);
  });

  it("consumes nothing when the global peek is exhausted", async () => {
    remainingMock.mockResolvedValueOnce({ remaining: 0, reset: 0, limit: 300 });
    const { allowConfirmSend } = await import("@/lib/rate-limit");
    const r = await allowConfirmSend("1.1.1.1", "a@b.co");
    expect(r).toEqual({ ok: false, reason: "limited" });
    expect(limitMock).not.toHaveBeenCalled();
    expect(evalMock).not.toHaveBeenCalled();
  });

  it("allowConfirmSend requires all gates with hashed keys, global consumed last", async () => {
    limitMock.mockResolvedValue({ success: true });
    evalMock.mockResolvedValue(1);
    const { allowConfirmSend, hashLimiterValue, normalizeEmail, LIFETIME_LUA } = await import(
      "@/lib/rate-limit"
    );
    const r = await allowConfirmSend("1.1.1.1", "A.B+x@gmail.com");
    expect(r.ok).toBe(true);
    expect(limitMock).toHaveBeenCalledTimes(3);
    const emailHash = hashLimiterValue(normalizeEmail("A.B+x@gmail.com"))!;
    const ipHash = hashLimiterValue("1.1.1.1")!;
    expect(limitMock.mock.calls[0][0]).toBe(`ip:${ipHash}`);
    expect(limitMock.mock.calls[1][0]).toBe(`email24:${emailHash}`);
    expect(String(limitMock.mock.calls[2][0])).toMatch(/^global:\d{4}-\d{2}-\d{2}$/);
    expect(evalMock).toHaveBeenCalledWith(LIFETIME_LUA, [`gbd:development:life:${emailHash}`], [2592000]);
    expect(incrMock).not.toHaveBeenCalled();
    expect(expireMock).not.toHaveBeenCalled();
  });

  it("lifetime INCR+EXPIRE is one atomic script that heals missing TTLs (S1)", async () => {
    evalMock.mockResolvedValue(1);
    const { durableEmailLifetime, LIFETIME_LUA } = await import("@/lib/rate-limit");
    expect((await durableEmailLifetime("abc", 3)).ok).toBe(true);
    expect(evalMock).toHaveBeenCalledTimes(1);
    expect(incrMock).not.toHaveBeenCalled();
    expect(expireMock).not.toHaveBeenCalled();
    expect(LIFETIME_LUA).toContain("redis.call('INCR', KEYS[1])");
    expect(LIFETIME_LUA).toContain("redis.call('TTL', KEYS[1]) < 0");
    expect(LIFETIME_LUA).toContain("redis.call('EXPIRE', KEYS[1]");
  });

  it("lifetime denies after limit and fails closed on store error", async () => {
    evalMock.mockResolvedValueOnce(4);
    const { durableEmailLifetime } = await import("@/lib/rate-limit");
    expect(await durableEmailLifetime("abc", 3)).toEqual({ ok: false, reason: "lifetime" });
    evalMock.mockRejectedValueOnce(new Error("boom"));
    expect(await durableEmailLifetime("abc", 3)).toEqual({ ok: false, reason: "store_error" });
  });

  it("prefixes every key with VERCEL_ENV (S4)", async () => {
    process.env.VERCEL_ENV = "preview";
    limitMock.mockResolvedValue({ success: true });
    evalMock.mockResolvedValue(1);
    const { allowConfirmSend, keyPrefix, hashLimiterValue, normalizeEmail } = await import(
      "@/lib/rate-limit"
    );
    expect(keyPrefix()).toBe("gbd:preview");
    await allowConfirmSend("1.1.1.1", "a@b.co");
    expect(ratelimitOpts.length).toBeGreaterThan(0);
    expect(ratelimitOpts.every((o) => o.prefix === "gbd:preview")).toBe(true);
    const h = hashLimiterValue(normalizeEmail("a@b.co"));
    expect(evalMock.mock.calls[0][1]).toEqual([`gbd:preview:life:${h}`]);
    process.env.VERCEL_ENV = "production";
    expect(keyPrefix()).toBe("gbd:production");
    process.env.VERCEL_ENV = "weird";
    expect(keyPrefix()).toBe("gbd:development");
  });

  it("clearEmailLifetime deletes the lifetime key", async () => {
    delMock.mockResolvedValue(1);
    const { clearEmailLifetime, hashLimiterValue, normalizeEmail } = await import("@/lib/rate-limit");
    await clearEmailLifetime("User@Gmail.com");
    const h = hashLimiterValue(normalizeEmail("User@Gmail.com"));
    expect(delMock).toHaveBeenCalledWith(`gbd:development:life:${h}`);
  });
});
