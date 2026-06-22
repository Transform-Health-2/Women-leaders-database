/**
 * Takes fresh admin console screenshots for the in-app documentation.
 * Uses a DEV bypass in Admin.jsx (screenshot=true param) — no login needed.
 *
 * Usage:
 *   node scripts/take-admin-screenshots.mjs
 *
 * Requires dev server: cd client && npm run dev
 * Override port:  BASE_URL=http://localhost:5174 node scripts/take-admin-screenshots.mjs
 *
 * Output → client/public/screenshots/admin-manual/
 */

import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../client/public/screenshots/admin-manual");
const BASE = process.env.BASE_URL || "http://localhost:5173";

fs.mkdirSync(OUT, { recursive: true });

async function shot(page, filename) {
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
  console.log("  ✓", filename);
}

// Click a sidebar nav button by its visible label text
async function clickSidebar(page, labelPattern) {
  const btn = page.locator("aside button").filter({ hasText: labelPattern }).first();
  await btn.waitFor({ state: "visible", timeout: 6000 });
  await btn.click();
  await page.waitForTimeout(2000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Open admin with bypass — wait for sidebar
  console.log("Opening admin…");
  await page.goto(`${BASE}/?screenshot=true#admin`, { waitUntil: "networkidle" });
  await page.waitForSelector("aside", { timeout: 12000 });
  await page.waitForTimeout(2500);
  console.log("Admin loaded ✓\n");
  console.log("Taking screenshots…");

  // ── 01: OVERVIEW — landing state (All Entries, no row expanded) ────────────
  await clickSidebar(page, /All Entries/i);
  await page.waitForSelector("table tbody tr", { timeout: 8000 }).catch(() => {});
  await shot(page, "01-overview.png");

  // ── 02: DASHBOARD STATS — same view, stat cards at top ────────────────────
  await shot(page, "02-dashboard-stats.png");

  // ── 03: ALL ENTRIES — table with filters visible ───────────────────────────
  await shot(page, "03-all-entries.png");

  // ── 10: ALL ENTRIES — expanded leader row ─────────────────────────────────
  const viewBtn = page.locator("table button").filter({ hasText: /^View$/i }).first();
  if (await viewBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await viewBtn.scrollIntoViewIfNeeded();
    await viewBtn.click({ force: true });
    await page.waitForTimeout(1500);
    await shot(page, "10-all-entries-expanded.png");
    // Collapse it
    const hideBtn = page.locator("table button").filter({ hasText: /^Hide$/i }).first();
    if (await hideBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await hideBtn.click({ force: true });
    }
    await page.waitForTimeout(600);
  } else {
    console.log("  ⚠  No View buttons found — skipping 10-all-entries-expanded.png");
  }

  // ── 04: PROFILE REQUESTS ──────────────────────────────────────────────────
  await clickSidebar(page, /Profile Requests/i);
  await shot(page, "04-profile-requests-new.png");

  // ── 07: NOMINATED ─────────────────────────────────────────────────────────
  await clickSidebar(page, /Nominated/i);
  await shot(page, "07-nominated.png");

  // ── 08: ACTIVITY LOG ──────────────────────────────────────────────────────
  await clickSidebar(page, /Activity Log/i);
  await shot(page, "08-activity-log.png");

  // ── 12: MANAGE ADMINS — click sidebar directly ────────────────────────────
  const manageBtn = page.locator("aside button").filter({ hasText: /Manage Admin/i }).first();
  if (await manageBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await shot(page, "12-manage-admin.png");
  } else {
    console.log("  ⚠  Manage Admins not in sidebar — skipping 12-manage-admin.png");
  }

  await browser.close();
  console.log(`\n✅  Done — screenshots saved to:\n   ${OUT}`);
}

main().catch((e) => { console.error("\n❌", e.message); process.exit(1); });
