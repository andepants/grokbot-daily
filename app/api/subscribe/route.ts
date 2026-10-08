import { NextResponse } from "next/server";
import { z } from "zod";
import { ConfirmEmail } from "@/emails/ConfirmEmail";
import { allowConfirmSend } from "@/lib/rate-limit";
import { getResend, resendFrom } from "@/lib/resend";
import { siteUrl } from "@/lib/site";
import { signEmailAction } from "@/lib/tokens";
import { render } from "@react-email/render";

const bodySchema = z.object({
  email: z.string().email().max(320),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

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

  // Honeypot
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Deliver to the address as typed (trimmed, lowercased). allowConfirmSend applies
  // +tag / gmail-dot normalisation internally for limiter keys only.
  const email = parsed.data.email.trim().toLowerCase();

  // Durable limiter — suppressed requests still return {ok:true} (no oracle).
  const gate = await allowConfirmSend(ip, email);
  if (!gate.ok) {
    return NextResponse.json({ ok: true });
  }

  // B2: do NOT create a Resend contact here. Contact is created/updated only on confirm.
  try {
    const confirmToken = signEmailAction(email, "confirm");
    const unsubToken = signEmailAction(email, "unsubscribe");
    const confirmUrl = `${siteUrl()}/confirm?token=${confirmToken}`;
    const unsubUrl = `${siteUrl()}/api/unsubscribe?token=${unsubToken}`;
    const html = await render(ConfirmEmail({ confirmUrl }));

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: resendFrom(),
      to: email,
      subject: "Confirm your Grok Bot Daily subscription",
      html,
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (error) {
      // Still return ok — no oracle; fail closed on abuse paths already consumed quota.
      return NextResponse.json({ ok: true });
    }
  } catch {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
