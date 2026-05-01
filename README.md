# Hourly

**Product / engineering plan:** see **[Plan.md](./Plan.md)** (single living document for scope, architecture, QA, and handoff).

Hourly is a monorepo for a volunteer tracking platform with:

- Mobile app (`apps/mobile`) built with Expo and React Native
- API service (`packages/api`) built with Express and tRPC
- Database package (`packages/db`) built with Prisma

## Repository Structure

```text
apps/
  mobile/      Expo app
  web/         Next.js (counselor + public demo pages)
packages/
  shared/      Types + canonical demo seed (mobile + web)
  api/         Express + tRPC backend
  db/          Prisma schema and database tooling
```

## Prerequisites

- Node.js 20+
- npm 10+

## Install

From the repository root:

```bash
npm install
```

This runs a `postinstall` step that builds `@hourly/shared` so TypeScript resolves to `dist/`.

## Run the Mobile App

```bash
npm run dev:mobile
```

Or:

```bash
npm run -w mobile start
```

Other mobile targets:

```bash
npm run -w mobile android
npm run -w mobile ios
npm run -w mobile web
```

## Run the Next.js web app (counselor + public pages)

```bash
npm run dev:web
```

Uses port **3002** by default. Set `NEXT_PUBLIC_WEB_BASE_URL` if you need absolute links in server output (optional for local demo).

## Run the API

```bash
npm run dev:api
```

Or:

```bash
npm run -w api dev
```

Build and start:

```bash
npm run -w api build
npm run -w api start
```

## Database Commands

```bash
npm run -w db prisma:generate
npm run -w db prisma:validate
npm run -w db prisma:push
npm run -w db prisma:migrate:dev
```

## Deploy (demo)

### iOS (EAS)

From `apps/mobile`:

1. Copy `.env.example` to `.env` and fill production values (`EXPO_PUBLIC_DATA_MODE`, Clerk, API URL, Maps key) as needed.
2. Update placeholder Apple / App Store Connect values in `eas.json` before store submission.
3. Build and submit:

```bash
cd apps/mobile
eas build --platform ios --profile production
eas submit --platform ios
```

### Static Expo web (main app shell)

From the repo root (outputs under `apps/mobile/dist` per Expo):

```bash
npm run build:mobile-web
```

Host the exported static files on Vercel, Netlify, or any static host.

### Next.js (`apps/web`)

```bash
npm run build:web
```

Deploy the `web` workspace to Vercel (framework: Next.js, root directory `apps/web`). Ensure `@hourly/shared` is built before CI `next build` (the root `build:web` script does this).

## Notes

- Root `npm test` is currently a placeholder script.
- For full product and deployment planning docs, see:
  - `project.md`
  - `plan.md`
  - `stillneeded.md`
