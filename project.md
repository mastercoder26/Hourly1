Here's the fully updated, detailed project document for Hourly:

***

# Hourly — Full Project Document

## Vision

Most volunteer platforms are built for organizations. Hourly is built for the **volunteer first** — specifically students who need verified hours for school credit, college applications, and scholarships. Organizations get a smarter, lower-effort way to recruit and manage their people. The platform bridges both sides with a matching algorithm, verified digital hour logging, and zero paper forms.

**Core promise to students:** Show up. Hourly handles everything else.
**Core promise to organizations:** Post once. We'll find your people.

***

## Users

### Students
- High school students (14–18) needing community service hours for school credit, NHS, graduation requirements, or scholarship applications
- College students building a resume or portfolio
- Any motivated volunteer wanting a verified, shareable record of their impact
- Under-18 users trigger a parental consent flow at onboarding

### Organizations
- Nonprofits, community orgs, school clubs, city programs, faith-based orgs
- Admin roles: **Coordinator** (full access), **Event Manager** (post roles + manage check-in), **Viewer** (read-only reports)
- Verified via EIN / 501(c)(3) status — trust badge displayed to students on listings
- Verification is semi-automated: EIN auto-looked up against the IRS API, final approval manual within 24hrs

***

## Core Features

### Student Side

| Feature | Description |
|---|---|
| Onboarding & profile | School (searchable by ZIP via NCES database), grade, interests (up to 5 causes), availability. Progressive — every step skippable. |
| Personalized feed | Cards sorted by relevance score (matching algorithm), distance, urgency. Swipe to save or dismiss. |
| Search & filters | Cause, distance radius, date range, shift duration, credit-eligible toggle |
| Opportunity detail | Org rating, volunteer reviews, shift info, "what to bring" checklist, static map pin |
| One-tap apply | Pre-filled from saved profile. Zero re-entry per application. Bottom sheet confirm, not a new screen. |
| Shift confirmation | QR code generated offline-first (from application ID), calendar sync, auto push reminder |
| Check-in | QR scan by org coordinator, or GPS geofencing auto-confirm within 100m — offline capable |
| Hours tracker | Auto-logged on check-out. Pending → Verified flow. Push notification on org verification. |
| Portfolio | Total hours, hours by cause (bar chart), orgs served, milestone badges, shareable public link |
| Certificates | Downloadable PDF per milestone or per org — generated server-side, student or org auth only |
| Counselor view | Share link so school advisors see verified hours directly — no account needed |
| Recommendations | Algorithm surfaces new roles based on past activity, cause preferences, and location |

### Organization Side

| Feature | Description |
|---|---|
| Org registration | EIN auto-lookup, mission, logo upload, 24hr review queue, trust badge on approval |
| Role creation | Title, cause tags, date/time, location (map pin confirm), spots, age min, what-to-bring, recurring toggle |
| Templates | "Use last event" pre-fills from prior listing. Draft auto-saves every 30 seconds. |
| Credit-eligible toggle | Org confirms they'll sign forms; badge shown on listing to students |
| Preview mode | See listing exactly as students will before publishing |
| Applicant dashboard | Per-shift list with mini volunteer profiles, approve / decline / waitlist, with bulk actions |
| Bulk actions | Approve all, invite back past volunteers, message all confirmed |
| Auto-approve | Option to skip manual review for returning volunteers |
| Day-of check-in | QR scanner on coordinator's phone camera. Live roster, manual override, no-show flagging. No tablet needed. |
| Messaging | In-app only — no personal info (phone, email) ever exposed to either side |
| Impact reports | Auto-generated: total hours, headcount, retention rate, avg rating, cause breakdown, month-by-month chart |
| Export | PDF and CSV for grant applications and annual reports |
| Public impact page | Shareable org page showing cumulative volunteer stats + active listings |

### Platform-Wide
- Smart matching algorithm (interests + availability + location + history)
- Two-way review system (students rate orgs; orgs note volunteers — visible to future orgs only)
- In-app notifications (reminders, confirmations, verifications, new roles nearby)
- School/district admin dashboard (counselors track student hours across the school)
- Compliance tools (waivers, parental consent for minors, background check confirmation status)
- Certificate generation (PDF, milestone-based and per-org, verified watermark)

***

## User Flows

### Student Flow
```
Download app
→ Onboarding (school, grade, interests, availability) — skippable, progressive
→ Home feed (personalized opportunity cards sorted by match score)
→ Tap card → Opportunity detail (org info, reviews, shift details, map)
→ Apply (one tap, pre-filled profile) → bottom sheet confirm
→ Confirmation screen (QR code generated, calendar sync, auto reminder set)
→ Day of: open app → QR check-in (or GPS auto-confirms within 100m)
→ Active shift timer → auto check-out at scheduled end time
→ Hours marked pending → org verifies → push notification
→ Portfolio updates (hours, badges, causes)
→ Optional: download certificate, share portfolio link, leave org review
```

