import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const limitMock = vi.fn();
const incrMock = vi.fn();
const expireMock = vi.fn();
const delMock = vi.fn();

vi.mock("@upstash/redis", () => {
  class Redis {
    incr = incrMock;
    expire = expireMock;
    del = delMock;
    constructor(_opts: { url: string; token: string }) {}
  }
  return { Redis };
});

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    limit = limitMock;
    constructor(_opts: unknown) {}
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
    incrMock.mockReset();
    expireMock.mockReset();
    delMock.mockReset();
    process.env.KV_REST_API_URL = "https://example.upstash.io";
    process.env.KV_REST_API_TOKEN = "token";
    process.env.GBD_KEY_PEPPER = "test-pepper";
    vi.resetModules();
  });

  afterEach(() => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.GBD_KEY_PEPPER;
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

  it("checks global before IP/email so later gates are not burned", async () => {
    limitMock.mockResolvedValueOnce({ success: false }); // global deny
    const { allowConfirmSend } = await import("@/lib/rate-limit");
    const r = await allowConfirmSend("1.1.1.1", "a@b.co");
    expect(r.ok).toBe(false);
    expect(limitMock).toHaveBeenCalledTimes(1);
    expect(incrMock).not.toHaveBeenCalled();
  });

  it("allowConfirmSend requires all gates with hashed keys", async () => {
    limitMock.mockResolvedValue({ success: true });
    incrMock.mockResolvedValue(1);
    expireMock.mockResolvedValue(1);
    const { allowConfirmSend, hashLimiterValue, normalizeEmail } = await import("@/lib/rate-limit");
    const r = await allowConfirmSend("1.1.1.1", "A.B+x@gmail.com");
    expect(r.ok).toBe(true);
    expect(limitMock).toHaveBeenCalledTimes(3);
    const emailHash = hashLimiterValue(normalizeEmail("A.B+x@gmail.com"))!;
    const ipHash = hashLimiterValue("1.1.1.1")!;
    expect(limitMock.mock.calls[1][0]).toBe(`ip:${ipHash}`);
    expect(limitMock.mock.calls[2][0]).toBe(`email24:${emailHash}`);
    expect(incrMock).toHaveBeenCalledWith(`gbd:life:${emailHash}`);
    expect(expireMock).toHaveBeenCalled();
  });

  it("lifetime denies after limit and sets TTL on first incr", async () => {
    incrMock.mockResolvedValue(4);
    const { durableEmailLifetime } = await import("@/lib/rate-limit");
    const r = await durableEmailLifetime("abc", 3);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("lifetime");
  });

  it("clearEmailLifetime deletes the lifetime key", async () => {
    delMock.mockResolvedValue(1);
    const { clearEmailLifetime, hashLimiterValue, normalizeEmail } = await import("@/lib/rate-limit");
    await clearEmailLifetime("User@Gmail.com");
    const h = hashLimiterValue(normalizeEmail("User@Gmail.com"));
    expect(delMock).toHaveBeenCalledWith(`gbd:life:${h}`);
  });
});
