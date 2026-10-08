import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const s = process.env.CONFIRM_SECRET || process.env.RESEND_API_KEY;
  if (!s) throw new Error("CONFIRM_SECRET is not set");
  return s;
}

export function signEmailAction(email: string, action: "confirm" | "unsubscribe", ttlSec = 60 * 60 * 48) {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const payload = `${action}:${email.toLowerCase()}:${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyEmailAction(token: string, action: "confirm" | "unsubscribe") {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const [act, email, expStr, sig] = raw.split(":");
    if (act !== action || !email || !expStr || !sig) return null;
    if (Number(expStr) < Math.floor(Date.now() / 1000)) return null;
    const payload = `${act}:${email}:${expStr}`;
    const expected = createHmac("sha256", secret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return email;
  } catch {
    return null;
  }
}
