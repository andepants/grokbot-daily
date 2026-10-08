import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().email().max(320),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});

/**
 * HOTFIX (ec92c46 B1): confirmation email sending is temporarily disabled
 * while a durable limiter ships. Always returns {ok:true} for valid requests
 * so the form looks fine and no mail leaves hello@shotpup.com.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`sub:${ip}`, 5, 60_000);
  if (!limited.ok) {
    // Same shape as success — no oracle / no 429 detail for attackers during hotfix
    return NextResponse.json({ ok: true });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email and explicit consent are required." }, { status: 400 });
  }

  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Intentionally no Resend contact create and no confirmation email (B1/B2 stopgap).
  return NextResponse.json({ ok: true });
}
