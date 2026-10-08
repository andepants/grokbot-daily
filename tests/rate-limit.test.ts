import { afterEach, describe, expect, it, vi } from "vitest";
import { allowConfirmSend, durableRateLimit } from "@/lib/rate-limit";

describe("durable rate limit", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.GBD_RATE_SECRET;
  });

  it("fails closed when store is unconfigured", async () => {
    const r = await durableRateLimit("x:y", 5, 60);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("store_unconfigured");
  });

  it("fails closed when RPC errors", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon";
    process.env.GBD_RATE_SECRET = "sec";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );
    const r = await durableRateLimit("gbd:ip:1.2.3.4", 5, 3600);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("store_error");
  });

  it("allowConfirmSend short-circuits on first denial", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon";
    process.env.GBD_RATE_SECRET = "sec";
    let calls = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls += 1;
        return Response.json(false);
      }),
    );
    const r = await allowConfirmSend("1.1.1.1", "A@B.co");
    expect(r.ok).toBe(false);
    expect(calls).toBe(1);
  });

  it("allowConfirmSend requires all gates", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon";
    process.env.GBD_RATE_SECRET = "sec";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json(true)),
    );
    const r = await allowConfirmSend("1.1.1.1", "a@b.co");
    expect(r.ok).toBe(true);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(4);
  });
});
