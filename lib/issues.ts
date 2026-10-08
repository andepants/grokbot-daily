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
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getIssue(slug: string): Issue | null {
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
