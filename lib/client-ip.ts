/**
 * Client IP for rate limiting (S2). On Vercel, x-real-ip is set by the edge to
 * the connecting client (same source as @vercel/functions ipAddress()). We do
 * not trust the first x-forwarded-for element. Missing → shared "unknown" bucket.
 */
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  return real && real.length > 0 && real.length <= 64 ? real : "unknown";
}
