# Transfer Checklist — Transform Health

This document lists everything required to transfer the Women Leaders in Digital Health Database codebase, assets, and associated resources from the development team to Transform Health.

---

## 1. Source Code & Repository

- [ ] **Transfer GitHub repository ownership** — see steps below
- [x] **Verify GitHub Actions secrets** are set in the new repo:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [x] **Remove stale secrets** — `VITE_ADMIN_CC_EMAIL` and `VITE_ADMIN_NOTIFY_EMAIL` deleted (moved to Edge Function Secrets)
- [x] **Confirm CI/CD is operational** — push to `main` triggers automatic build + deploy
- [ ] **Verify branch protection** rules are configured on `main` if desired

### GitHub Repository Transfer Steps

1. **Transform Health must have a GitHub organisation** — create one at `github.com/organizations/new` if they don't have one yet
2. Go to `github.com/tich-labs/transform-health-directory` → **Settings → Danger Zone → Transfer repository**
3. Enter the Transform Health GitHub org name → confirm transfer
4. **After transfer — re-add GitHub Actions secrets** in the new repo (secrets do not transfer automatically):
   - New repo → Settings → Secrets and variables → Actions → add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
5. **GitHub Pages URL changes** — the live URL becomes `https://<their-org>.github.io/transform-health-directory/`. Update:
   - `ALLOWED_ORIGINS` in `supabase/functions/self-service/index.ts` — add the new GitHub Pages domain
   - `ALLOWED_ORIGINS` in `supabase/functions/manage-admin/index.ts` — same
   - Deploy both Edge Functions after updating
6. **Admin URL changes** to `https://<their-org>.github.io/transform-health-directory/#admin` — share the new URL with the admin team
7. GitHub automatically redirects the old `tich-labs.github.io` URL for a period — do not rely on this permanently

## 2. Supabase Project

- [x] **Supabase project created** under Transform Health account (`qglymhpdsjzkmdvzizdu`)
- [ ] **Grant team access** — invite collaborators via Supabase Dashboard → Project Settings → Team
- [x] **Verify Edge Function secrets** are configured in Supabase Dashboard → Settings → Edge Functions → Secrets:
  - `APPS_SCRIPT_URL` — Google Apps Script Web App URL **(required)**
  - `MAGIC_LINK_SECRET` — HMAC secret for signing self-service tokens **(required)** — generate with `openssl rand -hex 32`
  - `ADMIN_NOTIFY_EMAIL` — address that receives self-service action notifications **(required)**
  - `ADMIN_CC_EMAIL` — staff address CC'd on enrichment emails sent to leaders **(required)**
  - `APPS_SCRIPT_KEY` — shared secret matching `RELAY_SECRET` in Apps Script properties (optional but recommended for defence-in-depth)
- [x] **Row Level Security (RLS)** policies are active — test-mode policies have been dropped; only production-grade authenticated policies remain
- [x] **Storage bucket** `profile-photos` exists and is public-read
- [ ] **Back up database** — export a SQL dump of all tables (`leaders`, `requests`, `admin_roles`)

> **Note:** `GOOGLE_SMTP_USER` and `GOOGLE_SMTP_PASS` are not used — the Apps Script uses `MailApp.sendEmail()` directly (no SMTP credentials needed). All three secrets above are required.

## 3. Database Migrations

After deploying code, run the following SQL in Supabase Dashboard → SQL Editor if not already applied:

- [x] **014_increment_linkedin_clicks_rpc.sql** — creates the `increment_linkedin_clicks(leader_id TEXT)` function used by the directory click counter. **Deployed and verified.**

- [x] **015_restrict_public_columns.sql** — creates the `public_leaders` view and revokes direct anon SELECT on the `leaders` table to prevent column-level data leaks via the REST API. **Deployed and verified.**

- [ ] **016_find_leader_rpc.sql** — creates the `find_leader_by_email(TEXT, TEXT, TEXT)` SECURITY DEFINER function required for the self-service "Manage my profile" lookup. Without this, leaders cannot find their own profile (migration 015 revoked anon access to the base table). **Run this in Supabase Dashboard → SQL Editor.**

## 4. Email & Google Workspace

