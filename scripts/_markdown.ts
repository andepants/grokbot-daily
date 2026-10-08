/** Tiny markdown-ish converter for email bodies (headings, links, lists, paragraphs). */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(href: string): string | null {
  const t = href.trim();
  if (/^https?:\/\//i.test(t) || t.startsWith("mailto:")) return t;
  return null;
}

function inlineSafe(s: string): string {
  const parts: string[] = [];
  let i = 0;
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > i) parts.push(escapeHtml(s.slice(i, m.index)));
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      if (href) parts.push(`<a href="${escapeHtml(href)}">${escapeHtml(m[1])}</a>`);
      else parts.push(escapeHtml(m[1]));
    } else if (m[3] !== undefined) {
      parts.push(`<strong>${escapeHtml(m[3])}</strong>`);
    } else if (m[4] !== undefined) {
      parts.push(`<code>${escapeHtml(m[4])}</code>`);
    }
    i = m.index + m[0].length;
  }
  if (i < s.length) parts.push(escapeHtml(s.slice(i)));
  return parts.join("");
}

export function marked(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inList = false;
  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const line of lines) {
    if (/^\s*-\s+/.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inlineSafe(line.replace(/^\s*-\s+/, ""))}</li>`);
      continue;
    }
    flushList();
    if (/^###\s+/.test(line)) out.push(`<h3>${inlineSafe(line.replace(/^###\s+/, ""))}</h3>`);
    else if (/^##\s+/.test(line)) out.push(`<h2>${inlineSafe(line.replace(/^##\s+/, ""))}</h2>`);
    else if (/^#\s+/.test(line)) out.push(`<h1>${inlineSafe(line.replace(/^#\s+/, ""))}</h1>`);
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inlineSafe(line)}</p>`);
  }
  flushList();
  return out.join("\n");
}
