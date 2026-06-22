-- Anon users cannot SELECT from the leaders table directly (migration 015).
-- This SECURITY DEFINER function runs as the table owner, so it can match on
-- the private leader_email column without exposing it to the caller.
-- It returns only public-safe fields — the same set as the public_leaders view.
CREATE OR REPLACE FUNCTION find_leader_by_email(
  p_first_name TEXT,
  p_last_name  TEXT,
  p_email      TEXT
)
RETURNS TABLE (
  id             TEXT,
  first_name     TEXT,
  last_name      TEXT,
  role           TEXT,
  organisation   TEXT,
  linkedin       TEXT,
  photo_url      TEXT,
  bio            TEXT,
  expertise      TEXT[],
  notable_items  JSONB,
  country        TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    id, first_name, last_name, role, organisation,
    linkedin, photo_url, bio, expertise, notable_items, country
  FROM leaders
  WHERE status = 'live'
    AND LOWER(TRIM(first_name))   = LOWER(TRIM(p_first_name))
    AND LOWER(TRIM(last_name))    = LOWER(TRIM(p_last_name))
    AND LOWER(TRIM(leader_email)) = LOWER(TRIM(p_email))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION find_leader_by_email(TEXT, TEXT, TEXT) TO anon;