- [ ] **Google Apps Script Web App** — confirm which Google account owns the deployed script (if it's already a TH account, nothing to do)
- [ ] **If redeploying:** deploy `apps-script/Code.gs` as a new Web App under Transform Health's Google account, then update the `APPS_SCRIPT_URL` secret
- [ ] **Set RELAY_SECRET** in Apps Script Script Properties (matches `APPS_SCRIPT_KEY` in Edge Function secrets) — defence-in-depth against spoofed calls

## 5. Assets & Branding

- [ ] **Brand colours** are defined in `client/tailwind.config.cjs` under `brand:` — verify they match current brand guidelines

## 6. Documentation

- [x] `docs/admin-manual.md` — updated to reflect current email architecture and token security model
- [ ] `docs/TRANSFER_CHECKLIST.md` — this file (review before final handover)
- [ ] In-app **Product Report** — accessible at `/#admin?tab=manual&section=product-report`
- [x] **README.md** — updated to reflect current codebase state (auth active, correct env vars)
- [ ] **Admin Manual PDF** — can be generated from the in-app "Download PDF" button
- [ ] **Screenshots / video walkthrough** — being prepared by current team

## 7. Pre-Launch Tasks

- [x] **Re-enable admin auth gate** — done
- [x] **Create admin user** in Supabase Auth dashboard — done (`noreply@transformhealthcoalition.org`)
- [ ] **Analytics** — decide whether to add GA4 or Plausible before or after launch
- [ ] **Test end-to-end flow:** submit profile → approve → appears in directory → manage via magic link → email notification received

## 8. Profile Photo Cleanup

Profile photos are now **automatically deleted** from Supabase Storage whenever a leader's profile is removed:

- **Admin hard-delete** (`deleteLeader`) — fetches `photo_url`, deletes the DB row, then removes the file from the `profile-photos` Storage bucket.
- **Self-service delete** (`deleteByLeader`) — same; also nulls `photo_url` on the row so no stale reference remains.

The Storage removal is best-effort: if the file is already gone or the bucket call fails, a warning is logged but the delete itself still succeeds.

No manual Storage cleanup is needed for normal delete flows. If you ever need to clean up an orphaned photo manually, navigate to Supabase Dashboard → Storage → `profile-photos` and delete the file by name (the filename is the path segment after `/profile-photos/` in the URL).

**GDPR note:** The self-service delete flow sets `status = 'rejected'`, nulls `photo_url`, and clears PII fields (`leader_email`, `editor_email`, `internal_note`). The profile is removed from the public directory, the photo is deleted from Storage, and contact details are erased. If a subject requests full row deletion, an admin can run the following in Supabase Dashboard → SQL Editor:

```sql
DELETE FROM leaders WHERE id = '<uuid>';
```

## 9. Supabase Free Tier — Features & Limitations

The project currently runs on the **Supabase Free Tier** (`qglymhpdsjzkmdvzizdu`). Below are the limits and when to consider upgrading.

### Current Free Tier Limits

| Resource | Free Tier Limit | Our Current Usage | Notes |
| --- | --- | --- | --- |
| **Database** | 500 MB | ~10 MB (82 leaders + small tables) | Fine for thousands of entries |
| **Row count** | Unlimited | ~100 rows | No concern |
| **Auth users** | 50,000 | 1–5 admin users | No concern |
| **Edge Functions** | 500,000 invocations / month | Very low | Fine for current traffic |
| **Edge Function count** | 2 per project | 2 (self-service, manage-admin) | Within free limit |
| **File Storage** | 1 GB | Minimal (profile photos) | Fine |
| **Bandwidth** | 2 GB | Low | Fine |
| **Daily backups** | ✗ (Free tier has no PITR) | — | **Risk** — manual backup required |
| **Supabase support** | Community only | — | Email/Slack support on Pro+ |

### Scaling Considerations

- **3+ Edge Functions** → Upgrade to **Pro** ($25/month) — currently at 2 (within limit)
- **Database > 500 MB or high traffic** → Upgrade to **Pro** for read replicas, connection pooling
- **Production SLA / Support** → Upgrade to **Team** ($599/month) or **Enterprise**
- **PITR backups** → Pro plan ($25/month) includes 7-day Point-in-Time Recovery

### Recommended Upgrade Path

1. **Now:** Manually export SQL backups via Dashboard → SQL Editor → `SELECT * FROM leaders` (free tier has no PITR)
2. **Production launch:** Upgrade to **Pro ($25/mo)** for PITR backups, support SLA, and headroom if a third Edge Function is ever needed

## 10. Quick Reference

| Resource | Value |
| --- | --- |
| Live URL | `https://tich-labs.github.io/transform-health-directory/` |
| Supabase Project | `qglymhpdsjzkmdvzizdu` |
| Supabase URL | `https://qglymhpdsjzkmdvzizdu.supabase.co` |
| Database | PostgreSQL — tables: `leaders`, `requests`, `admin_roles` |
| Storage | Supabase Storage — bucket: `profile-photos` |
| Auth | Supabase Auth — email/password (login required; test-mode policies removed) |
| CI/CD | `.github/workflows/deploy.yml` — auto-deploys on push to `main` |
| Email | Supabase Edge Function → Google Apps Script → Google Workspace |
| Frontend | React 18 + Vite + Tailwind CSS |
| Sent from | Google Workspace account that owns the Apps Script |
