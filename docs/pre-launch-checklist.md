# Pre-Launch Checklist

Items to complete before the platform goes live — for the technical team.

## Done

- [x] Admin auth gate enabled — `Admin.jsx` checks `supabase.auth.getSession()` and requires login
- [x] Admin user created in Supabase Auth (`noreply@transformhealthcoalition.org`)
- [x] New Supabase project created under Transform Health account (`qglymhpdsjzkmdvzizdu`)
- [x] Schema migrated (leaders, requests, admin_roles tables)
- [x] All 82 leaders migrated from old project
- [x] RLS policies active (anon: read live leaders only; admin: full access)
- [x] Storage bucket `profile-photos` created and public-read
- [x] Edge Functions deployed (send-email, manage-admin)
- [x] `APPS_SCRIPT_URL` secret set in Supabase Edge Function settings
- [x] Role system live (super_admin, admin, editor)
- [x] Manage Admins tab with card UI, role badges, remove confirmation
- [x] Forgot password flow working via `supabase.auth.resetPasswordForEmail()`
- [x] CC support in email chain (ndifanji.namacha@transformhealthcoalition.org)

## Still Needed

- [ ] Verify GitHub Actions secrets are set in the repo:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Confirm CI/CD is operational — push to `main` triggers build + deploy
- [ ] Grant Transform Health team access to Supabase project (Dashboard → Project Settings → Team)
- [ ] Back up database (SQL dump of leaders, requests, admin_roles)
- [ ] Confirm the Google Apps Script Web App is deployed under a Transform Health Google Workspace account (and update `APPS_SCRIPT_URL` if redeployed)
- [ ] Test end-to-end: submit profile → approve → appears in directory → manage via magic link
- [ ] Decide on analytics (GA4 / Plausible / none)

## Notes

- No SMTP secrets needed (`GOOGLE_SMTP_USER`, `GOOGLE_SMTP_PASS`) — the Apps Script uses `MailApp.sendEmail()` which sends from the script owner's Google account automatically
- No custom domain needed — database is embedded at `transformhealth.rrzdev.co.za`
- Supabase Free Tier limits: 2 Edge Functions (at limit), no PITR backups. Pro ($25/mo) if adding more functions
