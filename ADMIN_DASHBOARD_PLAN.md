# Hourly Admin Dashboard Implementation Plan

## Goal

Add a dedicated admin portal that is reachable from the welcome flow, locked behind a specific email/password combination, and enables:

- Organization moderation: approve/deny organizations
- Appeal lifecycle: denied organizations can submit appeals, and admins can resolve them
- Post moderation: admins can remove/restore opportunities
- Student feed gating: only opportunities from approved organizations and non-removed posts appear to students
- In-depth filtering/search across organizations, appeals, and posts

This plan is intentionally implementation-oriented for the current staged architecture (Expo app + tRPC mock-backed API), while remaining compatible with a future Prisma-backed migration.

---

## Current State Snapshot

- Mobile app already uses tRPC and Clerk scaffolding
- API currently uses in-memory mock data (not persistent DB)
- Student feed/detail reads `opportunity.list` and `opportunity.getById`
- There is no admin route, admin auth, or moderation domain yet

---

## Scope

### In Scope (this implementation)

1. Add admin authentication using a server-side credential pair
2. Add admin session token issuance and validation in API context
3. Add admin router with moderation and appeal operations
4. Add admin login and dashboard UI routes
5. Add student-side visibility filtering based on moderation status
6. Add detailed filters/search in admin dashboard sections
7. Add plan and operational env docs

### Out of Scope (future iteration)

1. Persistent admin sessions in DB/Redis
2. MFA for admin login
3. Full organizer self-service appeal UI in organizer tabs
4. Full audit log history UI (beyond basic moderation metadata)

---

## Security and Access Model

### Admin Login

- Admin credentials are configured in API env variables:
  - `ADMIN_DASHBOARD_EMAIL`
  - `ADMIN_DASHBOARD_PASSWORD`
- Mobile admin login calls `admin.login` mutation
- API returns an opaque admin session token
- Mobile stores token in secure storage
- Token is sent in `x-admin-token` header for admin requests

### API Context

tRPC context derives:

- `userId` from Clerk JWT or demo fallback (`x-demo-user-id`)
- `adminEmail` from a valid `x-admin-token` session

Context exposes three procedure types:

- `publicProcedure`
- `protectedProcedure` (requires user auth)
- `adminProcedure` (requires valid admin token)

---

## Data Domain (In-Memory for Now)

### Organization Moderation

`OrganizationRecord`

- `id`
- `name`
- `contactEmail`
- `causeTags`
- `description`
- `status`: `PENDING | APPROVED | DENIED | APPEALED`
- `denialReason?`
- `appeal?`
- `createdAt`
- `updatedAt`

### Appeal

`AppealRecord`

- `id`
- `organizationId`
- `message`
- `submittedAt`
- `status`: `PENDING | APPROVED | REJECTED`
- `resolutionNote?`
- `resolvedAt?`

### Opportunity Moderation

Extend `Opportunity` with:

- `postStatus`: `VISIBLE | REMOVED`
- `removedReason?`
- `moderatedAt?`

### Admin Session

`AdminSession`

- `token`
- `email`
- `createdAt`
- `expiresAt`

---

## API Contract Plan

### Admin Router

1. `admin.login`
- Input: `{ email, password }`
- Output: `{ token, email, expiresAt }`
- Validates against env credentials

2. `admin.logout`
- Input: none
- Removes current admin token session

3. `admin.getOverview`
- Output counts:
  - organizations by status
  - posts by status
  - appeals pending count

4. `admin.listOrganizations`
- Input:
  - `status?: PENDING | APPROVED | DENIED | APPEALED | ALL`
  - `search?: string`
  - `cause?: string`
- Output: filtered/sorted organizations with appeal and moderation metadata

5. `admin.reviewOrganization`
- Input:
  - `organizationId`
  - `decision: APPROVE | DENY`
  - `reason?: string`
- Behavior:
  - APPROVE -> org status approved, opportunities under org become visible by org policy
  - DENY -> org denied, reason required/fallback assigned

