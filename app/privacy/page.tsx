import type { Metadata } from "next";
import Link from "next/link";
import { alternatesFor } from "@/lib/meta";
import { CONTACT_EMAIL, SITE_NAME, SUBSCRIBE_CONSENT_TEXT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${SITE_NAME} handles your email address.`,
  alternates: alternatesFor("/privacy"),
};

export default function PrivacyPage() {
  return (
    <main id="main" className="container narrow page">
      <article className="prose">
        <h1>Privacy</h1>
        <p>
          {SITE_NAME} is published by <strong>The Heim Life LLC</strong>. We collect the email
          address you submit on the subscribe form so we can send a confirmation message and, after
          you confirm, one email each morning.
        </p>
        <p>
          When you tap Subscribe, you see this consent line on the form: &ldquo;{SUBSCRIBE_CONSENT_TEXT}&rdquo;{" "}
          (with a link to this page). Submitting the form sends explicit consent for this newsletter only; we still
          require email confirmation before any mail goes out.
        </p>
        <h2>What we store</h2>
        <ul>
          <li>Your email address, with Resend (our email provider), after you confirm.</li>
          <li>
            Short-lived rate-limit counters keyed by HMAC-SHA256 hashes of your IP and email (never
            the raw values) in Upstash Redis. IP counters expire in about 1 hour, per-email day
            counters in about 24 hours, and unconfirmed-send lifetime counters in about 30 days.
            Those counters are only used to stop abuse of the confirmation flow — not for marketing.
          </li>
        </ul>
        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell your email.</li>
          <li>We do not share it with advertisers.</li>
          <li>We do not add you to other products&apos; lists when you unsubscribe from this one.</li>
        </ul>
        <h2>Your choices</h2>
        <p>
          Every issue includes a one-click unsubscribe link and List-Unsubscribe headers. You can
          also email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to ask us to delete your contact
          record for this newsletter.
        </p>
        <p>
          <Link href="/">Back home</Link>
        </p>
      </article>
    </main>
  );
}
