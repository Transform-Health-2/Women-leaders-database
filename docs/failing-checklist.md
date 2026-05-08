# Failing Test Cases — Fix Checklist

> Generated from QA testing (3 testers, 111 results). Items ordered by priority.

---

## 🔴 CRITICAL

### 1. Manage Profile link not active on profile cards
- [x] Fix the "Manage or remove profile" link/button on profile cards
- [x] Verify clicking opens the Manage Profile modal
- [x] Verify modal loads with correct leader data

**Reported by:** Ndifanji · **File:** `ProfileModal.jsx:213`, `ManageProfile.jsx` · **Status:** ✅ Fixed

---

### 2. Photo upload not enforced as mandatory
- [x] Step 2 Continue button now requires photo (`!photoPreview` added to disabled check)
- [x] Removed `!photo` from step3Invalid (enforced on Step 2 instead)
- [x] Upload area border turns green when photo added

**Reported by:** Gefiune · **File:** `SubmitSteps.jsx:311-327`, `SubmitSteps.jsx:354`, `Submit.jsx:156` · **Status:** ✅ Fixed

---

### 3. Bio char count warning shows but doesn't block Next
- [x] Next button was already functionally disabled (native `<button disabled>`) but lacked visual disabled styling
- [x] Added `opacity-40 cursor-not-allowed` to `Button` component so disabled state is visible
- [x] Inline error message was already rendering correctly

**Reported by:** Gefiune · **File:** `Submit.jsx:156`, `SubmitSteps.jsx:478`, `Button.jsx` · **Status:** ✅ Fixed (Button visual disabled styling)

---

### 4. Consent decline — no clear termination workflow
- [x] "No I do not consent" now immediately shows the termination modal (no extra Continue click)
- [x] Separated `handleNoConsent` from `handleConsent` — "No" button calls it directly

**Reported by:** Gefiune · **File:** `SubmitSteps.jsx`, `Submit.jsx` · **Status:** ✅ Fixed

---

### 5. "Global" scope option missing from Geographical scope dropdown
- [x] Added "Global" as first option in `GEO_SCOPES` array
- [x] Added `geo_scope` mapping to `submitProfile()` API call (was silently dropped)
- [x] Created migration `scripts/add-geo-scope-column.sql` — run in Supabase SQL Editor to add the column
- [x] Admin expanded view already displays `geo_scope` field

**Reported by:** Ndifanji · **File:** `SubmitSteps.jsx:32-39`, `leaders.js:32` · **Status:** ✅ Fixed

---

## 🟠 IMPORTANT

### 6. geo_scope field not persisting to database
- [x] Added `geo_scope` mapping to `submitProfile()` API call
- [x] Column created in Supabase (migration run)
- [x] Admin expanded view already displays the field

**Reported by:** Gefiune · **File:** `Submit.jsx:138` → `leaders.js:17-41` · **Status:** ✅ Fixed

---

### 7. Region/country filters show wrong leader counts
- [x] Backfill `country` field for all leaders with missing data — script run in Supabase SQL Editor
- [x] Expand `COUNTRY_TO_CONTINENT` mapping to 130+ countries (all UN members + dependencies)
- [x] Expand `COUNTRY_TO_REGION` mapping to cover all African countries
- [x] `COUNTRIES` array in SubmitSteps.jsx now imports from `ALL_COUNTRIES` in countries.js (single source of truth)

**Reported by:** Ndifanji, Gefiune · **File:** `countries.js`, `useLeaders.js:49-50`, `SubmitSteps.jsx:25-30` · **Status:** ✅ Fixed

---

### 8. Country dropdown missing options
- [x] `COUNTRIES` now re-exports `ALL_COUNTRIES` from `countries.js` (130+ countries)
- [x] Single source of truth — SubmitSteps.jsx, Database.jsx, and useLeaders all use the same list
- [x] `Database.jsx` no longer has its own `const ALL_COUNTRIES = ...` (imported from countries.js)

