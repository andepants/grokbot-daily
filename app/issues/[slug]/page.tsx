import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { displayTitle, formatIssueDate, getIssue, issueNumber, listIssues } from "@/lib/issues";
import { alternatesFor } from "@/lib/meta";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listIssues().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) return {};
  const title = `No. ${issueNumber(slug)}: ${displayTitle(issue.title)}`;
  return {
    title,
    description: issue.description,
    alternates: alternatesFor(`/issues/${issue.slug}`),
    openGraph: {
      title,
      description: issue.description,
      url: `${siteUrl()}/issues/${issue.slug}`,
      type: "article",
      publishedTime: issue.date,
    },
    twitter: { card: "summary_large_image", title, description: issue.description },
  };
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) notFound();
  const all = listIssues();
  const idx = all.findIndex((i) => i.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;
  return (
    <main id="main" className="container narrow page">
      <article className="prose">
        <p className="issue-kicker">
          <span>No. {issueNumber(slug, all)}</span>
          <time dateTime={issue.date}>{formatIssueDate(issue.date)}</time>
        </p>
        <h1>{displayTitle(issue.title)}</h1>
        {issue.description ? <p className="lead">{issue.description}</p> : null}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{issue.content}</ReactMarkdown>
      </article>
      {newer || older ? (
        <nav className="issue-pager" aria-label="More issues">
          {older ? <Link href={`/issues/${older.slug}`}>← Older</Link> : <span />}
          {newer ? <Link href={`/issues/${newer.slug}`}>Newer →</Link> : null}
        </nav>
      ) : null}
      <SubscribeBlock formId={`issue-${issue.slug}`} title="Get tomorrow’s issue" />
    </main>
  );
}
