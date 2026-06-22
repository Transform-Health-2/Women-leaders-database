/**
 * Bulk seed script — posts all mock leaders to the live Apps Script as 'live' entries.
 *
 * Usage:
 *   ADMIN_PASSWORD=yourpassword node scripts/seed.mjs
 *
 * Or with a URL override:
 *   APPS_SCRIPT_URL=https://... ADMIN_PASSWORD=... node scripts/seed.mjs
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const MOCK_LEADERS = require("./seed-data.json");

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbw5n83E3eRyMCu6AwhobqtHAass5qf_s67-WHTLJyX5M1GGKkkUCK5TaTI4kS1tN6BWfQ/exec";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

if (!ADMIN_PASSWORD) {
  console.error("ERROR: set ADMIN_PASSWORD env var before running.\n  ADMIN_PASSWORD=yourpassword node scripts/seed.mjs");
  process.exit(1);
}

// Strip the test user (th_test_1) — only seed real leaders
const entries = MOCK_LEADERS.filter((l) => !l.id.startsWith("th_test_"));

console.log(`Seeding ${entries.length} leaders to:\n  ${APPS_SCRIPT_URL}\n`);

const body = JSON.stringify({
  action: "bulkSeed",
  adminPassword: ADMIN_PASSWORD,
  entries,
});

try {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "follow",
  });

  const text = await res.text();

  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (json.ok) {
    console.log(`✓ Seeded ${json.inserted} entries successfully.`);
  } else {
    console.error("✗ Seed failed:", json);
    process.exit(1);
  }
} catch (err) {
  console.error("✗ Network error:", err.message);
  process.exit(1);
}
