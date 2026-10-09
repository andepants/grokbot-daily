import type { Metadata } from "next";
import Link from "next/link";
import { GrokBot } from "@/components/GrokBot";
import { IssueList } from "@/components/IssueList";
import { StatusNotice } from "@/components/StatusNotice";
import { SubscribeForm } from "@/components/SubscribeForm";
import { WorkflowItem } from "@/components/WorkflowItem";
import { listGuides } from "@/lib/guides";
import { listIssues } from "@/lib/issues";
import { latestWorkflows, WORKFLOWS } from "@/lib/library";
import { alternatesFor } from "@/lib/meta";
import { RESOURCE_GROUPS } from "@/lib/resources";

export const metadata: Metadata = { alternates: alternatesFor("/") };

export default function HomePage() {
  const issues = listIssues();
  const guides = listGuides();
  const picks = latestWorkflows(3);
  const official = RESOURCE_GROUPS.find((g) => g.id === "official")?.items.slice(0, 4) ?? [];
  return (
    <main id="main" className="container">
      <StatusNotice />
      <section className="hero" id="subscribe" aria-labelledby="hero-title">
        <div className="hero-copy">
          <GrokBot size={64} live className="hero-bot hero-bot--sm" />
          <h1 id="hero-title">The best of Grok&nbsp;Bot, every&nbsp;morning.</h1>
          <p className="lead">
            A short daily email and an open library of the Grok Bot workflows, routines and skills people actually run.
            Every item links to its source.
          </p>
          <SubscribeForm formId="hero" />
        </div>
        <div className="hero-art" aria-hidden>
          <GrokBot size={280} live className="hero-bot" />
        </div>
      </section>

      <section className="section" aria-labelledby="latest-title">
        <div className="section-head">
          <h2 id="latest-title">Latest issue</h2>
          <p className="muted">One email a day. Read past issues here.</p>
          <Link className="more" href="/issues">
            All issues
          </Link>
        </div>
        <div className="section-body">
          <IssueList issues={issues.slice(0, 3)} total={issues.length} />
        </div>
      </section>

      <section className="section" aria-labelledby="guides-title">
        <div className="section-head">
          <h2 id="guides-title">Start here</h2>
          <p className="muted">Short guides for getting a bot to do real work safely.</p>
          <Link className="more" href="/guides">
            All guides
          </Link>
        </div>
        <ol className="guide-list section-body">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link className="guide-row" href={`/guides/${g.slug}`}>
                <span className="guide-title">{g.title}</span>
                <span className="guide-desc">{g.description}</span>
                <span className="guide-meta">{g.minutes} min read</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="library-title">
        <div className="section-head">
          <h2 id="library-title">From the library</h2>
          <p className="muted">
            {WORKFLOWS.length} setups people shared, each with the original post and one thing to try.
          </p>
          <Link className="more" href="/workflows">
            Browse workflows
          </Link>
        </div>
        <div className="section-body wf-stack">
          {picks.map((w) => (
            <WorkflowItem key={w.slug} w={w} compact />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="res-title">
        <div className="section-head">
          <h2 id="res-title">Resources</h2>
          <p className="muted">Official docs, community projects and accounts worth following.</p>
          <Link className="more" href="/resources">
            All resources
          </Link>
        </div>
        <ul className="link-list section-body">
          {official.map((r) => (
            <li key={r.url}>
              <a href={r.url} rel="noreferrer">
                {r.title}
                <span aria-hidden> ↗</span>
              </a>
              <span className="muted">{r.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
