import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { signEmailAction, verifyEmailAction } from "@/lib/tokens";

describe("tokens", () => {
  beforeEach(() => {
    process.env.CONFIRM_SECRET = "test-confirm-secret-not-resend";
    delete process.env.RESEND_API_KEY;
  });
  afterEach(() => {
    delete process.env.CONFIRM_SECRET;
  });

  it("fails closed without CONFIRM_SECRET (no Resend key fallback)", () => {
    delete process.env.CONFIRM_SECRET;
    process.env.RESEND_API_KEY = "re_should_not_be_used";
    expect(() => signEmailAction("a@b.co", "confirm")).toThrow(/CONFIRM_SECRET/);
  });

  it("round-trips confirm tokens", () => {
    const token = signEmailAction("User@Example.COM", "confirm");
    expect(verifyEmailAction(token, "confirm")).toBe("user@example.com");
    expect(verifyEmailAction(token, "unsubscribe")).toBeNull();
  });

  it("rejects tampered tokens", () => {
    const token = signEmailAction("a@b.co", "confirm");
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split(":");
    parts[1] = "evil@b.co";
    const bad = Buffer.from(parts.join(":")).toString("base64url");
    expect(verifyEmailAction(bad, "confirm")).toBeNull();
  });

  it("signs long-lived unsubscribe tokens", () => {
    const token = signEmailAction("a@b.co", "unsubscribe");
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const exp = Number(raw.split(":")[2]);
    const years = (exp - Math.floor(Date.now() / 1000)) / (365 * 24 * 3600);
    expect(years).toBeGreaterThan(9);
    expect(verifyEmailAction(token, "unsubscribe")).toBe("a@b.co");
  });
});
