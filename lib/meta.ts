import { siteUrl } from "./site";

/** Canonical + RSS alternate for a path (child `alternates` replaces the root object). */
export function alternatesFor(path: string) {
  return {
    canonical: path,
    types: { "application/rss+xml": `${siteUrl()}/feed.xml` },
  };
}
