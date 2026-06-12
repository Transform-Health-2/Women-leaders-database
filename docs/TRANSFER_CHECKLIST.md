# Transfer Checklist — Transform Health

This document lists everything required to transfer the Women Leaders in Digital Health Database codebase, assets, and associated resources from the development team to Transform Health.

---

## 1. Source Code & Repository

- [ ] **Transfer GitHub repository ownership** from `Tich-Labs/transform-health-directory` to Transform Health's GitHub organisation, or add designated team members as Admin collaborators
- [ ] **Verify GitHub Actions secrets** are set in the new repo:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] **Remove stale secrets** (Firebase, legacy Apps Script vars) if present
- [ ] **Confirm CI/CD is operational** — push to `main` triggers automatic build + deploy
- [ ] **Verify branch protection** rules are configured on `main` if desired

## 2. Supabase Project

- [ ] **Grant team access** to the Supabase project `bahoslsvhwqybqkjonvb` (transform-health-directory):
  - Invite collaborators via Supabase Dashboard → Project Settings → Team
  - Or create a fresh project under Transform Health's account and run the schema migration
- [ ] **Verify Edge Function secrets** are configured in Supabase Dashboard → Edge Functions:
  - `APPS_SCRIPT_URL` — Google Apps Script Web App URL
  - `GOOGLE_SMTP_USER` — email sender address
  - `GOOGLE_SMTP_PASS` — app password
- [ ] **Confirm Row Level Security (RLS)** policies are active:
  - Anon key can read only `live` leaders
  - Authenticated admin can write/update
- [ ] **Verify storage bucket** `profile-photos` exists and is public-read
- [ ] **Back up database** — export a SQL dump of all tables (`leaders`, `requests`, `test_results`)

## 3. Email & Google Workspace

- [ ] **Google Apps Script Web App** — confirm access to the Google account that owns the deployed script, or deploy a fresh copy from `supabase/functions/send-email/`
- [ ] **SMTP sender** — confirm `noreply@transformhealthcoalition.org` is accessible
- [ ] **Enable 2-Step Verification** on the sender account and generate an **App Password** for SMTP (recommended before production)

## 4. Domain & Hosting

- [ ] **Current URL:** `https://tich-labs.github.io/transform-health-directory/`
- [ ] **Decide on custom domain** — e.g. `database.transformhealthcoalition.org` or `transformhealthdatabase.org`
- [ ] **If using custom domain:** configure DNS CNAME record pointing to GitHub Pages, then update GitHub Pages settings
- [ ] **Alternative:** if migrating to Vercel, set up Vercel project and configure env vars

## 5. Assets & Branding

- [ ] **Logo URLs** — confirm WordPress asset paths remain stable:
  - Logo: `https://transformhealthcoalition.org/wp-content/themes/th/assets/images/main_logo.svg`
  - Footer icon: `https://transformhealthcoalition.org/wp-content/themes/th/assets/images/footer_icon_bg.svg`
  - Favicon: hotlinked from same logo URL via `client/index.html`
- [ ] **Consider downloading local copies** of brand assets to remove external dependency
- [ ] **Brand colours** are defined in `client/tailwind.config.cjs` under `brand:` — verify they match current brand guidelines

## 6. Documentation

- [ ] `docs/admin-manual.md` — markdown source for the in-app Admin Manual
- [ ] `docs/TRANSFER_CHECKLIST.md` — this file
- [ ] In-app **Product Report** — accessible at `/#admin?tab=manual&section=product-report`
- [ ] **README.md** — updated to reflect current codebase state
- [ ] **Admin Manual PDF** — can be generated from the in-app "Download PDF" button
- [ ] **Screenshots / video walkthrough** — being prepared by current team

## 7. Pre-Launch Tasks

- [ ] **Re-enable admin auth gate** — one-line change in `client/src/pages/Admin.jsx`
- [ ] **Create admin user** in Supabase Auth dashboard (email/password)
- [ ] **Production SMTP** — migrate from Google Apps Script to SendGrid/Resend if higher volume expected
- [ ] **Analytics** — decide whether to add GA4 or Plausible before or after launch
- [ ] **Test end-to-end flow:** submit profile → approve → appears in directory → manage via magic link → email notification received

## 8. Quick Reference

| Resource | Value |
|---|---|
| Live URL | `https://tich-labs.github.io/transform-health-directory/` |
| Supabase Project | `bahoslsvhwqybqkjonvb` |
| Supabase URL | `https://bahoslsvhwqybqkjonvb.supabase.co` |
| Database | PostgreSQL — tables: `leaders`, `requests`, `test_results` |
| Storage | Supabase Storage — bucket: `profile-photos` |
| Auth | Supabase Auth — email/password (test mode bypassed) |
| CI/CD | `.github/workflows/deploy.yml` — auto-deploys on push to `main` |
| Email | Edge Function → Google Apps Script → Google Workspace SMTP |
| Frontend | React 18 + Vite + Tailwind CSS |
| Sent from | `noreply@transformhealthcoalition.org` |
