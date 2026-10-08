import { listIssues, getIssue } from "@/lib/issues";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const base = siteUrl();
  const items = listIssues()
    .map((meta) => {
      const issue = getIssue(meta.slug);
      if (!issue) return "";
      const url = `${base}/issues/${issue.slug}`;
      return `<item>
  <title><![CDATA[${issue.title}]]></title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(issue.date).toUTCString()}</pubDate>
  <description><![CDATA[${issue.description}]]></description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${SITE_NAME}</title>
  <link>${base}</link>
  <description>${SITE_DESCRIPTION}</description>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
