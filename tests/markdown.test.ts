import { describe, expect, it } from "vitest";
import { marked } from "../scripts/_markdown";

describe("marked email markdown", () => {
  it("escapes HTML", () => {
    const html = marked('Hello <script>alert(1)</script>');
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("blocks javascript: links", () => {
    const html = marked("[x](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("x");
  });

  it("allows https links", () => {
    const html = marked("[docs](https://example.com/a)");
    expect(html).toContain('href="https://example.com/a"');
  });
});
