# Hourly App — Full Deployment Plan

> **Goal:** Deploy the Hourly app to iOS (App Store) and the Web.
> **Stack:** Expo + React Native (mobile), Expo Web / static (web), tRPC + Express (API), Prisma + PostgreSQL (DB), Clerk (auth).
> **Monorepo layout:** `apps/mobile` · `packages/api` · `packages/db`

---

## How to use this plan

Each phase is a self-contained sprint. Complete phases in order — later phases depend on earlier ones. Every task shows the **exact files to touch** and the **exact commands to run** so you can vibecode without stopping to think about setup.

> **Repo status update (2026-03-27):**
> - Phases 1–2 are implemented in-repo.
> - Placeholder scaffolding/config files were added for later phases (env examples + deploy config + privacy policy app config field).
> - Remaining items that require real external accounts/keys are tracked in `stillneeded.md`.

---

# Phase 1 — Fix TypeScript & App Config (½ day)

> **Goal:** Get the app to compile cleanly and configure it properly for a real app name + iOS.

### 1.1 — Rename app in `app.json`

**File:** `apps/mobile/app.json`

Change:
```json
"name": "mobile",
"slug": "mobile",
"scheme": "mobile",
```
To:
```json
"name": "Hourly",
"slug": "hourly",
"scheme": "hourly",
```

### 1.2 — Add iOS bundle identifier + permissions to `app.json`

**File:** `apps/mobile/app.json`

Replace the entire `"ios"` block with:
```json
"ios": {
  "bundleIdentifier": "com.hourly.app",
  "buildNumber": "1",
  "supportsTablet": false,
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "Hourly uses your location to show nearby volunteer opportunities.",
    "NSCameraUsageDescription": "Hourly needs camera access to scan QR codes at check-in.",
    "NSPhotoLibraryUsageDescription": "Hourly needs photo library access to set your profile picture.",
    "NSUserTrackingUsageDescription": "This identifier is used to personalize your experience."
  }
}
```

### 1.3 — Add Google Maps API key to `app.json`

**File:** `apps/mobile/app.json`

Inside `"plugins"` array, add:
```json
[
  "expo-location",
  {
    "locationAlwaysAndWhenInUsePermission": "Allow Hourly to use your location."
  }
]
```

Also add at the top level of the `"expo"` object:
```json
"extra": {
  "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
}
```

And add to `"ios"`:
```json
"config": {
  "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
}
```

### 1.4 — Fix TypeScript errors

**File 1:** `apps/mobile/constants/colors.ts`

The file already has `success` and `error` keys — these were already correct. The real error is that some files do `import Colors from '@/constants/Colors'` (capital C, default import) but the file uses a **named export** (`export const Colors`).

Search for wrong imports:
```bash
grep -r "import Colors from" apps/mobile/
```

For every file that does `import Colors from '...'`, change it to:
```typescript
import { Colors } from '@/constants/colors';
```

**File 2:** `apps/mobile/app/index.tsx` — Fix style array

Find the line that passes a `.filter()` result to a `style` prop and wrap it with `StyleSheet.flatten()` or spread it properly:
```typescript
// Before (broken):
style={[styles.foo, condition && styles.bar].filter(Boolean)}

// After (fixed):
style={StyleSheet.flatten([styles.foo, condition && styles.bar].filter(Boolean) as any)}
```

**Verify everything compiles:**
```bash
cd apps/mobile && npx tsc --noEmit
```

---

# Phase 2 — Create EAS Build Config (1 hour)

> **Goal:** Enable `eas build` so you can generate real iOS `.ipa` files.

### 2.1 — Install EAS CLI (global)

```bash
npm install -g eas-cli
```

### 2.2 — Create `eas.json`

**File:** `apps/mobile/eas.json` _(create new)_

```json
{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "buildType": "archive"
      }
    },
    "production": {
      "ios": {
        "buildType": "archive"
      },
      "web": {
        "buildType": "static"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID_EMAIL",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      }
    }
  }
}
```

### 2.3 — Link to EAS project

```bash
cd apps/mobile
eas login           # log into your Expo account
eas build:configure # auto-fills projectId into app.json
```

This adds `"extra": { "eas": { "projectId": "..." } }` to your `app.json` automatically.

---

# Phase 3 — Provision Database (2 hours)

> **Goal:** Get a real PostgreSQL database running and run migrations.

