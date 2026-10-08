import { NextResponse } from "next/server";
import { z } from "zod";
import { ConfirmEmail } from "@/emails/ConfirmEmail";
import { rateLimit } from "@/lib/rate-limit";
import { audienceId, getResend, resendFrom } from "@/lib/resend";
import { siteUrl } from "@/lib/site";
import { signEmailAction } from "@/lib/tokens";

const bodySchema = z.object({
  email: z.string().email().max(320),
  consent: z.literal(true),
  website: z.string().max(200).optional(), // honeypot
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`sub:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
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

  // Honeypot: bots fill "website"
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = parsed.data.email.toLowerCase();
  const resend = getResend();
  const aud = audienceId();

  // Add contact unsubscribed until confirm
  const contact = await resend.contacts.create({
    email,
    unsubscribed: true,
    audienceId: aud,
  });
  if (contact.error && !/already|exists/i.test(contact.error.message || "")) {
    return NextResponse.json({ error: "Could not create contact." }, { status: 502 });
  }

  const token = signEmailAction(email, "confirm");
  const confirmUrl = `${siteUrl()}/api/confirm?token=${encodeURIComponent(token)}`;

  const sent = await resend.emails.send({
    from: resendFrom(),
    to: email,
    subject: "Confirm your Grok Bot Daily subscription",
    react: ConfirmEmail({ confirmUrl }),
    headers: {
      "List-Unsubscribe": `<${siteUrl()}/api/unsubscribe?token=${encodeURIComponent(signEmailAction(email, "unsubscribe"))}>`,
    },
  });

  if (sent.error) {
    return NextResponse.json({ error: "Could not send confirmation email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
