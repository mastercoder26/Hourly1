# Environment variables checklist

Use this as a worksheet: fill values locally, then copy into the real `.env` files listed under each section.

**Do not commit secrets.** If you paste real keys here, keep this file out of git or strip it before pushing.

## 1) Clerk publishable key (mobile)

Key name:
- EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

Where it goes:
- apps/mobile/.env (dev)
- apps/mobile/.env.production.example or EAS secret (prod)

Short guide to get it:
1. Sign in to Clerk Dashboard.
2. Open your app.
3. Go to API Keys.
4. Copy Publishable key (pk_test_... for dev, pk_live_... for production).

Paste here:

DEV_PUBLISHABLE_KEY=
PROD_PUBLISHABLE_KEY=

## 2) Clerk secret key (backend)

Key name:
- CLERK_SECRET_KEY

Where it goes:
- packages/api/.env (dev)
- Railway env var (prod)

Short guide to get it:
1. In Clerk Dashboard, open your app.
2. Go to API Keys.
3. Copy Secret key (sk_test_... for dev, sk_live_... for production).

Paste here:

DEV_CLERK_SECRET_KEY=
PROD_CLERK_SECRET_KEY=

## 3) Postgres connection string

Key name:
- DATABASE_URL

Where it goes:
- packages/api/.env
- packages/db/.env
- Railway env var (production API)

Short guide to get it:
1. Create a Postgres DB in Supabase or Railway.
2. Open project settings -> Database -> Connection string.
3. Copy the full URI (postgresql://...).
4. Use direct connection for migrations if provider offers pooled + direct URLs.

Paste here:

DATABASE_URL=

## 4) API base URL for mobile

Key name:
- EXPO_PUBLIC_API_URL

Where it goes:
- apps/mobile/.env
- apps/mobile/.env.production.example
- EAS secret for production builds

Short guide to get it:
1. Deploy API to Railway.
2. Copy the public HTTPS domain of the API service.
3. Append /trpc at the end.
4. Example format: https://your-api-domain.up.railway.app/trpc

Paste here:

DEV_EXPO_PUBLIC_API_URL=
PROD_EXPO_PUBLIC_API_URL=

## 5) Google Maps API key

Key name:
- EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

Where it goes:
- apps/mobile/.env
- apps/mobile/.env.production.example
- apps/mobile/app.json (ios.config.googleMapsApiKey and extra.googleMapsApiKey)

Short guide to get it:
1. Go to Google Cloud Console.
2. Create/select a project.
3. Enable Maps SDK for iOS and any additional APIs you use (for example Places API).
4. Create an API key under APIs & Services -> Credentials.
5. Restrict the key (recommended): iOS bundle ID com.hourly.app.

Paste here:

GOOGLE_MAPS_API_KEY=

## 6) Privacy policy URL (required for app submission)

Value name:
- privacyPolicyUrl

Where it goes:
- apps/mobile/app.json (expo.extra.privacyPolicyUrl)

Short guide to get it:
1. Host a privacy policy page (your site, Notion public page, GitHub Pages, etc.).
2. Copy the public HTTPS URL.

Paste here:

PRIVACY_POLICY_URL=

## 7) Admin dashboard login credentials

Keys:
- ADMIN_DASHBOARD_EMAIL
- ADMIN_DASHBOARD_PASSWORD

Where they go:
- packages/api/.env
- Railway env vars (production)

Short guide to get them:
1. Pick a private admin email used only by you/team.
2. Generate a strong password (recommended 20+ chars, random).
3. Store it in your password manager.

Paste here:

ADMIN_DASHBOARD_EMAIL=
ADMIN_DASHBOARD_PASSWORD=

## 8) Apple submission identifiers (EAS submit)

Values:
- YOUR_APPLE_ID_EMAIL
- YOUR_APP_STORE_CONNECT_APP_ID
- YOUR_APPLE_TEAM_ID

Where they go:
- apps/mobile/eas.json under submit.production.ios

Short guide to get them:
1. Apple ID email: the email used for App Store Connect login.
2. App Store Connect App ID:
   - App Store Connect -> My Apps -> your app -> App Information.
   - Copy the numeric Apple ID field.
3. Apple Team ID:
   - developer.apple.com/account -> Membership.
   - Copy Team ID.

Paste here:

APPLE_ID_EMAIL=
APP_STORE_CONNECT_APP_ID=
APPLE_TEAM_ID=

## 9) Quick apply checklist

After you fill the values above, copy them into:
- apps/mobile/.env
- apps/mobile/.env.production.example (or EAS secrets)
- apps/mobile/app.json
- apps/mobile/eas.json
- packages/api/.env
- packages/db/.env

Then run:

```bash
(cd packages/db && npm run prisma:generate)
(cd packages/db && npm run prisma:migrate:dev)
(cd packages/api && npm run build)
(cd apps/mobile && npx tsc --noEmit)
```
