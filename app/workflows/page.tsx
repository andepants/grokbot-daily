import type { Metadata } from "next";
import Link from "next/link";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { WorkflowItem } from "@/components/WorkflowItem";
import { issueNumber, listIssues } from "@/lib/issues";
import { KINDS, workflowsByKind, WORKFLOWS } from "@/lib/library";
import { alternatesFor } from "@/lib/meta";

const KIND_PLURAL: Record<string, string> = {
  Routine: "Routines",
  Skill: "Skills",
  Harness: "Harnesses",
  Prompting: "Prompting",
  Safety: "Safety",
  Template: "Marketplace templates",
};

export const metadata: Metadata = {
  title: "Workflow library",
  description: "Grok Bot routines, skills, harnesses and templates people shared publicly, each linked to its source.",
  alternates: alternatesFor("/workflows"),
};

export default function WorkflowsPage() {
  const issues = listIssues();
  const groups = KINDS.map((k) => ({ kind: k, items: workflowsByKind(k) })).filter((g) => g.items.length > 0);
  return (
    <main id="main" className="container page">
      <div className="page-head">
        <h1>Workflow library</h1>
        <p className="lead">
          {WORKFLOWS.length} setups people shared in public, sorted by type. Each one links to the original post, with a
          short summary in our words and one thing you can try today.
        </p>
      </div>
      <div className="split">
        <nav className="toc" aria-label="Workflow types">
          <p className="toc-title">Jump to</p>
          <ul>
            {groups.map((g) => (
              <li key={g.kind}>
                <a href={`#${g.kind.toLowerCase()}`}>
                  {KIND_PLURAL[g.kind]} <span className="count">{g.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="split-main">
          {groups.map((g) => (
            <section key={g.kind} className="wf-group" aria-labelledby={`${g.kind.toLowerCase()}-title`}>
              <h2 id={`${g.kind.toLowerCase()}-title`}>
                <span id={g.kind.toLowerCase()} className="anchor" />
                {KIND_PLURAL[g.kind]}
              </h2>
              {g.items.map((w) => (
                <WorkflowItem key={w.slug} w={w} issueNo={w.issue ? issueNumber(w.issue, issues) : null} />
              ))}
            </section>
          ))}
          <p className="muted fineprint">
            Seen a setup that belongs here? Reply to any issue or open a pull request on{" "}
            <a href="https://github.com/andepants/grokbot-daily" rel="noreferrer">
              GitHub
            </a>
            . How we pick and check entries: <Link href="/about">editorial standards</Link>.
          </p>
          <SubscribeBlock formId="workflows" title="Get new workflows every morning" />
        </div>
      </div>
    </main>
  );
}
