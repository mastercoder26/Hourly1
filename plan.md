# Hourly — Master Plan & Handoff

**Last updated:** 2026-05-01  
**Purpose:** Single source of truth for scope, architecture, QA, and handoff. Previous planning docs were consolidated here.

---

## Vision (short)

Hourly connects **students** with **verified volunteer opportunities**, tracks **per-account stats** (hours, shifts, badges), and supports **day-of check-in** via **QR** (organizer scans) and **GPS** self check-in within a geofence. **Organizers** publish shifts; **admins** moderate orgs and posts.

---

## Architecture

- **Mobile**: Expo Router, Clerk, tRPC React Query
- **API**: Express + `@trpc/server`, Prisma (`packages/db`), Clerk auth context
- **Web**: Next.js App Router; optional live data via `NEXT_PUBLIC_API_URL` + tRPC `public.*`
- **DB**: PostgreSQL; schema in `packages/db/prisma/schema.prisma`

### tRPC routers (high level)

- **`opportunity`**: public list/get (published, verified org, not `adminHidden`); optional `lat`/`lng` + `maxDistance` filter.
- **`application`**: student apply, `listMine`; creates `User` (student) + `Application` + `qrCodeData` (`hourly://checkin/{opportunityId}/{studentDbId}`).
- **`user`**: profile, attendance read, portfolio stats, badges.
- **`org`**: organizer stats, list/create opportunities, applicants, `reviewApplication`, pending attendance list, single attendance record.
- **`attendance`**: `checkInByQr` (organizer), `checkInByGps` (student, ~120m), `checkOut`, `verifyHours`, roster `listForOpportunity`.
- **`admin`**: Prisma-backed org moderation, appeals, post hide/restore (`adminHidden` on opportunities).
- **`public`**: `orgBySlug`, `portfolioBySlug` (for Next.js without Clerk).

---

## Local dev

```bash
# DB generate + API
npm run dev:api

# Mobile (set EXPO_PUBLIC_API_URL to API, Clerk keys in apps/mobile/.env)
npm run dev:mobile

# Web (port 3002)
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev -w web
```

- **Seed:** `npm run prisma:seed -w db` — creates verified dev org + 2 published opportunities (when DB empty).
- **Admin dashboard (mobile):** `ADMIN_DASHBOARD_EMAIL` / `ADMIN_DASHBOARD_PASSWORD` in `packages/api/.env`.

---

## Completed in this hardening pass

- Org/admin moved from mocks to Prisma-backed routers.
- Organizer event lifecycle: create/publish/list + applicant review.
- Attendance pipeline: QR check-in, GPS check-in, checkout, verify-hours → sync `StudentProfile.totalVerifiedHours`.
- Mobile critical-path screens wired to live API (scanner, check-in, applicants, verify-hours, create-role).
- Web org/portfolio pages load live `public.*` when API is configured (fallback to demo seed).
- Added API unit tests (Vitest) and wired repo `npm test` to run them.

---

## Known gaps / next session

1. **E2E automation**: no Playwright/Appium suite yet; add critical-path E2E (apply → approve → QR → verify).
2. **Web counselor pages**: still demo-only.
3. **Organizer vs student same Clerk user**: org routes reject student accounts; add role-promotion flow if desired.
4. **Badge unlock rules**: schema supports `BadgeUnlock`; automatic unlock logic not implemented yet.

---

## Manual QA checklist (before release)

- Student: sign-in → browse feed → apply → see pending on opportunity detail.
- Organizer: dashboard → applicants → approve.
- Student: QR shows payload; organizer: scan or manual paste → check-in succeeds.
- Student: GPS check-in within ~120m of opportunity lat/lng.
- Organizer: verify hours → student portfolio/stats update.
- Admin: approve/deny org → hide/restore post → student feed respects moderation state.
- Web: `/org/{slug}` and `/p/{slug}` show live data when API is running and slugs exist in DB.

---

## Repo layout

- `apps/mobile` — Expo app  
- `apps/web` — Next.js  
- `packages/api` — tRPC + Express  
- `packages/db` — Prisma  
- `packages/shared` — types + demo seed  

