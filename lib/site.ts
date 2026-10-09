export const SITE_NAME = "Grok Bot Daily";
export const SITE_TAGLINE = "The best things people are doing with Grok Bot, every morning.";
export const SITE_DESCRIPTION =
  "A free, open-source daily email with the most useful Grok Bot workflows, routines, and skills people shared on X.";

/** Shown on the subscribe form; keep in sync with privacy copy. */
export const SUBSCRIBE_CONSENT_TEXT =
  "By subscribing you agree to get one Grok Bot Daily email each morning. Unsubscribe anytime.";

export const CONTACT_EMAIL = "hello@shotpup.com";
export const REPO_URL = "https://github.com/andepants/grokbot-daily";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
