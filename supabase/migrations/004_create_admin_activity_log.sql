-- Admin activity log table
-- Tracks when admins are added or removed, and by whom.
-- Run this in Supabase SQL Editor before deploying the updated manage-admin function.

create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,          -- 'add_admin' | 'remove_admin'
  target_email text not null,
  role text,
  performed_by text not null,
  created_at timestamptz default now()
);

alter table public.admin_activity_log enable row level security;

create policy "Authenticated users can read admin_activity_log"
  on public.admin_activity_log for select
  to authenticated
  using (true);

-- Only the edge function (service role) can insert
