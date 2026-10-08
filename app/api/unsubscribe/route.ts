import { NextResponse } from "next/server";
import { getResend, topicId } from "@/lib/resend";
import { siteUrl } from "@/lib/site";
import { verifyEmailAction } from "@/lib/tokens";

async function readToken(req: Request): Promise<string> {
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get("token");
  if (fromQuery) return fromQuery;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await req.json()) as { token?: string };
      return body.token || "";
    } catch {
      return "";
    }
  }
  try {
    const form = await req.formData();
    return String(form.get("token") || "");
  } catch {
    return "";
  }
}

async function unsubscribeTopic(email: string) {
  const resend = getResend();
  const tid = topicId();
  // S16: topic opt_out only — do not set team-wide unsubscribed:true
  const result = await resend.contacts.topics.update({
    email,
    topics: [{ id: tid, subscription: "opt_out" }],
  });
  return !result.error;
}

/** GET must not mutate — send users to the button page. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  return NextResponse.redirect(`${siteUrl()}/unsubscribe?token=${encodeURIComponent(token)}`, 303);
}

/**
 * RFC 8058 one-click: POST returns 200 (not a redirect).
 * Browser form POSTs from /unsubscribe get a 303 for UX.
 */
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  const accept = req.headers.get("accept") || "";
  const token = await readToken(req);
  const email = verifyEmailAction(token, "unsubscribe");

  if (email) {
    try {
      await unsubscribeTopic(email);
    } catch {
      /* still succeed for one-click */
    }
  }

  const isBrowserForm =
    (contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")) &&
    accept.includes("text/html");

  if (isBrowserForm) {
    return NextResponse.redirect(`${siteUrl()}/?unsubscribed=${email ? "1" : "0"}`, 303);
  }

  return NextResponse.json({ ok: Boolean(email) }, { status: 200 });
}
