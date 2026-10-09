export const SITE_NAME = "Grok Bot Daily";
export const SITE_TAGLINE =
  "The best things people are doing with Grok Bot — distilled every weekday.";
export const SITE_DESCRIPTION =
  "An open-source daily newsletter of useful Grok Bot workflows, routines, skills, and demos spotted on X.";

/** Shown on the subscribe form; keep in sync with privacy copy. */
export const SUBSCRIBE_CONSENT_TEXT =
  "By subscribing you agree to get the weekday digest. Unsubscribe anytime.";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
