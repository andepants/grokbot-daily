import type { MetadataRoute } from "next";
import { listIssues } from "@/lib/issues";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const issues = listIssues().map((i) => ({
    url: `${base}/issues/${i.slug}`,
    lastModified: i.date,
  }));
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/archive`, lastModified: new Date() },
    ...issues,
  ];
}
