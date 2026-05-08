-- Add geo_scope column to leaders table
ALTER TABLE public.leaders ADD COLUMN IF NOT EXISTS geo_scope text;

-- Grant access
GRANT ALL ON public.leaders TO anon;
