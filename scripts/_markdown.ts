/** Tiny markdown-ish converter for email bodies (headings, links, lists, paragraphs). */
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
  const inline = (s: string) =>
    s
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

  for (const line of lines) {
    if (/^\s*-\s+/.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^\s*-\s+/, ""))}</li>`);
      continue;
    }
    flushList();
    if (/^###\s+/.test(line)) out.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`);
    else if (/^##\s+/.test(line)) out.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`);
    else if (/^#\s+/.test(line)) out.push(`<h1>${inline(line.replace(/^#\s+/, ""))}</h1>`);
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
  }
  flushList();
  return out.join("\n");
}
