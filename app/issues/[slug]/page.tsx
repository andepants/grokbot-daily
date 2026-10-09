import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { getIssue, listIssues } from "@/lib/issues";
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
  return {
    title: issue.title,
    description: issue.description,
    openGraph: {
      title: issue.title,
      description: issue.description,
      url: `${siteUrl()}/issues/${issue.slug}`,
      type: "article",
      publishedTime: issue.date,
    },
  };
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) notFound();
  return (
    <main className="section">
      <article className="container prose">
        <p className="issue-date">{issue.date}</p>
        <h1>{issue.title}</h1>
        <p className="lead muted">{issue.description}</p>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{issue.content}</ReactMarkdown>
      </article>
      <section className="section section-compact" aria-label="Subscribe">
        <div className="container" style={{ maxWidth: 560 }}>
          <SubscribeBlock formId={`issue-${issue.slug}-subscribe`} title="Enjoyed this issue?" lead="Get the weekday digest in your inbox." />
        </div>
      </section>
    </main>
  );
}
