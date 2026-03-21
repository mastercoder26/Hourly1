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