### Organizer Flow
```
Register org (EIN lookup → mission → logo → submit for review)
→ 24hr verification → trust badge awarded
→ Dashboard: post a role (multi-step form, draft auto-saves)
→ Preview → Publish
→ Applicant notifications arrive → review / approve / decline / waitlist
→ Day of: check-in screen → scan student QR codes → live roster
→ Post-event: hours auto-verified → impact report generated
→ Export report (PDF/CSV) or share public impact page
```

***

## UX Principles

1. **Students are consumers.** Treat the experience like Instagram, not a government form. Every piece of friction — paper, email, phone calls — is eliminated.
2. **Offline-first check-in.** QR codes work without signal. Outdoor events and rural locations have no reliable internet. Non-negotiable.
3. **One profile, everywhere.** Students fill out their info once. It travels with every application.
4. **Two-way accountability.** Students rate orgs. Orgs note volunteers. This incentivizes both sides to show up and be organized.
5. **Credit eligibility is a wedge feature.** Once schools recognize Hourly's verification, it becomes the district-wide standard for community service tracking.
6. **Orgs need zero new hardware.** Check-in uses the coordinator's phone camera. No tablets, no scanners, no setup.
7. **Reports write themselves.** Every grant-ready metric is auto-generated. Orgs never enter data manually.

***

## Design Direction

- **Mobile-first.** iOS and Android via React Native. Web via React Native Web (same codebase).
- **Tone:** Warm, encouraging, action-oriented. Not corporate. Not overly gamified.

### Color System
| Token | Value | Usage |
|---|---|---|
| `--teal` | `#1D9E75` | Student-facing UI — growth, action, nature |
| `--purple` | `#534AB7` | Org-facing UI — trust, depth, institutional |
| `--off-white` | `#F7F7F5` | Shared background |
| `--gray-border` | `#E4E4E4` | Card borders (0.5px) |
| `--text-primary` | `#1A1A1A` | Body text |
| `--text-muted` | `#888888` | Secondary labels |

### Typography
- Clean sans-serif (Inter or similar)
- Two weights only: 400 regular, 500 medium
- Sentence case always — no ALL CAPS, no Title Case headlines

### Component Style
- Flat cards with 0.5px borders and generous whitespace
- Pill badges for cause tags
- Bottom navigation bar
- Animations: subtle only — confirmation checkmarks, progress bar fills, QR scan pulse