### 3.1 — Create a Supabase project (recommended, free tier)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a region close to your users
3. Copy the **Connection String** (URI format):
   `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

Alternative: [Railway](https://railway.app) → New → Database → PostgreSQL

### 3.2 — Create environment files

**File:** `packages/db/.env` _(create new — git-ignored)_
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
```

**File:** `packages/api/.env` _(create new — git-ignored)_
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
NODE_ENV=development
PORT=3001
```

**File:** `packages/db/.env.example` _(create new — commit this)_
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

**File:** `packages/api/.env.example` _(create new — commit this)_
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
NODE_ENV=development
PORT=3001
CLERK_SECRET_KEY=sk_test_...
```

### 3.3 — Add `@prisma/client` dependency

```bash
cd packages/db
npm install @prisma/client
```

### 3.4 — Generate Prisma client and run first migration

```bash
cd packages/db
npm run prisma:generate     # generates the typed client
npm run prisma:migrate:dev  # creates migration SQL + applies to DB
# When prompted for a migration name, type: "initial"
```

Verify it worked:
```bash
npm run prisma:validate
```

### 3.5 — Update `.gitignore` to exclude `.env` files

**File:** Root `.gitignore` — add if not present:
```
.env
.env.local
.env.production
packages/*/.env
apps/*/.env
```

---

# Phase 4 — Implement Authentication with Clerk (1–2 days)

> **Goal:** Replace the fake "navigate to home" buttons with real Clerk sign-in/sign-up.

### 4.1 — Create a Clerk application

