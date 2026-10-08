import { render } from "@react-email/render";
import { Resend } from "resend";
import { getIssue } from "../lib/issues";
import { IssueEmail } from "../emails/IssueEmail";
import { marked } from "./_markdown";

async function main() {
  if (process.env.CI) {
    console.error("Refusing to send preview in CI");
    process.exit(1);
  }
  const slug = process.argv[2];
  const email = process.argv[3];
  if (!slug || !email) {
    console.error("Usage: pnpm send:preview <slug> <email>");
    process.exit(1);
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY required");
  const mailingAddress =
    (process.env.MAILING_ADDRESS || "").trim() || "[MAILING_ADDRESS unset — preview only]";
  const issue = getIssue(slug);
  if (!issue) throw new Error(`Issue not found: ${slug}`);

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const issueUrl = `${site}/issues/${issue.slug}`;
  const htmlBody = marked(issue.content);
  const unsub = `${site}/api/unsubscribe?token=preview`;

  const html = await render(
    IssueEmail({
      title: issue.title,
      description: issue.description,
      htmlBody,
      issueUrl,
      unsubscribeUrl: unsub,
      mailingAddress,
    }),
  );

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM || "Grok Bot Daily <hello@shotpup.com>";
  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: `[Preview] ${issue.title}`,
    html,
    headers: {
      "List-Unsubscribe": `<${unsub}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log("preview_sent", data?.id || "ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
