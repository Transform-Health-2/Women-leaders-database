-- Admin roles table
-- Maps email addresses to roles for the admin console.
-- Run this in Supabase SQL Editor.

create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin', 'editor')),
  created_by text,
  created_at timestamptz default now()
);

-- Allow admins to read (authenticated users only)
alter table public.admin_roles enable row level security;

create policy "Authenticated users can read admin_roles"
  on public.admin_roles for select
  to authenticated
  using (true);

-- Only the edge function (service role) can insert/update
