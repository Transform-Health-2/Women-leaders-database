-- Create test_results table for storing testing sheet submissions
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS test_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tester_name text,
  section text,
  scenario text,
  priority text,
  status text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (allow public inserts + reads for now, tighten before launch)
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert test results (testing sheet uses anon key)
CREATE POLICY "Allow public insert" ON test_results
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read test results (admin console uses anon key)
CREATE POLICY "Allow public select" ON test_results
  FOR SELECT USING (true);

-- Optional: allow updates/deletes (for admin management)
CREATE POLICY "Allow public update" ON test_results
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete" ON test_results
  FOR DELETE USING (true);

-- Grant access to anon role
GRANT ALL ON test_results TO anon;
GRANT ALL ON test_results TO authenticated;

-- Verify table was created
SELECT * FROM test_results LIMIT 5;
