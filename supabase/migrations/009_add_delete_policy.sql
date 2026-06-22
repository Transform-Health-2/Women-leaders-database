-- Test mode: allow anon to delete leaders (required for Admin "Delete entry" button)
-- Remove this policy before launch and replace with an authenticated admin policy.
create policy "Admin test mode: delete leaders"
  on public.leaders for delete
  to public
  using (true);
