import { describe, expect, it } from "vitest";
import { clientIp } from "@/lib/client-ip";

describe("clientIp (S2)", () => {
  it("uses x-real-ip, not the first x-forwarded-for element", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "6.6.6.6, 1.2.3.4", "x-real-ip": "1.2.3.4" },
    });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to a shared unknown bucket", () => {
    const req = new Request("https://x.test", { headers: { "x-forwarded-for": "6.6.6.6" } });
    expect(clientIp(req)).toBe("unknown");
  });
});
