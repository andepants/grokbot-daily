import type { MetadataRoute } from "next";
import { listIssues } from "@/lib/issues";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const issues = listIssues().map((i) => ({
    url: `${base}/issues/${i.slug}`,
    lastModified: i.date,
  }));
  const latest = issues[0]?.lastModified;
  return [
    { url: base, lastModified: latest },
    { url: `${base}/archive`, lastModified: latest },
    ...issues,
    { url: `${base}/privacy` },
  ];
}
