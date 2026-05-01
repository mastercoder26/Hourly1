# Hourly App — Phase 1 Recap & Next Steps

Great job getting the Phase 1 frontend built! We successfully translated the dark, floating-card style from the `React App.js` concept into a full React Native cross-platform application.

## ✅ Completed in Phase 1

1. **Design System:** Created `colors.ts` and `typography.ts` mapping the dark theme, neon accents (teal/purple for Student/Org), and cause tag colors. Setup NativeWind & proper font weights.
2. **Core Components:** Built `Card`, `PillBadge`, `PillButton`, and `ProgressBar` primitives matching the rounded, floating visual language.
3. **Complex Components:** Built `OpportunityCard`, `FilterBar`, `MapPreview` (with Google Maps), `HoursChart`, `BadgeGrid`, and `MessageThread`.
4. **Mock Data Engine:** Built comprehensive mock data (`mocks/data.ts` and `mocks/opportunities.ts`) mimicking the eventual Trpc/Prisma backend schema.
5. **App Navigation Structure:** Set up Expo Router with a Root Layout containing:
    - Welcome & Auth flows
    - Student Onboarding flow (School → Interests → Availability)
    - Student Bottom Tabs (Feed, Shifts, Portfolio, Profile)
    - Org Bottom Tabs (Dashboard, Events, Applicants, Profile)
6. **Detailed Screens:** Built out all 20+ screens including Opportunity Details, QR Check-in, Active Shift Timer, Org Role Creation, and Applicant Review.

## 🚧 Remaining Work / Next Steps (Phase 2)

Before moving to full production, the following needs to be integrated:

### 1. Authentication (Clerk)
- Replace mock auth buttons in `(auth)/sign-in.tsx` and `(auth)/sign-up.tsx` with actual Clerk SDK flows.
- Tie the authenticated `userId` to the router state to automatically redirect to appropriate student/org layout.

### 2. Backend API & Database (tRPC + Prisma)
- Replace imports from `mocks/data.ts` with tRPC `useQuery` and `useMutation` hooks.
- Examples to migrate: fetching feed in `feed.tsx`, saving applications in `opportunity/[id].tsx`, posting roles in `create-role.tsx`.

### 3. Location & Map Features
- Ensure you add your Google Maps Platform API key to `app.json` or `.env` so `react-native-maps` functions correctly on physical devices.
- Connect `expo-location` to fetch the user's actual coordinates for distance calculations in the feed.

### 4. Interactive UX Polish
- Add `expo-haptics` triggers on button presses inside `PillButton` or when submitting applications.
- Replace the mock "apply bottom sheet" in `opportunity/[id].tsx` with the `@gorhom/bottom-sheet` library if you want draggable native behavior (currently it is an animated visual overlay for simplicity).
- Hook up actual Camera access in the `org/scanner.tsx` view using `expo-camera`.

Once you spin up the backend repo (`apps/web` or `packages/api`), the transition from Phase 1 to Phase 2 will mostly be swapping state variables for API calls!

## 🛠️ Phase 2 Kickoff Progress

- [x] Implemented complete Prisma data model in `packages/db/prisma/schema.prisma`
- [x] Added PostgreSQL reference DDL in `packages/db/schema.sql`
- [x] Added Prisma workflow scripts in `packages/db/package.json`
- [x] Initial migration committed in `packages/db/prisma/migrations/20250430190000_init/` _(apply with `npx prisma migrate deploy --schema prisma/schema.prisma` from `packages/db`, or `npm run prisma:migrate:dev` for dev iteration; requires `DATABASE_URL` in `packages/db/.env`)_
- [x] Build API route scaffolding in `packages/api/` _(tRPC routers for opportunity, application, user; Express server on port 3001)_
- [x] Create tRPC client and provider in mobile app _(`apps/mobile/lib/trpc.ts` + `TRPCProvider.tsx`)_
- [x] Add useOpportunities hook with tRPC/mock fallback _(`apps/mobile/hooks/useOpportunities.ts`)_
- [~] Start replacing mock reads with API clients in mobile screens _(feed.tsx now uses `useOpportunities` hook; remaining screens still use direct mock imports)_
- [x] **Postgres + Prisma wired to API** — `packages/api` depends on workspace `db`; `opportunity.list` / `opportunity.getById` and `application.apply` / `application.listMine` read/write via Prisma. Mapper: `packages/api/src/mappers/opportunity.ts`. Clerk → DB user: `packages/api/src/lib/student-user.ts` (`getOrCreateStudentUser`).
- [x] **Generator** — Prisma client uses `prisma-client-js` (hoisted `@prisma/client`) so the CommonJS API build stays compatible.
- [x] **Dev workflow** — Root `npm run dev:api` runs `prisma:generate` + `build` for `db`, then starts the API. Env templates: `packages/db/.env.example`, `packages/api/.env.example`. Use Railway’s **public** proxy `DATABASE_URL` on your machine; internal `*.railway.internal` URLs only work inside Railway.
- [x] **Optional dev seed** — After migrations: `cd packages/db && npx prisma db seed` _(adds a verified dev org + two published opportunities if the table is empty)_.
- [x] **Clerk middleware** — Mounted only on `/trpc` so `/health` stays usable without publishable keys; Clerk middleware activates only when **both** `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` are set (avoids crash when only secret key is present). Set both when exercising Clerk on API routes.
- [x] **User router + DB** — When a `User` row exists for the Clerk id (`findUserWithStudentByClerk`), `user.me`, `getProfile`, `updateProfile`, `getAttendance`, `getBadges`, and `getPortfolioStats` read/write Prisma; legacy mock paths remain only when there is no DB user yet. `updateProfile` only upserts `studentProfile` for `STUDENT` role users.
- [x] **QR codes** — `application.apply` generates QR data with the internal `student.id` (not Clerk id) to avoid PII in physical check-in codes.
- [x] **Neon Postgres live** — Migrations applied; seed data loaded (verified dev org + 2 opportunities). All tRPC endpoints smoke-tested: `opportunity.list` (2 results), `application.apply` (idempotent), `application.listMine`, `user.me` (creates DB user on first call), `user.updateProfile` (persists to DB), `user.getAttendance`, `user.getPortfolioStats`, `user.getBadges`. Auth enforcement confirmed: unauthenticated requests get 401; demo auth requires explicit `ALLOW_DEMO_AUTH=true`.
- [ ] **`opportunity.list` `maxDistance` filter** — Still a no-op until the API has the user’s coordinates (see Location & Map above).

### Apply migrations and seed (local)

1. Put a reachable `DATABASE_URL` in `packages/db/.env` and `packages/api/.env` (same value is fine for local dev).
2. `cd packages/db && npx prisma migrate deploy --schema prisma/schema.prisma`
3. _(Optional)_ `npx prisma db seed --schema prisma/schema.prisma`
4. From repo root: `npm run dev:api`
