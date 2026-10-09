import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outDir = process.env.OUT_DIR ?? "./screenshots";
const prefix = process.env.PREFIX ?? "before";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext();

async function shot(page, name, width, { fullPage = true, suffix = "" } = {}) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto(baseUrl + (name === "home" ? "/" : name === "issue" ? "/issues/2026-10-08" : "/"), {
    waitUntil: "networkidle",
  });
  const file = `${outDir}/${prefix}--${name}-${width}${suffix}.png`;
  await page.screenshot({ path: file, fullPage });
  console.log("wrote", file);
}

const page = await context.newPage();
for (const width of [390, 1280]) {
  const fullPage = width === 1280;
  await shot(page, "home", width, { fullPage });
}
await shot(page, "home", 390, { fullPage: false, suffix: "-fold" });

await shot(page, "issue", 390, { fullPage: true });

const successPage = await context.newPage();
await successPage.setViewportSize({ width: 390, height: 844 });
await successPage.route("**/api/subscribe", (route) =>
  route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
);
await successPage.goto(baseUrl + "/", { waitUntil: "networkidle" });
await successPage.locator('input[type="email"]').first().fill("test@example.com");
await successPage.locator('button[type="submit"]').first().click();
await successPage.waitForSelector('[data-subscribe-success="true"]', { timeout: 8000 });
await successPage.waitForTimeout(400);
const successFile = `${outDir}/${prefix}--signup-success-390.png`;
await successPage.screenshot({ path: successFile, fullPage: false });
console.log("wrote", successFile);

await browser.close();
