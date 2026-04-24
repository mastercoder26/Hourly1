# Hourly

Volunteer-hours platform monorepo: **Expo (mobile + static web export)**, **Next.js (counselor / public pages)**, **Express + tRPC (API)**, **Prisma (schema + migrations)**, shared **TypeScript** types in `@hourly/shared`.

## What ships in this repo

| Area | Path | Role |
|------|------|------|
| Mobile shell | [`apps/mobile`](apps/mobile) | Expo Router, student + org flows, admin demo, Clerk + tRPC client |
| Web surfaces | [`apps/web`](apps/web) | Next.js App Router: counselor views, public org/portfolio-style routes |
| API | [`packages/api`](packages/api) | Express, tRPC routers, in-memory mock data (swap for Prisma-backed DB when wired) |
| Database | [`packages/db`](packages/db) | Prisma schema, migration scripts |
| Shared | [`packages/shared`](packages/shared) | Types and seed data consumed by mobile and web |

Long-form product context: [`docs/product-vision.md`](docs/product-vision.md). Env names and setup notes: [`docs/environment-variables.md`](docs/environment-variables.md).

## Prerequisites

- **Node.js 20+** and **npm 10+**
- For iOS: Xcode / Simulator (local `expo run:ios` if not using EAS)

## Install (from repo root)

```bash
npm install
```

`postinstall` builds `@hourly/shared` so TypeScript resolves its `dist/` output.

## Run locally

**Mobile (Expo)**

```bash
npm run dev:mobile
# or
npm run -w mobile start
```

Platform targets: `npm run -w mobile ios` · `android` · `web`

**Next.js (`apps/web`, port 3002)**

```bash
npm run dev:web
```

**API (Express + tRPC, default port 3001)**

```bash
npm run dev:api
```

Mobile expects the API at `EXPO_PUBLIC_API_URL` (see env doc); default client URL is `http://localhost:3001/trpc`.

## Build / quality

```bash
npm run build:shared    # shared package only
npm run build:web       # shared + Next production build
npm run build:mobile-web # shared + Expo static web export
npm run -w api build    # API TypeScript compile
npm run -w web lint     # ESLint (`next` is also a root devDependency so hoisted eslint-config-next resolves)
npm run verify          # shared build + API compile + web lint/build + mobile typecheck
```

## Database (Prisma)

```bash
npm run -w db prisma:generate
npm run -w db prisma:validate
npm run -w db prisma:push
npm run -w db prisma:migrate:dev
```

Requires `DATABASE_URL` in `packages/db` and `packages/api` as appropriate.

## Admin demo (API)

- Local dev can use defaults documented in [`docs/environment-variables.md`](docs/environment-variables.md) for `ADMIN_DASHBOARD_*`.
- **Production** must set `ADMIN_DASHBOARD_EMAIL` and `ADMIN_DASHBOARD_PASSWORD`; the API refuses misconfiguration on admin login otherwise.

## Deploy (outline)

- **Next.js:** deploy `web` workspace (root `apps/web` in Vercel). Run `npm run build:web` in CI so `@hourly/shared` builds first.
- **Expo iOS:** EAS profiles in `apps/mobile` — see env example and `eas.json` there.
- **Static Expo web:** `npm run build:mobile-web` → host `apps/mobile/dist`.

## Technical notes for reviewers

- **tRPC** defines the contract between mobile/web and `packages/api`; `AppRouter` type is imported on the client for end-to-end typing.
- **Clerk** on the API is optional in dev (`CLERK_SECRET_KEY` empty or placeholder skips `clerkMiddleware`); demo auth can use `x-demo-user-id` when `ALLOW_DEMO_AUTH` is not `false`.
- **Tests:** root `npm test` is still a placeholder; add `vitest`/`jest` per package when you formalize CI.

## License

ISC (see [`package.json`](package.json)).
