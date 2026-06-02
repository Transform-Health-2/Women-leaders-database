import { chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";

const BASE = "http://localhost:5174";
const OUT = "client/public/screenshots/admin-manual";

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const MANUAL = [
  { name: "01-overview", tab: "all" },
  { name: "02-dashboard-stats", tab: "all" },
  { name: "03-all-entries", tab: "all" },
  { name: "04-profile-requests-new", tab: "requests", sub: "New" },
  { name: "05-profile-requests-updates", tab: "requests", sub: "Updates" },
  { name: "06-profile-requests-deletes", tab: "requests", sub: "Deletes" },
  { name: "07-nominated", tab: "nominated" },
  { name: "08-test-results", tab: "tests" },
  { name: "09-test-fixes", tab: "fixes" },
  { name: "10-all-entries-expanded", tab: "all", expandFirstPending: true },
];

const TAB_LABELS = {
  all: "All Entries",
  requests: "Profile Requests",
  nominated: "Nominated",
  tests: "Test Results",
  fixes: "Test Fixes",
};

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE}/#admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  for (const shot of MANUAL) {
    console.log(`📸 ${shot.name}`);

    // Click sidebar tab
    const label = TAB_LABELS[shot.tab];
    if (!label) throw new Error(`Unknown tab: ${shot.tab}`);
    const tabBtn = page.locator("aside button", { hasText: label }).first();
    if (await tabBtn.isVisible()) await tabBtn.click();
    await page.waitForTimeout(600);

    // Click sub-tab if needed
    if (shot.sub) {
      const subBtn = page.locator("main button", { hasText: shot.sub }).first();
      if (await subBtn.isVisible()) await subBtn.click();
      await page.waitForTimeout(600);
    }

    // Expand first pending row if requested
    if (shot.expandFirstPending) {
      const row = page.locator('main table tbody tr').filter({ hasText: /pending/i }).first();
      if (await row.isVisible()) await row.click();
      await page.waitForTimeout(800);
    }

    await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: false });
    console.log(`  ✅ ${OUT}/${shot.name}.png`);
  }

  await browser.close();
  console.log("🎉 All done!");
}

main().catch(console.error);
