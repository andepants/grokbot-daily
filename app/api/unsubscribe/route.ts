import { NextResponse } from "next/server";
import { audienceId, getResend } from "@/lib/resend";
import { siteUrl } from "@/lib/site";
import { verifyEmailAction } from "@/lib/tokens";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const email = verifyEmailAction(token, "unsubscribe");
  if (!email) {
    return NextResponse.redirect(`${siteUrl()}/?unsubscribed=0`);
  }
  const resend = getResend();
  await resend.contacts.update({
    email,
    audienceId: audienceId(),
    unsubscribed: true,
  });
  return NextResponse.redirect(`${siteUrl()}/?unsubscribed=1`);
}

export async function POST(req: Request) {
  return GET(req);
}
