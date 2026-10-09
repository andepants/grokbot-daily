import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type IssueMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type Issue = IssueMeta & { content: string };

const ISSUES_DIR = path.join(process.cwd(), "content", "issues");
const SLUG_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIssueSlug(slug: string) {
  return SLUG_RE.test(slug);
}

export function listIssues(): IssueMeta[] {
  if (!fs.existsSync(ISSUES_DIR)) return [];
  return fs
    .readdirSync(ISSUES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(ISSUES_DIR, file), "utf8");
      const { data } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      return {
        slug,
        title: String(data.title || slug),
        date: String(data.date || slug),
        description: String(data.description || ""),
      };
    })
    .filter((i) => isValidIssueSlug(i.slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getIssue(slug: string): Issue | null {
  if (!isValidIssueSlug(slug)) return null;
  const file = path.join(ISSUES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title || slug),
    date: String(data.date || slug),
    description: String(data.description || ""),
    content,
  };
}

/** Strip a hardcoded "Issue #N — " prefix; the number is derived from archive order. */
export function displayTitle(title: string) {
  return title.replace(/^Issue\s*#\d+\s*[—–:-]\s*/i, "").trim();
}

/** 1-based issue number, oldest = 1. */
export function issueNumber(slug: string, issues: IssueMeta[] = listIssues()) {
  const idx = issues.findIndex((i) => i.slug === slug);
  return idx === -1 ? null : issues.length - idx;
}

/** "Thu, Oct 8, 2026" (dates are calendar dates, so format in UTC). */
export function formatIssueDate(date: string, style: "long" | "short" = "long") {
  const d = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...(style === "long"
      ? { weekday: "short", month: "short", day: "numeric", year: "numeric" }
      : { month: "short", day: "numeric" }),
  });
}
