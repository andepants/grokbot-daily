import { describe, expect, it } from "vitest";
import { getIssue, isValidIssueSlug } from "@/lib/issues";

describe("issue slug", () => {
  it("accepts YYYY-MM-DD only", () => {
    expect(isValidIssueSlug("2026-10-08")).toBe(true);
    expect(isValidIssueSlug("../README")).toBe(false);
    expect(isValidIssueSlug("2026-10-08.md")).toBe(false);
  });

  it("getIssue rejects traversal slugs", () => {
    expect(getIssue("../../package")).toBeNull();
  });
});
