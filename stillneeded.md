# stillneeded

This repository now contains placeholder-ready configs/files for the remaining plan phases. The following items still require your real external setup and credentials.

## Accounts / external setup needed

- Clerk account + app
  - Create app in Clerk dashboard
  - Replace placeholders for:
    - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
- PostgreSQL database (Supabase or Railway)
  - Create DB instance
  - Replace `DATABASE_URL` placeholders in runtime `.env` files
  - Run Prisma migrations against real DB
- Railway deployment
  - Connect repo and configure service/env vars in Railway UI
  - Set real `DATABASE_URL`, `CLERK_SECRET_KEY`, `NODE_ENV`, `PORT`
- Expo/EAS account
  - Run `eas login` and `eas build:configure`
  - Add EAS secrets for production env values
- Apple Developer + App Store Connect
  - Paid Apple developer membership
  - Real App ID / Team ID / ASC App ID for iOS submit flow
- Vercel account (if deploying web)
  - Connect repo and set env vars in Vercel project

## Values you still need to replace

- `YOUR_GOOGLE_MAPS_API_KEY`
- `https://YOUR_DOMAIN/privacy`
- `PLACEHOLDER_API_DOMAIN`
- `pk_test_PLACEHOLDER_PUBLISHABLE_KEY`
- `pk_live_PLACEHOLDER_PUBLISHABLE_KEY`
- `sk_test_PLACEHOLDER_SECRET_KEY`
- `postgresql://USER:PASSWORD@HOST:5432/DATABASE`

## Manual commands to run after filling real values

```bash
# DB (local/dev)
cd /home/runner/work/Hourly1/Hourly1/packages/db
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:validate

# API build
cd /home/runner/work/Hourly1/Hourly1/packages/api
npm run build

# Mobile typecheck
cd /home/runner/work/Hourly1/Hourly1/apps/mobile
npx tsc --noEmit

# Web export (optional)
cd /home/runner/work/Hourly1/Hourly1/apps/mobile
npx expo export --platform web

# EAS (after login + real credentials)
cd /home/runner/work/Hourly1/Hourly1/apps/mobile
eas build --platform ios --profile production
eas submit --platform ios --latest
```
