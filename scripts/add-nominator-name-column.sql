-- Add nominator_name column to leaders table
-- Run this in Supabase SQL Editor

ALTER TABLE public.leaders
ADD COLUMN IF NOT EXISTS nominator_name text;

COMMENT ON COLUMN public.leaders.nominator_name IS 'Name of person who nominated this leader (for nominate branch submissions)';

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leaders'
  AND column_name = 'nominator_name';
