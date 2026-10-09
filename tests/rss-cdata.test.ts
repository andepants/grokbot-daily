import { describe, expect, it } from "vitest";

function cdata(s: string) {
  return s.replace(/]]>/g, "]]]]><![CDATA[>");
}

describe("rss cdata", () => {
  it("splits ]]> sequences", () => {
    expect(cdata("a]]>b")).toBe("a]]]]><![CDATA[>b");
  });
});
