import Link from "next/link";
import { formatIssueDate } from "@/lib/issues";
import type { Workflow } from "@/lib/library";

export function WorkflowItem({ w, issueNo, compact = false }: { w: Workflow; issueNo?: number | null; compact?: boolean }) {
  const headingId = `wf-${w.slug}`;
  return (
    <article className={`wf${compact ? " wf--compact" : ""}`} id={compact ? undefined : w.slug} aria-labelledby={headingId}>
      <h3 id={headingId} className="wf-title">
        {compact ? <Link href={`/workflows#${w.slug}`}>{w.title}</Link> : w.title}
      </h3>
      <p className="wf-meta">
        <span className="tag">{w.kind}</span>
        <span>
          {w.handle ? (
            <a href={`https://x.com/${w.handle}`} rel="noreferrer">
              {w.author}
            </a>
          ) : (
            w.author
          )}
        </span>
        {w.date ? <time dateTime={w.date}>{formatIssueDate(w.date, "short")}</time> : null}
      </p>
      {w.quote ? (
        <blockquote className="wf-quote">
          <p>“{w.quote}”</p>
        </blockquote>
      ) : null}
      {compact ? null : (
        <>
          <p className="wf-summary">{w.summary}</p>
          <p className="wf-try">
            <strong>Try it:</strong> {w.tryIt}
          </p>
          {w.note ? <p className="wf-note">{w.note}</p> : null}
          <p className="wf-links">
            <a href={w.source.url} rel="noreferrer">
              {w.source.label}
              <span className="sr-only"> for “{w.title}”</span>
              <span aria-hidden> ↗</span>
            </a>
            {w.issue ? (
              <Link href={`/issues/${w.issue}`}>Featured in No.&nbsp;{issueNo ?? ""}</Link>
            ) : null}
            {w.checked ? (
              <span className="muted">
                Checked <time dateTime={w.checked}>{formatIssueDate(w.checked, "short")}</time>
              </span>
            ) : null}
          </p>
        </>
      )}
    </article>
  );
}
