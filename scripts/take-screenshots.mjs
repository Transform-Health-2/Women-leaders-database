/**
 * Takes documentation screenshots of the Database, Analytics, and Submit sections.
 * Run with: node scripts/take-screenshots.mjs
 * Requires dev server running at http://localhost:5173
 *
 * The app uses hash routing: /#database, /#analytics, /#submit
 */

import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../docs/screenshots");
const BASE = "http://localhost:5173";

async function shot(page, filename, { fullPage = true } = {}) {
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, filename), fullPage });
  console.log("✓", filename);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // ── DATABASE ─────────────────────────────────────────────────────────────

  await page.goto(`${BASE}/#database`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "01-database-grid.png");

  // Profile modal
  const readMore = page.locator("button", { hasText: "Read more" }).first();
  if (await readMore.isVisible()) {
    await readMore.click();
    await page.waitForTimeout(600);
    await shot(page, "02-database-profile-modal.png", { fullPage: false });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  // Search in use
  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill("health");
    await page.waitForTimeout(700);
    await shot(page, "03-database-search.png");
    await searchInput.clear();
    await page.waitForTimeout(400);
  }

  // ── ANALYTICS ────────────────────────────────────────────────────────────

  await page.goto(`${BASE}/#analytics`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "04-analytics-overview.png");

  // ── SUBMIT — Step 0: branch selection (self) ─────────────────────────────

  await page.goto(`${BASE}/#submit`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await shot(page, "05-submit-step0-self.png");

  // ── SUBMIT — Step 0: nominate branch expanded ─────────────────────────────

  const nominateCard = page.locator("button").filter({ hasText: /nominating someone else/i }).first();
  if (await nominateCard.isVisible()) {
    await nominateCard.click();
    await page.waitForTimeout(700);
    await shot(page, "06-submit-step0-nominate.png");
  } else {
    console.log("  (nominate card not found — skipping 06)");
  }

  // ── SUBMIT — Step 1: Consent ───────────────────────────────────────────

  // Reload and force self branch (localStorage may remember nominate)
  await page.goto(`${BASE}/#submit`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const selfCard2 = page.locator("button").filter({ hasText: /nominating myself/i }).first();
  if (await selfCard2.isVisible()) {
    await selfCard2.click();
    await page.waitForTimeout(400);
  }
  const continueBtn = page.locator("button").filter({ hasText: /CONTINUE/i }).first();
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
    await page.waitForTimeout(800);
    await shot(page, "07-submit-step1-consent.png");

    // ── SUBMIT — Step 2: Basic Info ────────────────────────────────────────

    const consentYes = page.locator("button").filter({ hasText: /Yes, I consent/i }).first();
    if (await consentYes.isVisible()) {
      await consentYes.click();
      await page.waitForTimeout(400);
      const consentContinue = page.locator("button").filter({ hasText: /CONTINUE/i }).first();
      if (await consentContinue.isVisible()) {
        await consentContinue.click();
        await page.waitForTimeout(800);
        await shot(page, "08-submit-step2-basicinfo.png");
      } else {
        console.log("  (consent continue btn not found — skipping 08)");
      }
    } else {
      console.log("  (consent yes btn not found — skipping 07+08)");
    }
  } else {
    console.log("  (continue btn not found — skipping 07+08)");
  }

  // ── SUBMIT — Steps 3–5: seed localStorage to jump directly to each step ──

  const DRAFT_KEY = "submit_profile_draft";
  const baseDraft = {
    branch: "self",
    consent: "yes",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    country: "Nigeria",
    org: "Transform Health Coalition",
    role: "Digital Health Lead",
    yearsExp: "8-15 yrs",
    expertise: ["AI & Automation", "Digital Health Policy", "Health Systems"],
    otherExpertise: "",
    geoScope: "Africa",
    selectedCountries: ["Nigeria", "Ghana", "Kenya"],
    bio: "Jane Doe is a digital health leader with over a decade of experience across Sub-Saharan Africa and South-East Asia. She specialises in health information systems, mHealth solutions, and digital health policy reform. Jane has led initiatives improving healthcare access for millions in underserved communities.",
    linkedin: "https://linkedin.com/in/janedoe",
    notableItems: [
      { title: "WHO Digital Health Strategy", link: "https://who.int", type: "Publication" },
    ],
    nominateLink: "",
    nominatorName: "",
    nominatorEmail: "",
    nomineeFirstName: "",
    nomineeLastName: "",
  };

  async function seedAndLoad(targetStep) {
    await page.goto(`${BASE}/#submit`, { waitUntil: "networkidle" });
    await page.evaluate(
      ({ key, draft }) => localStorage.setItem(key, JSON.stringify(draft)),
      { key: DRAFT_KEY, draft: { ...baseDraft, step: targetStep } }
    );
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
  }

  // Step 3: Profile details
  await seedAndLoad(3);
  await shot(page, "09-submit-step3-profile.png");

  // Step 4: Links & notable work
  await seedAndLoad(4);
  await shot(page, "10-submit-step4-links.png");

  // Step 5: Review & submit
  await seedAndLoad(5);
  await shot(page, "11-submit-step5-review.png");

  await browser.close();
  console.log("\nAll screenshots saved to docs/screenshots/");
}

main().catch((e) => { console.error(e); process.exit(1); });
