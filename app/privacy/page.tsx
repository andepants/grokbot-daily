import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${SITE_NAME} handles your email address.`,
};

export default function PrivacyPage() {
  return (
    <main className="section">
      <article className="container prose" style={{ maxWidth: 720 }}>
        <h1>Privacy</h1>
        <p>
          {SITE_NAME} is published by <strong>The Heim Life LLC</strong>. We collect the email
          address you submit on the subscribe form so we can send a confirmation message and, after
          you confirm, the weekday digest.
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
          Every digest includes a one-click unsubscribe link and List-Unsubscribe headers. You can
          also email{" "}
          <a href="mailto:hello@shotpup.com">hello@shotpup.com</a> to ask us to delete your contact
          record for this newsletter.
        </p>
        <p>
          <Link href="/">Back home</Link>
        </p>
      </article>
    </main>
  );
}