**Reported by:** Ndifanji · **File:** `countries.js`, `SubmitSteps.jsx:25-30`, `Database.jsx:26` · **Status:** ✅ Fixed

---

### 9. LinkedIn links returning "does not exist"
- [x] Audited LinkedIn URLs across all 81 leaders
- [x] Backfilled all missing LinkedIn URLs (31 leaders previously had empty `linkedin` field)
- [x] All 82 records updated in Supabase via `scripts/backfill-linkedin.mjs`
- [x] Verify LinkedIn icon styling — icon now uses `currentColor`; badge on card shows white icon on navy, modal shows LinkedIn blue on white

**Reported by:** Ndifanji, Danielle Mullings · **File:** `ProfileModal.jsx:109-122`, `icons.jsx:3-11` · **Status:** ✅ Fixed

---

### 10. Admin pending count badge shows 4 but only 1 visible
- [x] Badge now shows filtered count when search/country/expertise filters are active on the pending tab
- [x] When no filters are applied, badge shows total unfiltered pending count

**Reported by:** Ndifanji · **File:** `Admin.jsx` · **Status:** ✅ Fixed

---

### 11. Amber duplicate badge not showing on pending submissions
- [x] `branch` column now included in `getLeaders("all")` select — `nominated` tab now populates correctly
- [x] Name matching now trims whitespace on both sides (`liveNames` set + `isDuplicate` check)
- [x] Admin fetch also now includes `leader_email`, `geo_scope`, `nominator_name` columns

**Reported by:** Ndifanji · **File:** `Admin.jsx`, `leaders.js` · **Status:** ✅ Fixed

---

## ⚪ NICE TO HAVE

### 12. Publications tab shows "None" for all leaders
- [x] Publications section is now hidden entirely when `notable_items` is empty
- [x] Section only renders when a leader has at least one publication

**Reported by:** Ndifanji · **File:** `ProfileModal.jsx` · **Status:** ✅ Fixed

---

### 13. Wrap text for About field overflows card
- [x] Added `break-words` (`overflow-wrap: break-word`) to bio paragraph in profile modal

**Reported by:** Danielle Mullings · **File:** `ProfileModal.jsx` · **Status:** ✅ Fixed

---

### 14. Profile modal shows empty sections for leaders with sparse data
- [x] Role, organisation — hidden when empty
- [x] Meta strip (Based in / Experience / Works across) — each item hidden individually; entire strip hidden when all three are empty
- [x] Expertise section — hidden when no tags
- [x] About section — hidden when no bio
- [x] Publications section — already hidden when empty (item 12)

**File:** `ProfileModal.jsx` · **Status:** ✅ Fixed

---

### 15. Admin expertise field concatenates array items with no separator
- [x] Expertise now rendered as individual pill tags using `toTags()` in both pending and all-entries expanded views
- [x] "Other: ..." entries display as their own pill, no longer run together with previous tags

**File:** `Admin.jsx` · **Status:** ✅ Fixed

---

## 📊 Section Progress

| Section | Pass | Fail | Pending | Total | % Done |
|---|---|---|---|---|---|
| Setup Check | 5 | 1 | 0 | 6 | 83% |
| Directory | 10 | 3 | 1 | 14 | 71% |
| Analytics | 2 | 3 | 3 | 8 | 25% |
| Submit & Nominate | 11 | 5 | 9 | 25 | 44% |
| Manage Profile | 0 | 5 | 3 | 8 | 0% |
| Admin Console | 3 | 1 | 4 | 8 | 38% |

---

## How to use

1. Work items top to bottom (priority order)
2. Check `[ ]` when fixed
3. Re-test using the [Testing Sheet](../client/public/testing-sheet.html)
4. Update test status from Fail → Pass in the sheet
5. Update totals in the section table above

*Last updated: May 2026*
