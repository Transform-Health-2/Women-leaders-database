-- Backfill missing country data for leaders
-- Run this in Supabase SQL Editor to list leaders with NULL country

-- Step 1: Preview leaders missing country data
SELECT id, first_name, last_name, country, created_at
FROM leaders
WHERE country IS NULL OR country = ''
ORDER BY created_at DESC;

-- Step 2: Once you know the correct country for each leader, update them:
-- UPDATE leaders SET country = '<COUNTRY>' WHERE id = '<UUID>';
-- UPDATE leaders SET country = '<COUNTRY>' WHERE id = '<UUID>';

-- Example:
-- UPDATE leaders SET country = 'Kenya' WHERE id = 'some-uuid-here';

-- Step 3: Verify no more nulls remain
-- SELECT COUNT(*) AS missing_country_count FROM leaders WHERE country IS NULL OR country = '';
