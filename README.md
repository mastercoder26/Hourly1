# Hourly

Hourly is a monorepo for a volunteer tracking platform with:

- Mobile app (`apps/mobile`) built with Expo and React Native
- API service (`packages/api`) built with Express and tRPC
- Database package (`packages/db`) built with Prisma

## Repository Structure

```text
apps/
  mobile/      Expo app
packages/
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

## Run the Mobile App

```bash
npm run -w mobile start
```

Other mobile targets:

```bash
npm run -w mobile android
npm run -w mobile ios
npm run -w mobile web
```

## Run the API

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

## Notes

- Root `npm test` is currently a placeholder script.
- For full product and deployment planning docs, see:
  - `project.md`
  - `plan.md`
  - `stillneeded.md`
