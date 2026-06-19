// Quick test: insert a dummy test result into Supabase test_results table
// Run with: node test-dummy-test.js

const https = require("https");

const SUPABASE_URL = "qglymhpdsjzkmdvzizdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbHltaHBkc2p6a21kdnppemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MzA3MDQsImV4cCI6MjA5NzQwNjcwNH0.BM2imaK3DDzJ_Wvmm0vwOPS-5A52Dz3RD5dI3zc5dGw";

function supabaseRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: SUPABASE_URL,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=representation",
      },
    };
    if (body) options.headers["Content-Length"] = Buffer.byteLength(body);

    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => raw += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(raw);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: raw });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTest() {
  console.log("Inserting dummy test result...\n");

  const result = await supabaseRequest(
    "/rest/v1/test_results",
    "POST",
    [{
      tester_name: "Test User (OpenCode)",
      section: "Directory",
      scenario: "Verify test results save to Supabase and display in Admin",
      priority: "important",
      status: "pass",
      notes: "Test inserted via Node script at " + new Date().toISOString(),
    }]
  );

  if (result.status >= 400) {
    console.error(" Error inserting test result:", JSON.stringify(result.data, null, 2));
    if (JSON.stringify(result.data).includes("does not exist")) {
      console.log("\n The 'test_results' table doesn't exist yet!");
      console.log("Please create it in Supabase SQL Editor with:\n");
      console.log(`CREATE TABLE IF NOT EXISTS test_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tester_name text,
  section text,
  feature text,
  scenario text,
  priority text,
  status text,
  notes text,
  created_at timestamptz DEFAULT now()
);`);
    }
    return;
  }

  console.log(" Test result inserted successfully!");
  console.log("Inserted row:", JSON.stringify(result.data, null, 2));

  console.log("\n Fetching all test results...");
  const fetchResult = await supabaseRequest(
    "/rest/v1/test_results?select=*&order=created_at.desc",
    "GET"
  );

  if (fetchResult.status >= 400) {
    console.error(" Error fetching results:", JSON.stringify(fetchResult.data, null, 2));
    return;
  }

  const results = fetchResult.data;
  console.log(` Found ${results.length} test result(s) in Supabase:\n`);
  results.forEach((r, i) => {
    console.log(`[${i + 1}] Tester: ${r.tester_name}`);
    console.log(`    Section: ${r.section} | Feature: ${r.feature}`);
    console.log(`    Status: ${r.status} | Priority: ${r.priority}`);
    console.log(`    Notes: ${(r.notes || "").slice(0, 60)}...`);
    console.log(`    Created: ${r.created_at}\n`);
  });

  console.log(" Done! Check the Admin Console -> 'Test Results' tab to see this entry.");
  console.log("   Admin URL: https://tich-labs.github.io/transform-health-directory/#admin\n");
}

runTest();
