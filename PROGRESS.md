# Project Progress

## Done
- **Phase 0: Project Setup**
  - Initialized `pnpm` monorepo structure.
  - Created `pnpm-workspace.yaml`.
  - Created base workspace directories (`apps/`, `packages/api`, `packages/db`, `packages/shared`).
  - Scaffolded Expo app (`apps/mobile`), Next.js app (`apps/web`).
  - Initialized API, DB, and Shared packages.
  - Configured workspace tooling (Prettier).
  - Setup NativeWind 4 in `apps/mobile`.
  - Componentized Design Inspiration into UI elements (`Card.tsx`, `PillButton.tsx`, `Typography.tsx`).
- **Phase 1: Student Onboarding MVP (Chunk 1)**
  - Initialized `app/onboarding/` layout.
  - Implemented Mocked Onboarding Steps (Auth, School, Interests, Availability).
  - Wired up mock AsyncStorage.
- **Phase 1: Opportunity Feed (Chunk 2) & Opportunity Detail (Chunk 3)**
  - Document updated to leverage Apple MapKit + `react-native-maps` for iOS/Web respectively.
  - Defined mock opportunities schema & seed data.
  - Created FilterBar and OpportunityCard components.
  - Put map/switch views in `FeedScreen` (`app/(tabs)/index.tsx`).
  - Integrated React Native bottom-sheet for 1-tap apply confirmation in Details Screen.
  - Created `app/opportunity/[id].tsx` rendering specific roles.
- **Phase 1: QR Check-In & Shift Timer (Chunk 4)**
  - Added `app/checkin.tsx` for students to show offline QR codes.
  - Implemented `app/active-shift.tsx` for tracking hours simulated fast-forward.
  - Built `app/org/scanner.tsx` via `expo-camera` to parse volunteer apps.
- **Phase 1: Hours Tracker & Portfolio (Chunk 5)**
  - Built `app/(tabs)/portfolio.tsx`, `components/BadgeGrid.tsx`, `components/HoursChart.tsx`.
- **Phase 1: Org Dashboard & Role Creation (Chunk 6)**
  - Built `app/org/dashboard.tsx`, `app/org/create-role.tsx`.
- **Phase 1: Applicant Management (Chunk 7)**
  - Built `app/org/applicants/[opportunityId].tsx`.

## In Progress
- Mock refinement / Code formatting

## To Do
- Phase 2 Backend