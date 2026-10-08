import { NextResponse } from "next/server";
import { clearEmailLifetime } from "@/lib/rate-limit";
import { getResend, segmentId, topicId } from "@/lib/resend";
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
  const sid = segmentId();

  // B2 + N2: create contact with segment + topic; existing → segments.add + topic opt_in.
  const created = await resend.contacts.create({
    email,
    segments: [{ id: sid }],
    topics: [{ id: tid, subscription: "opt_in" }],
  });

  if (created.error) {
    const topicUpdate = await resend.contacts.topics.update({
      email,
      topics: [{ id: tid, subscription: "opt_in" }],
    });
    const segAdd = await resend.contacts.segments.add({
      email,
      segmentId: sid,
    });
    if (topicUpdate.error && segAdd.error) {
      return NextResponse.redirect(`${siteUrl()}/?confirmed=0`, 303);
    }
  } else if (created.data?.id) {
    await resend.contacts.topics.update({
      id: created.data.id,
      topics: [{ id: tid, subscription: "opt_in" }],
    });
  }

  // N4: reset lifetime unconfirmed counter on successful confirm
  await clearEmailLifetime(email);

  return NextResponse.redirect(`${siteUrl()}/?confirmed=1`, 303);
}