***

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Mobile + Web | React Native + Expo SDK 55 | Single codebase for iOS + web via React Native Web, New Architecture enabled by default  [docs.expo](https://docs.expo.dev/guides/new-architecture/) |
| Navigation | Expo Router (file-based) | Works across mobile and web, deep linking built-in |
| Styling | NativeWind (Tailwind for RN) | Consistent design tokens across platforms |
| Backend | Node.js 20 + Fastify | Fast, typed, great for REST + WebSockets |
| Database | PostgreSQL 16 | Relational data fits orgs/users/shifts/hours perfectly |
| ORM | Prisma | Type-safe DB queries, great migration tooling |
| Auth | Clerk | Handles school email, social login, under-18 flows, JWTs |
| Storage | Supabase Storage | Profile photos, org logos, generated PDFs |
| Maps | Mapbox SDK | Location search, geofencing, offline tile support |
| QR | expo-camera + react-native-qrcode-svg | Offline QR generation and scanning |
| Push Notifications | Expo Push + Firebase Cloud Messaging | Cross-platform push, scheduling via Bull queue |
| PDF Generation | react-pdf (client) / Puppeteer (server) | Certificates and impact reports |
| Web Hosting | Vercel (Next.js counselor dashboard + public pages) | Edge rendering, fast deploys |
| API + App Hosting | Railway or Render | Simple DevOps, affordable, supports Node + PostgreSQL |
| Validation | Zod | Schema validation on all API request bodies |
| Testing | Jest + React Native Testing Library | Unit + component tests, happy-path coverage per screen |
| State Management | Zustand + React Query | Local state (Zustand) + server state/caching (React Query) |
| Version Control | GitHub | Feature branches, PR reviews, linked to deployment pipelines |

> **Note:** Use Expo SDK 55 (not 51 as originally noted — SDK 51 is significantly outdated and the legacy architecture it uses has been frozen with no new bugfixes). [docs.expo](https://docs.expo.dev/guides/new-architecture/)

***

## Development Strategy — Frontend First, Then Backend

The core principle: **build the full UI with mocked/static data first**, so you can design, test, and iterate fast without waiting on a working API. Once the screens feel right, swap mocks for real API calls one chunk at a time.

### Why Frontend First?

- You can share working screens with potential users (students, orgs, counselors) for feedback before writing a single API route
- UI bugs are cheap to fix early; data model bugs after the backend is built are expensive
- You can demo the app at DECA, pitch it to schools, or show it to potential co-founders while the backend is still in progress
- It forces you to define your exact API contract (what data each screen needs) before writing backend code, making the backend cleaner

### Phase 0 — Project Setup (Before Any Features)

**Goal:** Repo, tooling, and folder structure ready. Nothing breaks.

```
hourly/
├── apps/
│   ├── mobile/              ← Expo React Native app (iOS + web)
│   └── web/                 ← Next.js app (counselor dashboard + public pages)
├── packages/
│   ├── api/                 ← Node.js + Fastify backend
│   ├── db/                  ← Prisma schema + migrations
│   └── shared/              ← Shared TypeScript types used by all packages
└── package.json             ← pnpm workspaces monorepo root
```

Steps:
1. Create GitHub repo, set up `pnpm` workspaces monorepo
2. Initialize Expo app (`npx create-expo-app@latest`) with Expo Router, NativeWind, TypeScript
3. Initialize Next.js app (`npx create-next-app@latest`) with App Router, Tailwind, TypeScript
4. Initialize Fastify API with TypeScript, Zod, and a placeholder health route
5. Initialize Prisma with a PostgreSQL connection (use a local Docker Postgres or a free Railway dev instance)
6. Set up ESLint + Prettier across all packages
7. Set up GitHub Actions for lint + type-check on every PR

***

### Phase 1 — Frontend MVP (Static/Mocked Data)

**Goal:** Every student-facing screen built and navigable, using hardcoded mock data. No real API calls yet.

Create a `mocks/` folder in the mobile app with TypeScript objects that mirror what the real API will return. Every screen fetches from these mocks during Phase 1.

#### Chunk 1 — Student Onboarding (Frontend)
Build the 4-step onboarding flow with a progress bar. Steps: (1) sign-in screen (Clerk UI, skip real auth for now with a "Continue as Guest" bypass), (2) school + grade, (3) cause interest bubbles (up to 5), (4) availability (days of week + shift length). Store completed fields in `AsyncStorage`. Every step skippable. Teal (`#1D9E75`) accent throughout.

**Deliverable:** `apps/mobile/app/onboarding/` — step components + progress bar

#### Chunk 2 — Opportunity Feed (Frontend)
Build the home feed with hardcoded mock opportunity cards. Each card shows: org name, role title, cause pill badge (colored), distance, date/time, hours, spots remaining (urgency color if < 5). Swipeable (swipe right = save, left = dismiss). Sticky filter bar at top: distance slider, cause multi-select, date picker, credit-eligible toggle. Map toggle switches to Mapbox view with pins. Pull to refresh (instant with mocks). Empty state with illustration.

**Deliverable:** `apps/mobile/app/(tabs)/index.tsx`, `components/OpportunityCard.tsx`, `components/FilterBar.tsx`

#### Chunk 3 — Opportunity Detail + Apply (Frontend)
Tapping a card opens the detail screen. Shows: org name + star rating (1–5 with breakdown), role description, shift date/time, static Mapbox map preview, spots remaining, age requirement, what-to-bring checklist (copyable), cause tags, credit-eligible badge with tooltip, 3 most recent volunteer reviews. Sticky bottom bar: "Apply — 1 tap" + "Save for later" ghost button. Tapping apply opens a bottom sheet (not a new screen) with shift summary + confirm button. Confirm shows animated checkmark success state.

**Deliverable:** `apps/mobile/app/opportunity/[id].tsx`, `components/ApplySheet.tsx`

#### Chunk 4 — QR Check-In + Shift Timer (Frontend)
Student-side: show shift card with offline-generated QR code (built from a mock application ID string). After simulated check-in, transition to active shift timer: elapsed time, shift duration, progress bar fill. Auto-check-out button with confirmation dialog. Mock the "org scanned you" event with a local button for testing.

Org-side: camera QR scanner screen, shows mock student info on scan, "Check in" confirm button, live roster list with names and status.

**Deliverable:** `apps/mobile/app/checkin.tsx`, `apps/mobile/app/active-shift.tsx`, `apps/mobile/app/org/scanner.tsx`

#### Chunk 5 — Hours Tracker + Portfolio (Frontend)
Pull from mock attendance data. Show: large total hours number, horizontal bar chart by cause (color-coded), list of past shifts (org name, date, hours, status badge). Badges section: milestone icons (First Shift, 10hrs, 50hrs, 100hrs, 1-year streak) with unlock animation on new badge. "Share portfolio" copies a mock URL and triggers share sheet. "Download certificate" triggers a mock download.

**Deliverable:** `apps/mobile/app/(tabs)/portfolio.tsx`, `components/HoursChart.tsx`, `components/BadgeGrid.tsx`

#### Chunk 6 — Org Dashboard + Role Creation (Frontend)
Switch to purple (`#534AB7`) accent. Dashboard shows: active listings with applicant count + spots-filled progress bar, upcoming shifts (next 7 days), quick stats (volunteers this month, total hours, retention rate). "Post a role" opens 5-step form: (1) title + causes, (2) date/time with recurring option, (3) location with map pin confirm, (4) spots + age min + what-to-bring, (5) credit-eligible toggle + preview. Draft auto-saves to `AsyncStorage` every 30s. "Use last event" pre-fills from mock prior listing.

**Deliverable:** `apps/mobile/app/org/dashboard.tsx`, `apps/mobile/app/org/create-role.tsx`

#### Chunk 7 — Applicant Management (Frontend)
For a given mock opportunity, show applicants grouped by status: New, Approved, Waitlisted, Declined. Each row: initials avatar, name, grade, total hours, past-org rating. Actions: approve, decline, message (opens in-app thread), "invite back" flag. Bulk action bar appears when 2+ selected. In-app message thread UI (send/receive bubbles, no real backend yet — mock messages).

**Deliverable:** `apps/mobile/app/org/applicants/[opportunityId].tsx`, `components/MessageThread.tsx`

#### Chunk 8 — Counselor Dashboard (Frontend, Next.js)
Web-only, built in the Next.js app. Table of mock students: name, grade, total verified hours, hours this semester, last activity, orgs served. Clicking a student row expands their full portfolio view. Filters: grade, minimum hours, cause type. Export to CSV button (mock download). "Send reminder" button with configurable threshold. Read-only — no ability to edit student data. Teal accent, Hourly branding.

**Deliverable:** `apps/web/app/counselor/page.tsx`, `apps/web/app/counselor/[studentId]/page.tsx`

#### Chunk 9 — Public Pages (Frontend, Next.js)
Two public pages (no auth required):
1. `/p/[slug]` — Student portfolio: first name + last initial, total hours, hours-by-cause chart, orgs volunteered with, badges, "Verified by Hourly" seal. No contact info. Clean, mobile-friendly.
2. `/org/[slug]` — Org impact page: name, logo, mission, total hours, volunteer count, avg rating, top cause, active listings feed with apply links, "Powered by Hourly" footer with app download links.

**Deliverable:** `apps/web/app/p/[slug]/page.tsx`, `apps/web/app/org/[slug]/page.tsx`

***

### Phase 2 — Data Layer + API (Backend)

**Goal:** Replace every mock with a real database and live API calls. The screens don't change visually — only the data source changes.

#### Step 1 — Database Schema
Write the full Prisma schema (and raw SQL `schema.sql` for reference) covering:

**Tables:** `users`, `student_profiles`, `org_profiles`, `opportunities`, `applications`, `attendance_records`, `reviews_student_to_org`, `reviews_org_to_student`, `certificates`, `messages`, `notifications`, `badges`, `badge_unlocks`, `school_lookup`

**Key relations:**
- `applications` links `users` (students) → `opportunities` with status enum: `PENDING | APPROVED | DECLINED | WAITLISTED`
- `attendance_records` links `users` → `opportunities` with `checkin_time`, `checkout_time`, `hours_logged`, `verification_status` enum: `PENDING | VERIFIED | DISPUTED`
- `reviews` are directional — separate tables for student→org and org→student
- `certificates` reference `attendance_records` or milestones
- All location data stored as `lat DECIMAL(9,6)`, `lng DECIMAL(9,6)` + `address TEXT` for flexibility
- PostgreSQL `GIN` indexes on `cause_tags` arrays for fast filtering

**Deliverable:** `packages/db/schema.prisma`, `packages/db/schema.sql`, `packages/db/migrations/`

#### Step 2 — Auth (Clerk Integration)
Wire up real Clerk auth on mobile (Expo) and web (Next.js). Replace the "Continue as Guest" bypass with real sign-up/sign-in. On first auth:
- Detect if user is student or org from onboarding choice
- Create a record in `users` + the appropriate profile table
- Under-18 flow: collect parent email at step 1 of onboarding, send consent email via Clerk webhook → backend

**Deliverable:** `apps/mobile/app/(auth)/`, Clerk webhook handler in `packages/api/routes/webhooks.ts`

#### Step 3 — Core API Routes
Build Fastify routes for each feature chunk, in this order:

| Route group | Key endpoints |
|---|---|
| Opportunities | `GET /opportunities`, `GET /opportunities/:id`, `POST /opportunities`, `PATCH /opportunities/:id` |
| Applications | `POST /applications`, `PATCH /applications/:id/status`, `GET /opportunities/:id/applications` |
| Attendance | `POST /attendance/checkin`, `PATCH /attendance/:id/checkout`, `GET /students/:id/attendance` |
| Students | `GET /students/:id/profile`, `PATCH /students/:id/profile`, `GET /students/:id/portfolio/public` |
| Organizations | `GET /orgs/:id`, `PATCH /orgs/:id`, `GET /orgs/:id/impact` |
| Reviews | `POST /reviews`, `GET /opportunities/:id/reviews` |
| Messages | `POST /messages`, `GET /messages?applicationId=` |
| Recommendations | `GET /opportunities/recommended?studentId=` |
| Certificates | `GET /certificates/:id/pdf` |
| Impact Reports | `GET /orgs/:id/impact?year=`, `GET /orgs/:id/impact/pdf` |

All request bodies validated with Zod. All routes return typed responses matching the shared TypeScript types in `packages/shared/types.ts`.

#### Step 4 — Connect Frontend to API
Replace each mock import one screen at a time using React Query:
```ts
// Before (mock)
import { mockOpportunities } from '@/mocks/opportunities'

// After (real API)
const { data } = useQuery(['opportunities', filters], () => fetchOpportunities(filters))
```
This is done screen-by-screen so you always have a working app at every step. Order follows the build priority: feed → detail/apply → check-in → portfolio → org dashboard → applicant management → reports.

***

### Phase 3 — Intelligence + Engagement

**Goal:** Matching algorithm, notifications, badges, two-way reviews.

#### Matching Algorithm (Node.js)
Score each opportunity for a given student 0–100:
- **Cause match** (40 pts) — overlap between student interests and opportunity tags
- **Distance** (25 pts) — closer = higher score, decay curve beyond 15 miles
- **Availability match** (20 pts) — shift day/time vs student saved availability
- **History diversity** (15 pts) — slight boost for cause types they haven't tried yet

`GET /opportunities/recommended?studentId=` returns top 10 sorted by score. Run nightly as a scheduled job for all active students and cache results in a `recommendations` table.

**Deliverable:** `packages/api/services/matching.ts`

#### Notifications (Expo Push + FCM)
Trigger push notifications for:
- (a) Application approved / declined
- (b) Shift reminder 24hrs before and 2hrs before (includes "what to bring" summary)
- (c) Hours verified by org
- (d) New opportunity matching student interests within 10 miles
- (e) Badge unlocked

Use a Bull queue (backed by Redis) or a simple `notification_queue` DB table to schedule future notifications. Student preferences screen toggles each type individually.

**Deliverable:** `packages/api/services/notifications.ts`, `apps/mobile/app/settings/notifications.tsx`

#### Badges + Portfolio Sharing
Badge unlock logic runs server-side after every attendance verification. Milestone triggers: First Shift, 10hrs, 25hrs, 50hrs, 100hrs, 5 orgs, 1-year streak. Badge unlock events sent via push notification and animated on next portfolio open. `GET /students/:id/portfolio/public` generates a shareable URL and returns all public portfolio data.

***

### Phase 4 — Institutional

**Goal:** School/district adoption, compliance, public org pages.

- **School/district dashboard** — counselor invite link flow, district-wide student hours table, exportable CSV, configurable reminder emails
- **Compliance tools** — digital waiver signing flow, parental consent email (triggered for students under 18), background check confirmation field for org coordinators
- **Public org pages** — `/org/[slug]` goes live with real data + active listings
- **Certificate generation** — server-side PDF via Puppeteer: student name, org name, hours, date range, org coordinator signature line, Hourly logo, "Verified digital record" watermark

***

## Complete Build Order

| # | Chunk | Phase | Deliverable |
|---|---|---|---|
| 1 | Project setup + monorepo | 0 | Repo, tooling, folder structure |
| 2 | Student onboarding UI | 1 | `app/onboarding/` |
| 3 | Opportunity feed UI | 1 | `Feed.tsx`, `OpportunityCard.tsx` |
| 4 | Opportunity detail + apply UI | 1 | `OpportunityDetail.tsx`, `ApplySheet.tsx` |
| 5 | QR check-in + shift timer UI | 1 | `CheckIn.tsx`, `ActiveShift.tsx`, `OrgScanner.tsx` |
| 6 | Hours tracker + portfolio UI | 1 | `Portfolio.tsx`, `HoursChart.tsx`, `BadgeGrid.tsx` |
| 7 | Org dashboard + role creation UI | 1 | `org/Dashboard.tsx`, `org/CreateRole.tsx` |
| 8 | Applicant management UI | 1 | `org/ApplicantList.tsx`, `MessageThread.tsx` |
| 9 | Counselor dashboard (web) UI | 1 | `web/app/counselor/` |
| 10 | Public pages (web) UI | 1 | `web/app/p/[slug]`, `web/app/org/[slug]` |
| 11 | Database schema | 2 | `schema.prisma`, `schema.sql` |
| 12 | Auth (Clerk, real) | 2 | Auth flow wired up, user creation webhook |
| 13 | Core API routes | 2 | All REST endpoints + Zod validation |
| 14 | Connect frontend → API | 2 | React Query replacing all mocks, screen by screen |
| 15 | Matching algorithm | 3 | `services/matching.ts` |
| 16 | Notifications + push | 3 | `services/notifications.ts`, Bull queue |
| 17 | Badges + portfolio sharing | 3 | Badge unlock logic + public portfolio URL |
| 18 | School dashboard (real data) | 4 | Counselor auth + live student data |
| 19 | Compliance tools | 4 | Waiver flow, parental consent, background check field |
| 20 | Certificate PDF generation | 4 | `services/certificate.ts`, Puppeteer template |
| 21 | Impact report PDF | 4 | `services/pdfReport.ts`, org export endpoint |

***

## AI Prompting Breakdown

Each chunk below is self-contained and can be handed to Claude, Cursor, or Copilot independently.

### Chunk 1 — Data Models & Schema
> Design a PostgreSQL schema (and Prisma schema) for a volunteer app called Hourly. Two user types: students and organizations. Students have profiles with school, grade, interests (array of cause tags), and availability. Organizations have name, EIN, mission, cause tags, verification status, and logo URL. Opportunities belong to orgs: title, cause tags, datetime, location (lat/lng + address), total spots, filled spots, age minimum, what-to-bring, recurring flag, credit-eligible flag. Applications link students to opportunities (status: PENDING, APPROVED, DECLINED, WAITLISTED). Attendance records: checkin_time, checkout_time, hours_logged, verification_status (PENDING, VERIFIED, DISPUTED). Reviews are directional (student→org and org→student). Include certificates, messages, notifications, badge_unlocks tables. Write full SQL with GIN indexes on cause_tag arrays, B-tree indexes on foreign keys and status fields, and all foreign keys with ON DELETE behavior. Also write the equivalent Prisma schema.
>
> **Deliverable:** `schema.prisma`, `schema.sql`

### Chunk 2 — Auth & Onboarding (Student)
> Build the student onboarding flow for a React Native (Expo SDK 55, Expo Router) app called Hourly. Use Clerk for auth. 4 steps: (1) email/password or Google sign-in via Clerk, (2) school name searchable by ZIP code (NCES API) + grade level, (3) interest selection — up to 5 cause bubbles: Environment, Education, Food, Animals, Seniors, Youth, Health, Arts, (4) availability (days of week + preferred shift length). Show a segmented progress bar. Every step has a "Skip for now" link. Store completed fields to AsyncStorage, sync to backend (PATCH /students/:id/profile) on completion. Under-18: show a "Parent email" input that triggers a consent email. Teal (#1D9E75) accent. Sentence case on all labels. TypeScript throughout. Write a Jest + RNTL test for the happy path.
>
> **Deliverable:** `app/onboarding/` folder with step components

### Chunk 3 — Opportunity Feed & Search
> Build the home feed screen for Hourly (React Native/Expo SDK 55). Use React Query to fetch from `GET /opportunities?lat=&lng=&causes=&dateFrom=&creditEligible=`. Render swipeable cards (react-native-gesture-handler): org name, role title, cause tag pill, distance, date/time, hours, spots remaining (urgency orange if < 5, red if = 1). Sticky filter bar: distance slider, cause multi-select chips, date range picker, credit-eligible toggle. Map toggle switches to Mapbox map view with pins. Swipe right = save, swipe left = dismiss. Pull to refresh. Empty state with an illustration and "Try adjusting your filters" prompt. Teal accent. TypeScript. Include a mock data file for Phase 1 development.
>
> **Deliverable:** `app/(tabs)/index.tsx`, `components/OpportunityCard.tsx`, `components/FilterBar.tsx`

### Chunk 4 — Opportunity Detail & Apply
> Build the opportunity detail screen for Hourly (React Native). Receives an opportunity ID from Expo Router params, fetches `GET /opportunities/:id`. Display: org name + rating (1–5 with sub-scores: communication, impact, organization), role description, shift date/time, Mapbox static map preview (tap to open full map), spots remaining, age requirement, what-to-bring checklist with "Copy all" button, cause tags, credit-eligible badge with a tooltip explanation, 3 most recent volunteer reviews (quoted text + star rating). Sticky bottom bar: "Apply — 1 tap" + "Save for later" ghost button. Apply opens a bottom sheet (react-native-bottom-sheet) with shift summary + animated confirm button. On confirm: `POST /applications`. Success: animated green checkmark. Error: toast with retry option. TypeScript. Jest test for apply flow.
>
> **Deliverable:** `app/opportunity/[id].tsx`, `components/ApplySheet.tsx`

### Chunk 5 — QR Check-In & Shift Timer
> Build check-in screens for Hourly (React Native/Expo). Student side: show shift card + QR code generated from application ID using react-native-qrcode-svg — pre-generated at application confirmation, stored in AsyncStorage, works fully offline. After check-in confirmation arrives (via WebSocket or polling), transition to active shift timer: elapsed time, total shift duration, animated progress bar. Auto check-out fires at scheduled end time, POST /attendance with timestamps. Early check-out button with confirmation dialog. Org side: expo-camera QR scanner, scan student QR, fetch application from `GET /applications/:id`, show student name + grade + total hours, "Check in" confirm button → PATCH /attendance/:id. Live roster updates. No-show flag button. Offline: queue check-ins in AsyncStorage and sync on reconnect using NetInfo. TypeScript.
>
> **Deliverable:** `app/checkin.tsx`, `app/active-shift.tsx`, `app/org/scanner.tsx`

### Chunk 6 — Hours Tracker & Portfolio
> Build the portfolio screen for Hourly (React Native). Pull from `GET /students/:id/attendance` (verified only). Show: large animated total hours counter, horizontal bar chart by cause (react-native-svg, one bar per cause, colored by cause type), list of past shifts (org name, date, hours, status pill), badge grid (milestone icons: First Shift, 10hrs, 25hrs, 50hrs, 100hrs, 5 orgs, 1-year streak) with a pop-and-scale unlock animation on new badge. Tapping a shift opens a detail bottom sheet. "Share my portfolio" → `GET /students/:id/portfolio/public` then opens native share sheet. "Download certificate" → `GET /certificates/:id/pdf` then saves with expo-file-system + expo-sharing. Badge unlock animation plays on first view of newly earned badge (stored in AsyncStorage to know if it's "new"). Teal accent. TypeScript.
>
> **Deliverable:** `app/(tabs)/portfolio.tsx`, `components/HoursChart.tsx`, `components/BadgeGrid.tsx`

### Chunk 7 — Org Dashboard & Role Creation
> Build the org dashboard and role creation flow for Hourly (React Native). Purple (#534AB7) accent. Dashboard: active listings with applicant count + spots-filled progress bar, upcoming shifts in the next 7 days, quick stats (volunteers this month, total hours, retention rate). "Post a role" → multi-step form: (1) title + cause tags (multi-select chips), (2) date/time picker with recurring option (weekly/biweekly/monthly — generates multiple opportunity records), (3) location (address autocomplete via Mapbox Geocoding API, map pin confirmation), (4) spots count + age minimum + what-to-bring list (add/remove items), (5) credit-eligible toggle with tooltip + preview screen showing exactly what students will see. Draft auto-saves to AsyncStorage every 30s. "Use last event" pre-fills from `GET /orgs/:id/opportunities?limit=1`. Publish: `POST /opportunities`. TypeScript. Jest test for multi-step form state.
>
> **Deliverable:** `app/org/dashboard.tsx`, `app/org/create-role.tsx`

### Chunk 8 — Applicant Management
> Build the applicant management screen for Hourly (React Native). For a given opportunity, fetch `GET /opportunities/:id/applications`. Show applicants in sections: New, Approved, Waitlisted, Declined. Each row: initials avatar (generated from name), name, grade, total verified hours, past-org rating if exists. Row actions (swipe or tap): approve → PATCH status, decline, message (opens in-app thread), "invite back" flag. Bulk action bar appears when 2+ are selected: approve all, decline all, message all. Waitlist auto-promotes on any spot opening (backend handles, frontend polls). In-app message thread: `POST /messages`, `GET /messages?applicationId=`. Bubbles layout. No personal info (email/phone) ever shown. Push notification sent to student on status change (backend handles). TypeScript.
>
> **Deliverable:** `app/org/applicants/[opportunityId].tsx`, `components/MessageThread.tsx`

### Chunk 9 — Impact Reports
> Build the impact reports screen for Hourly orgs (React Native) and the PDF API endpoint (Node.js/Fastify). Screen: total hours (all time + current year), total unique volunteers, retention rate (% who returned for 2+ shifts), avg org rating, top 3 roles by hours, month-by-month hours bar chart (last 12 months, react-native-svg). All from `GET /orgs/:id/impact?year=`. Year selector (last 5 years). "Download report" → `GET /orgs/:id/impact/pdf`. "Share public impact page" → copy URL to clipboard. API endpoint: generates PDF using react-pdf or Puppeteer with: org logo, year, all stats, month chart as SVG, "Powered by Hourly" footer. Responds with `application/pdf`. TypeScript.
>
> **Deliverable:** `app/org/impact.tsx`, `api/routes/impact.ts`, `api/services/pdfReport.ts`

### Chunk 10 — Notifications & Matching Algorithm
> Build two systems for Hourly:
>
> **Notifications** (Expo Push + FCM, Node.js): Send push for — (a) application approved/declined, (b) shift reminders 24hrs and 2hrs before with "what to bring," (c) hours verified, (d) new nearby opportunity matching interests, (e) badge unlocked. Use a Bull queue with Redis (or a fallback `notification_queue` PostgreSQL table) for scheduled future notifications. Internal endpoint: `POST /notifications/send`. Student preferences screen: toggle each type on/off → `PATCH /students/:id/notification_prefs`.
>
> **Matching algorithm**: Score each opportunity for a student 0–100 — cause match (40pts, tag overlap / total student tags), distance (25pts, score = 25 × e^(-distance/15)), availability (20pts, shift day/time matches student availability bitmask), history diversity (15pts, boost for cause types with < 2 prior shifts). `GET /opportunities/recommended?studentId=` returns top 10. Run nightly scheduled job for all active students, cache in `recommendations` table with a TTL. TypeScript. Include unit tests for scoring function.
>
> **Deliverable:** `api/services/notifications.ts`, `api/services/matching.ts`, `app/settings/notifications.tsx`

### Chunk 11 — School/Counselor Dashboard (Web)
> Build a web dashboard in Next.js 15 (App Router) + Tailwind CSS for school counselors. Auth: invite link (counselor clicks link in email, sets a password, tied to their school_id in the DB). Dashboard: table of all students at their school — name, grade, total verified hours, hours this semester, last activity date, number of orgs served. Click row to expand full portfolio view (mirrors `/p/[slug]` public page but with full name + school). Filters: grade level dropdown, minimum hours slider, cause type multi-select. Export CSV button (streams from `GET /counselor/export?schoolId=`). "Send reminder" button: configurable threshold (e.g., "email all grade 11 students under 20 hours") → `POST /counselor/remind`. Read-only — zero edit capability. Teal accent, Hourly nav bar.
>
> **Deliverable:** `apps/web/app/counselor/` (Next.js route group)

### Chunk 12 — Public Pages & Certificates
> Build two public Next.js pages and the certificate PDF service:
>
> **Student portfolio** (`/p/[studentSlug]`): first name + last initial, total hours (large), hours by cause (bar chart, recharts or nivo), orgs served (names only), badges earned, "Verified by Hourly" trust seal. No email, no school name, no full last name. Static-friendly — use `generateStaticParams` for known slugs.
>
> **Org impact page** (`/org/[orgSlug]`): org name, logo, mission, cumulative hours, volunteer count, avg rating, top cause, feed of active opportunities with apply deep-links (opens app or mobile web). "Download the app" buttons.
>
> **Certificate PDF** (`GET /certificates/:id/pdf`, auth required — student or org only): react-pdf template with student name, org name, hours logged, date range, org coordinator signature line, Hourly logo, "Verified Digital Record" diagonal watermark. Served as `application/pdf`.
>
> **Deliverable:** `apps/web/app/p/[slug]/page.tsx`, `apps/web/app/org/[slug]/page.tsx`, `packages/api/services/certificate.ts`

***

## Open Questions

| Question | Impact | Default assumption |
|---|---|---|
| Web support at launch, or mobile-only? | Determines if Expo web needs to be production-ready at launch | Mobile-first; web as a secondary target |
| School lookup — NCES database or manual entry? | Affects onboarding UX and counselor dashboard matching | NCES API with manual fallback |
| Org verification — fully manual or IRS EIN API? | Affects org onboarding speed and trust | EIN API auto-lookup + manual final approval |
| Are volunteer reviews public or org-only? | Affects org ratings visibility for students | Public (visible to all students on opportunity detail) |
| Parental consent — email, in-app signature, or waived? | Legal + UX complexity for under-18 users | Email to parent on signup, waived if school email domain is verified |
| Free for orgs, or freemium? | Core business model | Free at launch, premium tier (advanced reports, priority listing) in Phase 4 |
| Transaction fees? | Revenue model complexity | No — Hourly takes no cut; revenue from org subscriptions only |

***

## Notes for AI Prompting

- Always paste the Prisma schema (Chunk 1) as context when prompting for API routes or screens that touch the database — it prevents type mismatches
- Specify **Expo SDK 55, React Native 0.83, Node 20, PostgreSQL 16, Prisma 5** in every prompt — version specifics matter for library compatibility [docs.expo](https://docs.expo.dev/guides/new-architecture/)
- Ask for **TypeScript throughout** — types prevent entire categories of bugs in a two-sided app with complex status flows (PENDING / APPROVED / VERIFIED etc.)
- For each screen, ask the AI to **also write a Jest + RNTL test** covering the happy path
- For API routes, ask for **Zod validation on all request bodies** — student and org data must be sanitized carefully
- For Phase 1, explicitly tell the AI: "Use the mock data file at `mocks/opportunities.ts` instead of making real API calls — I'll swap to React Query later"
- The matching algorithm (Chunk 10) benefits from asking the AI to explain its scoring weights before writing code — get it to reason first, then implement
- Use **feature branches** on GitHub for each chunk, open a PR, review the diff, then merge — keeps history clean and makes it easy to roll back

***

This document gives you a complete blueprint to build Hourly from zero to institutional-ready, starting with a fully clickable frontend you can demo before a single API route is written. [hashrocket](https://hashrocket.com/blog/posts/expo-for-react-native-in-2025-a-perspective)