6. `admin.submitAppeal` (public for staged flow)
- Input:
  - `organizationId`
  - `message`
- Behavior:
  - allowed only for denied organizations
  - sets org status to appealed and creates/updates appeal record

7. `admin.resolveAppeal`
- Input:
  - `organizationId`
  - `decision: APPROVE | REJECT`
  - `note?: string`
- Behavior:
  - APPROVE -> org approved
  - REJECT -> org denied

8. `admin.listPosts`
- Input:
  - `status?: VISIBLE | REMOVED | ALL`
  - `search?: string`
  - `organizationId?: string`
  - `cause?: string`
- Output: filtered/sorted opportunities with moderation metadata

9. `admin.moderatePost`
- Input:
  - `opportunityId`
  - `action: REMOVE | RESTORE`
  - `reason?: string`
- Behavior:
  - REMOVE -> hidden from students
  - RESTORE -> visible (if org approved)

### Student Visibility Enforcement

Update `opportunity.list` and `opportunity.getById` to enforce:

- organization status must be `APPROVED`
- post status must be `VISIBLE`

This ensures admin moderation has immediate effect on student-facing views.

---

## Mobile UX Plan

### Routing

Add routes:

- `/admin/login`
- `/admin/dashboard`

Add welcome access path:

- Add `Admin Portal` entry action on welcome screen

### Admin Login Screen

- Inputs: email/password
- Calls `admin.login`
- On success:
  - save token to secure storage
  - route to `/admin/dashboard`
- On failure:
  - inline error + retry

### Admin Dashboard Screen (single-page, sectioned)

1. Header
- welcome/admin identity
- quick stats
- sign out button

2. Organization Moderation Section
- status filter chips (`ALL/PENDING/APPROVED/DENIED/APPEALED`)
- search box
- optional cause filter
- cards with:
  - org metadata
  - status
  - denial reason (if denied)
  - appeal details (if appealed)
  - actions: approve/deny/resolve appeal

3. Appeals Queue Section
- list pending appeals
- approve/reject actions with note support

4. Post Moderation Section
- status filter (`ALL/VISIBLE/REMOVED`)
- search box
- org filter support
- cards with:
  - title/org/date
  - moderation status
  - remove/restore actions

### Header Injection

Enhance existing tRPC provider to include `x-admin-token` from secure storage on each request.

---

## Edge Cases and Handling

1. Invalid admin token
- Admin queries return unauthorized
- Dashboard redirects to login

2. Missing env admin credentials
- `admin.login` fails with clear error

3. Approving org with removed posts
- posts remain removed until explicitly restored

4. Restoring post for denied org
- post stays blocked from student feed until org approval

5. Appeals submitted for non-denied org
- reject with validation error

6. Server restart in mock mode
- admin session tokens reset (known limitation in in-memory mode)

---

## Validation Checklist

1. Mobile
- `npx tsc --noEmit`

2. API
- `npm run build`

3. Functional
- Admin login success/failure paths
- Approve org -> org posts appear on student feed
- Deny org -> org posts disappear from student feed
- Submit appeal -> appears in appeals queue
- Resolve appeal approve -> org visible again
- Remove post -> disappears from student feed
- Restore post -> reappears if org approved

---

## Deployment Notes

Required env values to run admin auth in non-demo mode:

- `ADMIN_DASHBOARD_EMAIL`
- `ADMIN_DASHBOARD_PASSWORD`
- `CLERK_SECRET_KEY` (for normal user auth)

If `ALLOW_DEMO_AUTH=true`, user flows can still run with demo identity while admin remains separately authenticated by admin credentials.

---

## Future Hardening

1. Move admin sessions and moderation data to Prisma tables
2. Add admin role model and hashed passwords
3. Add RBAC scopes (`moderate_orgs`, `moderate_posts`, `resolve_appeals`)
4. Add immutable moderation audit log
5. Add notifications to organizations for decisions and appeal updates
