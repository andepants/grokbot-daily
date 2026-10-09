import type { Metadata } from "next";
import Link from "next/link";
import { alternatesFor } from "@/lib/meta";
import { CONTACT_EMAIL, REPO_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About and editorial standards",
  description: `Who makes ${SITE_NAME}, how we pick what goes in, and how we handle sources and corrections.`,
  alternates: alternatesFor("/about"),
};

export default function AboutPage() {
  return (
    <main id="main" className="container narrow page">
      <article className="prose">
        <h1>About</h1>
        <p className="lead">
          {SITE_NAME} is a free daily email and an open library of what people are actually doing with Grok Bot. It’s
          published by The Heim Life LLC and the code is open source.
        </p>

        <h2>Editorial standards</h2>
        <ul>
          <li>
            <strong>Sourced from public posts.</strong> Every workflow and issue item links to the original post, guide or
            page. If we can’t link it, it doesn’t go in.
          </li>
          <li>
            <strong>Short quotes only.</strong> Quotes are copied word for word and kept under 15 words. Everything else is
            a summary in our own words, so go to the source for the full picture.
          </li>
          <li>
            <strong>No hype.</strong> When a post makes claims about speed, cost or results that we haven’t tested, we say
            they’re the author’s claims.
          </li>
          <li>
            <strong>Safety first.</strong> We don’t feature setups that ask you to paste secrets into chat, or installers
            we wouldn’t read before running. When a viral list looks off, we say so.
          </li>
          <li>
            <strong>Not affiliated.</strong> We’re independent readers, not part of the team that makes Grok Bot. No
            sponsors, no paid placements, no affiliate links.
          </li>
          <li>
            <strong>Dates on everything.</strong> Workflows show when they were posted, guides show when they were last
            reviewed, and resource links show when we last checked them.
          </li>
        </ul>

        <h2>How an issue gets made</h2>
        <p>
          Each morning we read public posts about Grok Bot from the past day, pick the few that teach something you can
          reuse, check the links, and write it up. A person approves every issue before it goes out. The best items move
          into the <Link href="/workflows">workflow library</Link>.
        </p>

        <h2>Corrections and suggestions</h2>
        <p>
          Spotted a mistake, or want your post removed or credited differently? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or open an issue on{" "}
          <a href={REPO_URL} rel="noreferrer">
            GitHub
          </a>
          . We fix errors in place and note the change.
        </p>
      </article>
    </main>
  );
}
