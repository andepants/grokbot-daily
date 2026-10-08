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

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with a confirmation token, or open /confirm?token=…" },
    { status: 405 },
  );
}

export async function POST(req: Request) {
  const token = await readToken(req);
  const email = verifyEmailAction(token, "confirm");
  if (!email) {
    return NextResponse.redirect(`${siteUrl()}/?confirmed=0`, 303);
  }

  const resend = getResend();
  const tid = topicId();

  // B2: create or update contact only on confirm. Topic-scoped (S16).
  const created = await resend.contacts.create({
    email,
    topics: [{ id: tid, subscription: "opt_in" }],
  });

  if (created.error) {
    // S11: handle create error — existing contact: update topic only (no global status overwrite).
    const topicUpdate = await resend.contacts.topics.update({
      email,
      topics: [{ id: tid, subscription: "opt_in" }],
    });
    if (topicUpdate.error) {
      return NextResponse.redirect(`${siteUrl()}/?confirmed=0`, 303);
    }
  } else if (created.data?.id) {
    await resend.contacts.topics.update({
      id: created.data.id,
      topics: [{ id: tid, subscription: "opt_in" }],
    });
  }

  return NextResponse.redirect(`${siteUrl()}/?confirmed=1`, 303);
}
