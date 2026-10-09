import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type GuideSource = { label: string; url: string };
export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
  updated: string;
  minutes: number;
  sources: GuideSource[];
};
export type Guide = GuideMeta & { content: string };

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidGuideSlug(slug: string) {
  return SLUG_RE.test(slug);
}

function parse(slug: string, raw: string): Guide {
  const { data, content } = matter(raw);
  const sources = Array.isArray(data.sources)
    ? (data.sources as unknown[])
        .filter((s): s is GuideSource => {
          const o = s as Partial<GuideSource>;
          return typeof o?.label === "string" && typeof o?.url === "string" && /^https:\/\//.test(o.url);
        })
        .map((s) => ({ label: s.label, url: s.url }))
    : [];
  return {
    slug,
    title: String(data.title || slug),
    description: String(data.description || ""),
    order: Number(data.order) || 99,
    updated: String(data.updated || ""),
    minutes: Number(data.minutes) || 3,
    sources,
    content,
  };
}

export function listGuides(): GuideMeta[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter(isValidGuideSlug)
    .map((slug) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...meta } = parse(slug, fs.readFileSync(path.join(GUIDES_DIR, `${slug}.md`), "utf8"));
      return meta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getGuide(slug: string): Guide | null {
  if (!isValidGuideSlug(slug)) return null;
  const file = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return parse(slug, fs.readFileSync(file, "utf8"));
}
