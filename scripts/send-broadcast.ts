/**
 * Creates a Resend broadcast for an issue.
 * NEVER runs without --confirm. Never invoke from CI.
 */
import { Resend } from "resend";
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
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) throw new Error("RESEND_API_KEY and RESEND_AUDIENCE_ID required");
  const issue = getIssue(slug);
  if (!issue) throw new Error(`Issue not found: ${slug}`);
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const html = `<h1>${issue.title}</h1><p>${issue.description}</p>${marked(issue.content)}<p><a href="${site}/issues/${issue.slug}">Read on the web</a></p>`;

  const resend = new Resend(key);
  // Broadcast API: create then send — requires explicit confirm above
  const created = await resend.broadcasts.create({
    audienceId,
    from: process.env.RESEND_FROM || "Grok Bot Daily <hello@shotpup.com>",
    subject: issue.title,
    html,
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