1. Go to [clerk.com](https://clerk.com) → Create Application
2. Name it "Hourly"
3. Enable sign-in methods: Email/password + Google OAuth
4. Copy:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

### 4.2 — Install Clerk Expo SDK

```bash
cd apps/mobile
npx expo install @clerk/expo
```

### 4.3 — Add Clerk keys to mobile env

**File:** `apps/mobile/.env` _(create new — git-ignored)_
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
EXPO_PUBLIC_API_URL=http://localhost:3001/trpc
```

**File:** `apps/mobile/.env.example` _(create new — commit this)_
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/trpc
```

### 4.4 — Wrap the app in ClerkProvider

**File:** `apps/mobile/app/_layout.tsx`

Add to imports:
```typescript
import { ClerkProvider, ClerkLoaded } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';
```

Add a token cache (for persistent sessions):
```typescript
const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};
```

Wrap the root layout return with:
```tsx
<ClerkProvider
  publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
  tokenCache={tokenCache}
>
  <ClerkLoaded>
    {/* existing Stack navigator */}
  </ClerkLoaded>
</ClerkProvider>
```

Install SecureStore:
```bash
npx expo install expo-secure-store
```

### 4.5 — Replace sign-in screen

**File:** `apps/mobile/app/(auth)/sign-in.tsx`

Replace the mock `handleSignIn` with real Clerk:
```typescript
import { useSignIn } from '@clerk/expo';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!isLoaded) return;
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // router.replace is handled by auth redirect in _layout.tsx
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? 'Sign in failed');
    }
  };
  // ...rest of UI unchanged
}
```

### 4.6 — Replace sign-up screen

**File:** `apps/mobile/app/(auth)/sign-up.tsx`

Replace mock sign-up with Clerk:
```typescript
import { useSignUp } from '@clerk/expo';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? 'Sign up failed');
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? 'Verification failed');
    }
  };
  // Show code input UI when pendingVerification is true
}
```

### 4.7 — Auto-redirect based on auth state

**File:** `apps/mobile/app/_layout.tsx`

Add auth-based redirect:
```typescript
import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';

// Inside the root layout component:
const { isSignedIn, isLoaded } = useAuth();

if (!isLoaded) return <LoadingScreen />;

// Add this at the top of the Stack to redirect authenticated users:
// (You'll store the role in Clerk's user.publicMetadata.role)
```

**File:** `apps/mobile/app/index.tsx` (role selection screen)

After role is selected, save it to Clerk metadata before redirecting:
```typescript
import { useUser } from '@clerk/expo';

const { user } = useUser();

const handleRoleSelect = async (role: 'student' | 'org') => {
  await user?.update({ unsafeMetadata: { role } });
  router.replace(role === 'student' ? '/auth/student' : '/auth/org');
};
```

### 4.8 — Add Clerk Secret Key to API

**File:** `packages/api/.env`
```
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

---

# Phase 5 — Wire API to Database (2–3 days)

> **Goal:** Replace all mock data in the tRPC routers with real Prisma database queries.

### 5.1 — Add Prisma client to API package

```bash
cd packages/api
npm install @prisma/client
```

**File:** `packages/api/package.json` — add to dependencies:
```json
"@prisma/client": "*"
```

**File:** `packages/api/src/db.ts` _(create new)_
```typescript
import { PrismaClient } from '../../../packages/db/generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 5.2 — Add Clerk middleware to Express (protect routes)

```bash
cd packages/api
npm install @clerk/express
```

**File:** `packages/api/src/server.ts` — update:
```typescript
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';

app.use(clerkMiddleware());
```

**File:** `packages/api/src/trpc.ts` _(create new or update existing)_
```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import { getAuth } from '@clerk/express';
import { prisma } from './db';
import type { Request } from 'express';

export const createContext = async ({ req }: { req: Request }) => {
  const auth = getAuth(req);
  return { auth, prisma };
};

type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.auth.userId } });
});
```

**File:** `packages/api/src/server.ts` — pass context to tRPC middleware:
```typescript
import { createContext } from './trpc';

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
```

### 5.3 — Rewrite opportunity router

**File:** `packages/api/src/routers/opportunity.ts`
```typescript
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const opportunityRouter = router({
  list: publicProcedure
    .input(z.object({
      causes: z.array(z.string()).optional(),
      creditEligible: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.opportunity.findMany({
        where: {
          ...(input.causes?.length ? { causeTags: { hasSome: input.causes } } : {}),
          ...(input.creditEligible ? { creditEligible: true } : {}),
        },
        take: input.limit + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        include: { organization: { include: { orgProfile: true } } },
        orderBy: { createdAt: 'desc' },
      });
      const hasMore = items.length > input.limit;
      return { items: items.slice(0, input.limit), nextCursor: hasMore ? items[input.limit - 1].id : null };
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const opp = await ctx.prisma.opportunity.findUnique({
        where: { id: input.id },
        include: { organization: { include: { orgProfile: true } } },
      });
      if (!opp) throw new TRPCError({ code: 'NOT_FOUND' });
      return opp;
    }),
});
```

### 5.4 — Rewrite application router

**File:** `packages/api/src/routers/application.ts`
```typescript
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const applicationRouter = router({
  apply: protectedProcedure
    .input(z.object({
      opportunityId: z.string(),
      note: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Look up the User record by Clerk userId
      const user = await ctx.prisma.user.findUnique({ where: { clerkUserId: ctx.userId } });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      return ctx.prisma.application.create({
        data: {
          studentId: user.id,
          opportunityId: input.opportunityId,
          status: 'PENDING',
          note: input.note,
        },
      });
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({ where: { clerkUserId: ctx.userId } });
    if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
    return ctx.prisma.application.findMany({
      where: { studentId: user.id },
      include: { opportunity: true },
      orderBy: { appliedAt: 'desc' },
    });
  }),
});
```

### 5.5 — Rewrite user router

**File:** `packages/api/src/routers/user.ts`
```typescript
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { clerkUserId: ctx.userId },
      include: { studentProfile: true, orgProfile: true },
    });
  }),

  upsert: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.enum(['STUDENT', 'ORGANIZER']),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.upsert({
        where: { clerkUserId: ctx.userId },
        create: { clerkUserId: ctx.userId, ...input },
        update: { firstName: input.firstName, lastName: input.lastName },
      });
    }),
});
```

### 5.6 — Add attendance router (check-in / check-out)

**File:** `packages/api/src/routers/attendance.ts` _(create new)_
```typescript
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const attendanceRouter = router({
  checkin: protectedProcedure
    .input(z.object({ opportunityId: z.string(), qrToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify qrToken matches the opportunity
      const opp = await ctx.prisma.opportunity.findUnique({ where: { id: input.opportunityId } });
      if (!opp || opp.qrToken !== input.qrToken) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid QR code' });
      }
      const user = await ctx.prisma.user.findUnique({ where: { clerkUserId: ctx.userId } });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      return ctx.prisma.attendanceRecord.create({
        data: { studentId: user.id, opportunityId: input.opportunityId, checkedInAt: new Date() },
      });
    }),

  checkout: protectedProcedure
    .input(z.object({ attendanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.attendanceRecord.update({
        where: { id: input.attendanceId },
        data: { checkedOutAt: new Date() },
      });
    }),
});
```

Register the new router in `packages/api/src/router.ts`:
```typescript
import { attendanceRouter } from './routers/attendance';

export const appRouter = router({
  opportunity: opportunityRouter,
  application: applicationRouter,
  user: userRouter,
  attendance: attendanceRouter,
});
```

### 5.7 — Add QR token field to Opportunity model

**File:** `packages/db/prisma/schema.prisma`

Add `qrToken` field to the `Opportunity` model:
```prisma
model Opportunity {
  // ... existing fields ...
  qrToken    String   @default(cuid())
  // ...
}
```

Then run:
```bash
cd packages/db && npm run prisma:migrate:dev
# Name the migration: "add_qr_token_to_opportunity"
```

---

# Phase 6 — Replace Mock Data in Mobile Screens (2–3 days)

> **Goal:** Swap every `import { ... } from '../mocks/data'` with real tRPC hooks.

### 6.1 — Pass auth token to tRPC client

**File:** `apps/mobile/lib/trpc.ts`

Update `getTRPCClient` to attach the Clerk session token:
```typescript
import { useAuth } from '@clerk/expo';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/trpc',
          async headers() {
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 6.2 — Wire up Feed screen

**File:** `apps/mobile/app/(student-tabs)/feed.tsx`

Replace mock import with:
```typescript
import { trpc } from '../../lib/trpc';

// Inside component:
const { data, isLoading, error } = trpc.opportunity.list.useQuery({});
```

Add loading state:
```tsx
if (isLoading) return <ActivityIndicator />;
if (error) return <Text>Failed to load opportunities</Text>;
```

### 6.3 — Wire up Opportunity Detail screen

**File:** `apps/mobile/app/opportunity/[id].tsx`

```typescript
const { id } = useLocalSearchParams<{ id: string }>();
const { data: opportunity, isLoading } = trpc.opportunity.get.useQuery({ id });
const applyMutation = trpc.application.apply.useMutation();

const handleApply = async () => {
  await applyMutation.mutateAsync({ opportunityId: id });
  router.push('/my-shifts');
};
```

### 6.4 — Wire up My Shifts screen

**File:** `apps/mobile/app/(student-tabs)/my-shifts.tsx`

```typescript
const { data: applications, isLoading } = trpc.application.listMine.useQuery();
```

### 6.5 — Wire up Profile screen

**File:** `apps/mobile/app/(student-tabs)/profile.tsx`

```typescript
const { data: me, isLoading } = trpc.user.me.useQuery();
```

### 6.6 — Wire up Org Dashboard screen

**File:** `apps/mobile/app/(org-tabs)/dashboard.tsx`

Create a new `org` tRPC router (Phase 5 extension) that queries opportunities for the current org user, then:
```typescript
const { data: myOpportunities } = trpc.org.myOpportunities.useQuery();
```

### 6.7 — Wire up Org Applicants screen

**File:** `apps/mobile/app/(org-tabs)/applicants.tsx`

```typescript
const { data: applicants } = trpc.org.listApplicants.useQuery({ opportunityId });
const approveMutation = trpc.org.updateApplicationStatus.useMutation();
```

### 6.8 — Wire up Check-in / Scanner

**File:** `apps/mobile/app/org/scanner.tsx` (or `(student-tabs)/checkin.tsx`)

```typescript
const checkinMutation = trpc.attendance.checkin.useMutation();

const handleQRScanned = async ({ data: qrData }: { data: string }) => {
  // qrData should be JSON: { opportunityId, qrToken }
  const { opportunityId, qrToken } = JSON.parse(qrData);
  await checkinMutation.mutateAsync({ opportunityId, qrToken });
  router.push('/shift/active');
};
```

### 6.9 — Remove mock data files (last step after all screens migrated)

Once every screen is wired up, delete:
- `apps/mobile/mocks/data.ts`
- `apps/mobile/mocks/opportunities.ts`

And update `apps/mobile/hooks/useOpportunities.ts` to use the tRPC hook directly.

---

# Phase 7 — Deploy the API Server (1 day)

> **Goal:** Get the Express tRPC API running at a public URL.

### 7.1 — Deploy to Railway (recommended, easiest)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Select `AkhilKonduru1/Hourly1`
3. Set **Root Directory** to `packages/api`
4. Set **Build Command** to `npm run build`
5. Set **Start Command** to `npm run start`
6. Add environment variables in Railway dashboard:
   ```
   DATABASE_URL=postgresql://...  (from Phase 3)
   CLERK_SECRET_KEY=sk_test_...
   NODE_ENV=production
   PORT=3001
   ```
7. Railway gives you a URL like `https://hourly-api.up.railway.app`

### 7.2 — Update mobile app to point to production API

**File:** `apps/mobile/.env.production` _(create new — git-ignored)_
```
EXPO_PUBLIC_API_URL=https://hourly-api.up.railway.app/trpc
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

For EAS builds, add these as EAS secrets:
```bash
cd apps/mobile
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://hourly-api.up.railway.app/trpc"
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_..."
```

### 7.3 — Run database migration in production

```bash
cd packages/db
DATABASE_URL="your_production_db_url" npx prisma migrate deploy
```

Or via Railway: set `DATABASE_URL` as a env var and run the command in the Railway console.

---

# Phase 8 — Build & Submit iOS App (1–2 days)

> **Goal:** Generate a real signed iOS `.ipa` and submit to App Store.

### 8.1 — Prerequisites

- [ ] Paid Apple Developer Account ($99/year) at [developer.apple.com](https://developer.apple.com)
- [ ] Create an App ID in Apple Developer portal: `com.hourly.app`
- [ ] Create App Store Connect listing at [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
  - App Name: "Hourly"
  - Bundle ID: `com.hourly.app`
  - SKU: `hourly-app`
  - Note the **App ID** (10-digit number) for `eas.json`

### 8.2 — Build iOS app with EAS

```bash
cd apps/mobile
eas build --platform ios --profile production
```

EAS will:
- Ask you to log in to Apple Developer
- Auto-generate signing certificates and provisioning profiles
- Build the `.ipa` in Expo's cloud infrastructure
- Give you a download URL when done

### 8.3 — Submit to App Store

```bash
eas submit --platform ios --latest
```

This submits the latest build to App Store Connect.

### 8.4 — App Store Connect metadata (before submission)

Fill in App Store Connect:
- [ ] App description (what Hourly does)
- [ ] Keywords
- [ ] Support URL (can be a GitHub page or simple site)
- [ ] Privacy Policy URL (required — see Phase 10)
- [ ] Screenshots (at least iPhone 6.5" and iPhone 5.5")
- [ ] App category: "Lifestyle" or "Education"
- [ ] Age rating
- [ ] Price: Free

### 8.5 — TestFlight (test before public release)

Before submitting for review:
```bash
eas submit --platform ios --profile preview
```
This uploads to TestFlight so you can test on real devices.

---

# Phase 9 — Web Deployment (1 day)

> **Goal:** Deploy the app to the web so it's accessible from a browser.

### Option A: Expo Web Static Export (Quick, minimal work)

This uses the existing Expo Metro bundler to produce a static web build.

```bash
cd apps/mobile
npx expo export --platform web
```

This creates a `dist/` folder. Deploy it to Vercel:

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `apps/mobile`
3. Set **Build Command** to `npx expo export --platform web`
4. Set **Output Directory** to `dist`
5. Add environment variables:
   ```
   EXPO_PUBLIC_API_URL=https://hourly-api.up.railway.app/trpc
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   ```

**Limitations:** This produces a React Native Web app. Some components may look odd on desktop. Good enough for an MVP web presence.

### Option B: Separate Next.js Web App (Better long-term, 3–5 days extra)

Create a proper web app that shares the same tRPC API:

```bash
cd apps
npx create-next-app@latest web --typescript --tailwind --app
```

**File:** `apps/web/lib/trpc.ts`
```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../packages/api/src/router';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL + '/trpc',
    }),
  ],
});
```

Then build out web-specific pages mirroring the mobile screens. Recommended pages:
- `/` — Landing page
- `/sign-in` and `/sign-up` — Use `@clerk/nextjs`
- `/feed` — Opportunity feed
- `/opportunity/[id]` — Opportunity detail
- `/dashboard` (org only) — Org dashboard

Deploy to Vercel (same steps as Option A but with Next.js).

---

# Phase 10 — Legal & Final Checklist (½ day)

> **Goal:** Meet App Store requirements and launch.

### 10.1 — Privacy Policy

Required by Apple and Clerk. Create a simple page (can use [termly.io](https://termly.io) free generator) covering:
- What data you collect (email, location, hours)
- How you use it
- How users can delete their data

Host it at e.g. `https://hourly.app/privacy` or a GitHub Pages URL.

