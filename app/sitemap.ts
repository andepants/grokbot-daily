import type { MetadataRoute } from "next";
import { listGuides } from "@/lib/guides";
import { listIssues } from "@/lib/issues";
import { RESOURCES_CHECKED } from "@/lib/resources";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const issues = listIssues().map((i) => ({
    url: `${base}/issues/${i.slug}`,
    lastModified: i.date,
  }));
  const guides = listGuides().map((g) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: g.updated || undefined,
  }));
  const latest = issues[0]?.lastModified;
  return [
    { url: base, lastModified: latest },
    { url: `${base}/issues`, lastModified: latest },
    ...issues,
    { url: `${base}/workflows`, lastModified: latest },
    { url: `${base}/guides` },
    ...guides,
    { url: `${base}/resources`, lastModified: RESOURCES_CHECKED },
    { url: `${base}/about` },
    { url: `${base}/privacy` },
  ];
}
