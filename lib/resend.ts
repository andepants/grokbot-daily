import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export function resendFrom() {
  return process.env.RESEND_FROM || "Grok Bot Daily <hello@shotpup.com>";
}

/** Broadcast segment (Resend audience id). */
export function segmentId() {
  const id = process.env.RESEND_AUDIENCE_ID;
  if (!id) throw new Error("RESEND_AUDIENCE_ID is not set");
  return id;
}

/** @deprecated use segmentId */
export function audienceId() {
  return segmentId();
}

/** Resend Topic for Grok Bot Daily — unsubscribe is topic-scoped, not team-global. */
export function topicId() {
  const id = process.env.RESEND_TOPIC_ID;
  if (!id) throw new Error("RESEND_TOPIC_ID is not set");
  return id;
}

export function mailingAddress() {
  return (process.env.MAILING_ADDRESS || "").trim();
}
