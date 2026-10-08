import { NextResponse } from "next/server";
import { audienceId, getResend } from "@/lib/resend";
import { siteUrl } from "@/lib/site";
import { verifyEmailAction } from "@/lib/tokens";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const email = verifyEmailAction(token, "confirm");
  if (!email) {
    return NextResponse.redirect(`${siteUrl()}/?confirmed=0`);
  }

  const resend = getResend();
  const aud = audienceId();

  // Prefer update; fall back to create subscribed
  const updated = await resend.contacts.update({
    email,
    audienceId: aud,
    unsubscribed: false,
  });

  if (updated.error) {
    await resend.contacts.create({
      email,
      audienceId: aud,
      unsubscribed: false,
    });
  }

  return NextResponse.redirect(`${siteUrl()}/?confirmed=1`);
}
