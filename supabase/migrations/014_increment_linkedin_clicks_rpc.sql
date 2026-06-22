-- Atomic increment for linkedin_clicks — avoids lost-update race condition
-- under concurrent users (replaces the non-atomic read-then-write fallback in leaders.js).
CREATE OR REPLACE FUNCTION increment_linkedin_clicks(leader_id TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE leaders
  SET linkedin_clicks = COALESCE(linkedin_clicks, 0) + 1
  WHERE id = leader_id;
$$;
