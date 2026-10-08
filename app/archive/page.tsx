import type { Metadata } from "next";
import Link from "next/link";
import { listIssues } from "@/lib/issues";

export const metadata: Metadata = {
  title: "Archive",
  description: "Past issues of Grok Bot Daily.",
};

export default function ArchivePage() {
  const issues = listIssues();
  return (
    <main className="section">
      <div className="container">
        <h1>Archive</h1>
        <p className="muted">Every issue, newest first.</p>
        <div className="issue-list" style={{ marginTop: "1.5rem" }}>
          {issues.map((issue) => (
            <Link key={issue.slug} className="issue-row glass" href={`/issues/${issue.slug}`}>
              <div>
                <strong>{issue.title}</strong>
                <div className="issue-meta">{issue.description}</div>
              </div>
              <div className="issue-meta">{issue.date}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
