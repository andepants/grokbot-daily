import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
const icon = readFileSync(join(process.cwd(), "app/icon.svg"), "utf8");

function botKeyframes(): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /@keyframes (bot-[\w-]+) \{([\s\S]*?)\n\}/g;
  for (const m of css.matchAll(re)) out[m[1]] = m[2];
  return out;
}

describe("round bot mark", () => {
  it("never animates the mark out of view (visible at first paint)", () => {
    const frames = botKeyframes();
    expect(Object.keys(frames).length).toBeGreaterThan(4);
    for (const [name, body] of Object.entries(frames)) {
      expect(body, name).not.toMatch(/opacity:\s*0(\.0+)?;/);
      expect(body, name).not.toMatch(/scale\(0\)|scaleX\(0\)/);
    }
  });

  it("keeps the original round-bot favicon (head, antenna, two pill eyes)", () => {
    expect(icon).toContain('<circle cx="24" cy="29" r="17"');
    expect(icon).toContain('<circle cx="24" cy="5" r="3.5"');
    expect(icon.match(/<rect x="\d+(\.\d+)?" y="23" width="5" height="11"/g)).toHaveLength(2);
  });
});
