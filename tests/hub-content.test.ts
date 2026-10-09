import { describe, expect, it } from "vitest";
import { getGuide, isValidGuideSlug, listGuides } from "@/lib/guides";
import { getIssue } from "@/lib/issues";
import { quoteWordCount, WORKFLOWS } from "@/lib/library";
import { RESOURCE_GROUPS } from "@/lib/resources";

describe("workflow library", () => {
  it("keeps every quote under 15 words", () => {
    for (const w of WORKFLOWS) if (w.quote) expect(quoteWordCount(w.quote), w.slug).toBeLessThan(15);
  });
  it("links every entry to an https source", () => {
    for (const w of WORKFLOWS) expect(w.source.url, w.slug).toMatch(/^https:\/\//);
  });
  it("uses X post URLs that match the credited handle", () => {
    for (const w of WORKFLOWS) {
      const m = w.source.url.match(/^https:\/\/x\.com\/([^/]+)\/status\/\d+$/);
      if (m) expect(m[1], w.slug).toBe(w.handle);
    }
  });
  it("has unique slugs and a date for each entry", () => {
    const slugs = WORKFLOWS.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const w of WORKFLOWS) expect(Boolean(w.date || w.checked), w.slug).toBe(true);
  });
  it("only references issues that exist", () => {
    for (const w of WORKFLOWS) if (w.issue) expect(getIssue(w.issue), w.slug).not.toBeNull();
  });
});

describe("guides", () => {
  it("loads every guide with a title, description and https sources", () => {
    const guides = listGuides();
    expect(guides.length).toBeGreaterThan(0);
    for (const g of guides) {
      expect(g.title.length).toBeGreaterThan(0);
      expect(g.description.length).toBeGreaterThan(0);
      expect(g.sources.length, g.slug).toBeGreaterThan(0);
      expect(getGuide(g.slug)?.content.length).toBeGreaterThan(100);
    }
  });
  it("rejects path-like slugs", () => {
    expect(isValidGuideSlug("../secrets")).toBe(false);
    expect(getGuide("../package")).toBeNull();
  });
});

describe("resources", () => {
  it("uses https links with notes", () => {
    for (const g of RESOURCE_GROUPS)
      for (const r of g.items) {
        expect(r.url).toMatch(/^https:\/\//);
        expect(r.note.length).toBeGreaterThan(0);
      }
  });
});
