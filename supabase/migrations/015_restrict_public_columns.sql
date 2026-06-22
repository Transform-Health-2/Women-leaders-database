-- Restrict which columns the anon role can read from the leaders table.
-- The app already limits its public SELECT list, but the anon key can query
-- any column via the Supabase REST API directly.  This view + REVOKE closes
-- that gap so only public-safe fields are accessible without authentication.

CREATE OR REPLACE VIEW public_leaders AS
SELECT
  id,
  first_name,
  last_name,
  role,
  organisation,
  bio,
  linkedin,
  photo_url,
  country,
  geo_scope,
  expertise,
  years_experience,
  countries,
  notable_items,
  created_at,
  linkedin_clicks
FROM leaders
WHERE status = 'live';

-- Let the anon role query this view
GRANT SELECT ON public_leaders TO anon;

-- Revoke direct table read from anon so they must go through the view.
-- Authenticated (admin) users keep full table access via their own RLS policies.
REVOKE SELECT ON leaders FROM anon;
