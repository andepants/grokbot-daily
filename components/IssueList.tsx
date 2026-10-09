import Link from "next/link";
import { displayTitle, formatIssueDate, type IssueMeta } from "@/lib/issues";

export function IssueList({ issues, total }: { issues: IssueMeta[]; total: number }) {
  if (issues.length === 0) return <p className="muted">The first issue is on its way.</p>;
  return (
    <ol className="issue-list" reversed start={total}>
      {issues.map((issue, i) => (
        <li key={issue.slug}>
          <Link className="issue-row" href={`/issues/${issue.slug}`}>
            <span className="issue-meta">
              <span>No. {total - i}</span>
              <time dateTime={issue.date}>{formatIssueDate(issue.date)}</time>
            </span>
            <span className="issue-title">{displayTitle(issue.title)}</span>
            {issue.description ? <span className="issue-desc">{issue.description}</span> : null}
          </Link>
        </li>
      ))}
    </ol>
  );
}
