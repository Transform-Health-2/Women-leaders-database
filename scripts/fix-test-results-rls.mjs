/**
 * Fix RLS on test_results so the anon role can INSERT/UPSERT from the browser.
 *
 * The upsert was failing because Postgres needs a SELECT policy to evaluate
 * whether to INSERT or UPDATE — without it, the UPDATE half of ON CONFLICT fails.
 * Simplest fix: disable RLS entirely (test feedback data isn't sensitive).
 *
 * Usage:
 *   SUPABASE_SERVICE_KEY=eyJ... node scripts/fix-test-results-rls.mjs
 *
 * OR — run the SQL manually in Supabase Dashboard → SQL Editor:
 *   ALTER TABLE public.test_results DISABLE ROW LEVEL SECURITY;
 *   GRANT ALL ON public.test_results TO anon;
 *   GRANT USAGE ON SCHEMA public TO anon;
 */

import pkg from "pg";
const { Client } = pkg;

const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE_KEY) {
  console.error("Set SUPABASE_SERVICE_KEY env var. Find it in Supabase → Settings → API → service_role.");
  process.exit(1);
}

// Supabase connection pooler (port 5432 on direct host is often blocked by ISPs)
const DB_URL = "postgresql://postgres.bahoslsvhwqybqkjonvb:" + SERVICE_KEY +
  "@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require";

const client = new Client({ connectionString: DB_URL });

async function run() {
  await client.connect();
  console.log("Connected to Supabase via pooler.");

  const stmts = [
    // Add session_id column if not already present
    "ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS session_id text",
    // Disable RLS — test feedback data is not sensitive
    "ALTER TABLE public.test_results DISABLE ROW LEVEL SECURITY",
    // Ensure anon has full access
    "GRANT USAGE ON SCHEMA public TO anon",
    "GRANT ALL ON public.test_results TO anon",
  ];

  for (const sql of stmts) {
    await client.query(sql);
    console.log("✓", sql);
  }

  console.log("\nDone. Anon role can now INSERT/UPSERT test_results without RLS blocking.");
  await client.end();
}

run().catch(err => {
  console.error(err.message);
  process.exit(1);
});
