import type { Metadata } from "next";
import Link from "next/link";
import { GrokBot } from "@/components/GrokBot";
import { IssueList } from "@/components/IssueList";
import { StatusNotice } from "@/components/StatusNotice";
import { SubscribeForm } from "@/components/SubscribeForm";
import { listIssues } from "@/lib/issues";
import { alternatesFor } from "@/lib/meta";

export const metadata: Metadata = { alternates: alternatesFor("/") };

export default function HomePage() {
  const issues = listIssues();
  return (
    <main id="main" className="container narrow">
      <StatusNotice />
      <section className="hero" id="subscribe" aria-labelledby="hero-title">
        <GrokBot size={88} live className="hero-bot" />
        <h1 id="hero-title">The best of Grok&nbsp;Bot, every&nbsp;morning.</h1>
        <p className="lead">
          One short email a day with the most useful Grok Bot workflows, routines, and skills people shared on X.
          Free and open source.
        </p>
        <SubscribeForm formId="hero" />
      </section>

      <section className="block" aria-labelledby="latest-title">
        <div className="block-head">
          <h2 id="latest-title">Latest issues</h2>
          {issues.length > 3 ? <Link href="/archive">All issues</Link> : null}
        </div>
        <IssueList issues={issues.slice(0, 3)} total={issues.length} />
      </section>

      <section className="block" aria-labelledby="what-title">
        <h2 id="what-title">What’s inside</h2>
        <ul className="points">
          <li>
            <strong>Setups you can copy.</strong> Routines, harnesses, and skills people actually run, linked to the
            original post.
          </li>
          <li>
            <strong>One thing to try.</strong> Every issue ends with a small change you can make to your own bot today.
          </li>
          <li>
            <strong>Honest notes.</strong> When a viral list looks off, we say so.
          </li>
        </ul>
      </section>
    </main>
  );
}
