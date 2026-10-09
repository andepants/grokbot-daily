import type { Metadata } from "next";
import { IssueList } from "@/components/IssueList";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { listIssues } from "@/lib/issues";
import { alternatesFor } from "@/lib/meta";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every past issue of Grok Bot Daily, newest first.",
  alternates: alternatesFor("/archive"),
};

export default function ArchivePage() {
  const issues = listIssues();
  return (
    <main id="main" className="container narrow page">
      <h1>All issues</h1>
      <p className="lead">Every issue, newest first. Also on <a href="/feed.xml">RSS</a>.</p>
      <IssueList issues={issues} total={issues.length} />
      <SubscribeBlock formId="archive" />
    </main>
  );
}