Add to `app.json`:
```json
"extra": {
  "privacyPolicyUrl": "https://your-domain.com/privacy"
}
```

### 10.2 — Final pre-launch checklist

**App Quality:**
- [ ] Test sign-in / sign-up on real iPhone
- [ ] Test location permissions prompt
- [ ] Test camera permissions prompt (QR scanner)
- [ ] Test full student flow: sign up → browse → apply → check in
- [ ] Test full org flow: sign up → create opportunity → view applicants → scan QR
- [ ] Test offline / no-network state (show error states, not blank screens)

**iOS:**
- [ ] `eas build --platform ios --profile production` succeeds
- [ ] App runs on physical iPhone via TestFlight
- [ ] App Store metadata complete
- [ ] Privacy policy URL live
- [ ] Screenshots uploaded

**Web:**
- [ ] `expo export --platform web` or Next.js build succeeds
- [ ] Vercel deployment live
- [ ] Auth works on web
- [ ] API calls work from browser (CORS configured)

**API:**
- [ ] Railway deployment running
- [ ] `DATABASE_URL` set in production
- [ ] Prisma migrations applied to production DB
- [ ] All API routes return real data (not mock)
- [ ] CORS allows both mobile (any origin) and web domain

**CORS update for production** — `packages/api/src/server.ts`:
```typescript
app.use(cors({
  origin: [
    'https://your-vercel-web-app.vercel.app',
    'https://your-domain.com',
    // Expo goes through native HTTP so no origin restriction needed for mobile
  ],
  credentials: true,
}));
```

