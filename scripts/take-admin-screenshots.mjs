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

// Create output folder if missing
fs.mkdirSync(OUT, { recursive: true });

async function shot(page, filename, opts = {}) {
  const { fullPage = false } = opts;
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, filename), fullPage });
  console.log("  ✓", filename);
}

async function goToTab(page, tab) {
  await page.goto(`${BASE}/?screenshot=true#admin?tab=${tab}`, { waitUntil: "networkidle" });
  // Wait for sidebar (confirms bypass worked and app loaded)
  await page.waitForSelector("aside", { timeout: 10000 });
  await page.waitForTimeout(2000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Navigate to admin with bypass — verify it works
  console.log("Opening admin with screenshot bypass…");
  await page.goto(`${BASE}/?screenshot=true#admin`, { waitUntil: "networkidle" });
  await page.waitForSelector("aside", { timeout: 12000 });
  await page.waitForTimeout(2500);
  console.log("Admin loaded ✓\n");

  // ── 01: OVERVIEW — admin landing / All Entries default view ───────────────
  console.log("Taking screenshots…");
  await goToTab(page, "all");
  await shot(page, "01-overview.png");

  // ── 02: DASHBOARD STATS — stat cards at top of All Entries ────────────────
  await goToTab(page, "all");
  await shot(page, "02-dashboard-stats.png");

  // ── 03: ALL ENTRIES — full table ──────────────────────────────────────────
  await goToTab(page, "all");
  await page.waitForSelector("table tbody tr", { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(800);
  await shot(page, "03-all-entries.png");

  // ── 10: ALL ENTRIES — expanded leader row ─────────────────────────────────
  // Click View on first pending row, otherwise first any row
  let expanded = false;

  const viewBtns = page.locator("table button").filter({ hasText: /^View$/i });
  const count = await viewBtns.count();

  if (count > 0) {
    await viewBtns.first().click();
    await page.waitForTimeout(1200);
    await shot(page, "10-all-entries-expanded.png");
    expanded = true;
  }

  if (!expanded) {
    const firstRow = page.locator("tbody tr").first();
    if (await firstRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstRow.click();
      await page.waitForTimeout(1200);
      await shot(page, "10-all-entries-expanded.png");
    } else {
      console.log("  ⚠  No rows found — skipping 10-all-entries-expanded.png");
    }
  }

  // ── 04: PROFILE REQUESTS — New ────────────────────────────────────────────
  await goToTab(page, "requests");
  const newTab = page.locator("button").filter({ hasText: /^New/i }).first();
  if (await newTab.isVisible({ timeout: 3000 }).catch(() => false)) await newTab.click();
  await page.waitForTimeout(800);
  await shot(page, "04-profile-requests-new.png");

  // ── 05: PROFILE REQUESTS — Updates ────────────────────────────────────────
  const updatesTab = page.locator("button").filter({ hasText: /^Updates/i }).first();
  if (await updatesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await updatesTab.click();
    await page.waitForTimeout(800);
    await shot(page, "05-profile-requests-updates.png");
  } else {
    console.log("  ⚠  Updates tab not found — skipping 05");
  }

  // ── 06: PROFILE REQUESTS — Deletes ────────────────────────────────────────
  const deletesTab = page.locator("button").filter({ hasText: /^Deletes/i }).first();
  if (await deletesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await deletesTab.click();
    await page.waitForTimeout(800);
    await shot(page, "06-profile-requests-deletes.png");
  } else {
    console.log("  ⚠  Deletes tab not found — skipping 06");
  }

  // ── 07: NOMINATED ─────────────────────────────────────────────────────────
  await goToTab(page, "nominated");
  await page.waitForTimeout(800);
  await shot(page, "07-nominated.png");

  // ── 12: MANAGE ADMIN USERS ────────────────────────────────────────────────
  await goToTab(page, "manage-admins");
  // This tab only renders for super_admin — bypass sets super_admin so it should show
  await page.waitForTimeout(800);
  const manageContent = page.locator("h2, h3").filter({ hasText: /admin/i }).first();
  if (await manageContent.isVisible({ timeout: 5000 }).catch(() => false)) {
    await shot(page, "12-manage-admin.png");
  } else {
    console.log("  ⚠  Manage Admin content not found — skipping 12");
  }

  await browser.close();
  console.log(`\n✅  All screenshots saved to:\n   ${OUT}`);
}

main().catch((e) => { console.error("\n❌", e.message); process.exit(1); });
