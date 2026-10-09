import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { getGuide, listGuides } from "@/lib/guides";
import { formatIssueDate } from "@/lib/issues";
import { alternatesFor } from "@/lib/meta";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: alternatesFor(`/guides/${guide.slug}`),
    openGraph: { title: guide.title, description: guide.description, url: `${siteUrl()}/guides/${guide.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const all = listGuides();
  const idx = all.findIndex((g) => g.slug === slug);
  const next = all[idx + 1] ?? null;
  return (
    <main id="main" className="container narrow page">
      <article className="prose">
        <p className="issue-kicker">
          <span>Guide {idx + 1} of {all.length}</span>
          <span>{guide.minutes} min read</span>
        </p>
        <h1>{guide.title}</h1>
        {guide.description ? <p className="lead">{guide.description}</p> : null}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
        {guide.sources.length > 0 ? (
          <aside className="sources" aria-labelledby="sources-title">
            <h2 id="sources-title">Sources and further reading</h2>
            <ul>
              {guide.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            {guide.updated ? (
              <p className="muted">
                Last reviewed <time dateTime={guide.updated}>{formatIssueDate(guide.updated)}</time>
              </p>
            ) : null}
          </aside>
        ) : null}
      </article>
      <nav className="issue-pager" aria-label="More guides">
        <Link href="/guides">← All guides</Link>
        {next ? <Link href={`/guides/${next.slug}`}>Next: {next.title} →</Link> : null}
      </nav>
      <SubscribeBlock formId={`guide-${guide.slug}`} />
    </main>
  );
}