---

# Summary Timeline

| Phase | Task | Estimated Time |
|-------|------|---------------|
| 1 | Fix TypeScript & app.json | 2–4 hours |
| 2 | EAS build config | 1 hour |
| 3 | Provision database | 2 hours |
| 4 | Implement Clerk auth | 1–2 days |
| 5 | Wire API to database | 2–3 days |
| 6 | Replace mock data in screens | 2–3 days |
| 7 | Deploy API server | ½–1 day |
| 8 | Build & submit iOS app | 1–2 days |
| 9 | Web deployment | ½–1 day |
| 10 | Legal & final QA | ½ day |
| **Total** | | **~3–4 weeks** |

---

# Quick Reference — Key Commands

```bash
# Development
cd apps/mobile && npx expo start          # Start mobile dev server
cd packages/api && npm run dev            # Start API dev server
cd packages/db && npm run prisma:studio   # Open Prisma database GUI

# Type check
cd apps/mobile && npx tsc --noEmit

# Database
cd packages/db && npm run prisma:generate       # Regenerate types after schema change
cd packages/db && npm run prisma:migrate:dev    # Apply new migration in dev
cd packages/db && npm run prisma:migrate:deploy # Apply migration in production

# EAS builds
cd apps/mobile && eas build --platform ios --profile production
cd apps/mobile && eas build --platform ios --profile development  # simulator build
cd apps/mobile && eas submit --platform ios --latest

# Web export
cd apps/mobile && npx expo export --platform web
```

---

# Key Files Reference

| What | File |
|------|------|
| App config | `apps/mobile/app.json` |
| EAS build config | `apps/mobile/eas.json` |
| Colors design system | `apps/mobile/constants/colors.ts` |
| tRPC client | `apps/mobile/lib/trpc.ts` |
| tRPC provider | `apps/mobile/components/TRPCProvider.tsx` |
| API entry point | `packages/api/src/server.ts` |
| tRPC router index | `packages/api/src/router.ts` |
| tRPC context + auth | `packages/api/src/trpc.ts` |
| Prisma schema | `packages/db/prisma/schema.prisma` |
| Prisma client singleton | `packages/api/src/db.ts` |
| Auth screens | `apps/mobile/app/(auth)/sign-in.tsx`, `sign-up.tsx` |
| Root layout (ClerkProvider) | `apps/mobile/app/_layout.tsx` |
| Student tabs | `apps/mobile/app/(student-tabs)/` |
| Org tabs | `apps/mobile/app/(org-tabs)/` |
