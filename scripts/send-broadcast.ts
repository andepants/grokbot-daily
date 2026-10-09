/**
 * Creates a Resend broadcast for an issue.
 * NEVER runs without --confirm. Never invoke from CI.
 * Refuses if MAILING_ADDRESS is unset (CAN-SPAM postal address).
 */
import { render } from "@react-email/render";
import { Resend } from "resend";
import { IssueEmail } from "../emails/IssueEmail";
import { getIssue } from "../lib/issues";
import { marked } from "./_markdown";

async function main() {
  if (process.env.CI) {
    console.error("Refusing to broadcast in CI");
    process.exit(1);
  }
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const confirmed = args.includes("--confirm");
  if (!slug) {
    console.error("Usage: pnpm send:broadcast <slug> --confirm");
    process.exit(1);
  }
  if (!confirmed) {
    console.error("Refusing to broadcast without --confirm");
    process.exit(1);
  }

  const mailingAddress = (process.env.MAILING_ADDRESS || "").trim();
  if (!mailingAddress) {
    console.error("MAILING_ADDRESS is unset. Set a postal address before broadcasting.");
    process.exit(1);
  }

  const key = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_AUDIENCE_ID; // Resend segment id
  const topicId = process.env.RESEND_TOPIC_ID;
  if (!key || !segmentId) throw new Error("RESEND_API_KEY and RESEND_AUDIENCE_ID required");
  if (!topicId) throw new Error("RESEND_TOPIC_ID required");

  const issue = getIssue(slug);
  if (!issue) throw new Error(`Issue not found: ${slug}`);
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const issueUrl = `${site}/issues/${issue.slug}`;
  const htmlBody = marked(issue.content);
  const unsubscribeUrl = "{{{RESEND_UNSUBSCRIBE_URL}}}";

  const html = await render(
    IssueEmail({
      title: issue.title,
      description: issue.description,
      htmlBody,
      issueUrl,
      unsubscribeUrl,
      mailingAddress,
    }),
  );

  const resend = new Resend(key);
  const created = await resend.broadcasts.create({
    segmentId,
    from: process.env.RESEND_FROM || "Grok Bot Daily <hello@shotpup.com>",
    subject: issue.title,
    html,
    topicId,
  });

  if (created.error) {
    console.error(created.error);
    process.exit(1);
  }
  console.log("broadcast_created", created.data?.id);
  console.log("Send it from the Resend dashboard after review, or call broadcasts.send with the id.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
