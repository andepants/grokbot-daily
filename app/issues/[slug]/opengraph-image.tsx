import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og";
import { displayTitle, formatIssueDate, getIssue, issueNumber, listIssues } from "@/lib/issues";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Grok Bot Daily issue";

export function generateStaticParams() {
  return listIssues().map((i) => ({ slug: i.slug }));
}

export default async function IssueOg({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getIssue(slug);
  const n = issue ? issueNumber(slug) : null;
  return new ImageResponse(
    <OgCard
      kicker={issue ? `No. ${n} · ${formatIssueDate(issue.date)}` : "Grok Bot Daily"}
      title={issue ? displayTitle(issue.title) : "Grok Bot Daily"}
      sub={issue?.description ?? ""}
    />,
    size,
  );
}
