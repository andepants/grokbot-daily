import { describe, expect, it } from "vitest";
import { displayTitle, formatIssueDate, issueNumber } from "@/lib/issues";

describe("issue display helpers", () => {
  it("strips a hardcoded issue prefix", () => {
    expect(displayTitle("Issue #1 — Routines, harnesses")).toBe("Routines, harnesses");
    expect(displayTitle("Plain title")).toBe("Plain title");
  });
  it("numbers issues oldest-first", () => {
    const list = [
      { slug: "2026-10-09", title: "b", date: "2026-10-09", description: "" },
      { slug: "2026-10-08", title: "a", date: "2026-10-08", description: "" },
    ];
    expect(issueNumber("2026-10-08", list)).toBe(1);
    expect(issueNumber("2026-10-09", list)).toBe(2);
    expect(issueNumber("2026-01-01", list)).toBeNull();
  });
  it("formats dates in UTC", () => {
    expect(formatIssueDate("2026-10-08")).toBe("Thu, Oct 8, 2026");
    expect(formatIssueDate("2026-10-08", "short")).toBe("Oct 8");
  });
});
