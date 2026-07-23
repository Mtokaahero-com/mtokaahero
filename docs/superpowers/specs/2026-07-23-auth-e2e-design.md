# End-to-End Auth: Sign Up & Log In — Design

**Date:** 2026-07-23
**Status:** Approved
**Scope:** Make signup and login work end-to-end for GARAGE, MECHANIC, and SHOP roles across the NestJS API (`mtokaa-api`) and the Next.js frontend (`mtokaahero`). Skip email/phone verification.

## Problem

The auth scaffold is ~90% wired but the end-to-end flow is broken:

1. **Post-login 404.** Sign-in and `middleware.ts` redirect to `/dashboard/garage`, `/dashboard/mechanics`, `/dashboard/vendors`, but the only real dashboard pages are the dynamic `/dashboard/garage/[garageid]`, `/dashboard/mechanics/[mechanicId]`, `/dashboard/vendors/[vendorid]`. The non-parameterized paths render nothing (404).
2. **No self-lookup.** After login the NextAuth session holds `user.id` + `role`, but the dashboards are keyed by the *entity* id (garage/mechanic/shop id). The backend profile endpoints (`GET /{role}/profile/:id`) look up by entity id, so a freshly-logged-in user has no way to discover their own dashboard id.
3. **Dead/broken pages.** `/auth/user` posts to a nonexistent `/api/auth/users` and redirects to nonexistent routes; `/auth/myaccount` is a pure mock. Both are broken routes.
4. **No auto-login / no logout.** Registration bounces to the sign-in page; there is no sign-out anywhere.

Out of scope: email/phone verification (no backend support exists — nothing to skip), plain car-owner `USER` signup, and password reset.

## Current State (verified)

- **Backend (NestJS, Prisma/Supabase Postgres), port 8080, global prefix `/api`:**
  - `POST /api/auth/login` — email or phone + password → `{ accessToken, refreshToken, user }`. Tokens signed with `JWT_SECRET`, payload `{ id, email, role }`.
  - `POST /api/auth/refresh` — guarded by `RefreshJwtGuard`.
  - `POST /api/garage/auth/register`, `POST /api/mechanic/auth/register`, `POST /api/shop/auth/register` — create `User` + role entity in a transaction.
  - `GET/PATCH /api/{garage,mechanic,shop}/profile/:id` — guarded by `JwtAuthGuard`, keyed by **entity id**.
  - `JwtAuthGuard` verifies the Bearer token and sets `req.user = payload` (so `req.user.id` = the User id).
  - `bcrypt`, `@nestjs/jwt`, `@nestjs/config` installed; prisma migration `20260710152956_init` present.
- **Frontend (Next.js 16, NextAuth v4 credentials), port 3000:**
  - `authOptions` credentials provider calls `authApi.login`, persists `user.id/role/accessToken/...` into the JWT and session.
  - `lib/api/auth.ts` — typed client for login/refresh/register.
  - `middleware.ts` — protects `/dashboard/*`, redirects authed users off `/auth/*` using a role→route map.
  - Register pages exist for garage/mechanic/shop and already POST the correct DTOs.
  - `.env`: `NEXT_PUBLIC_API_URL=http://localhost:8080/api` (matches backend).

## Solution

### Backend: add self ("me") profile endpoints

Add one endpoint per role that resolves the caller's own entity from the JWT, so the frontend can map a logged-in user to their dashboard id.

- `GET /api/garage/profile/me`
- `GET /api/mechanic/profile/me`
- `GET /api/shop/profile/me`

Each:
- Is guarded by the existing `JwtAuthGuard`.
- Reads `req.user.id` (the User id) via `@Request()`.
- Looks up the entity by `userId` (each entity has a unique `userId`), returns it (including its `id` and the same `user` include shape as `findOne`).
- Returns `404` if the user has no entity of that role.

**Route ordering constraint:** declare the `me` route **before** the `:id` route in each controller so `me` is not captured as an `:id` param.

Add a `findByUserId(userId)` method to each profile service mirroring `findOne` but querying `where: { userId }`.

### Frontend: index dashboards that self-resolve

Add server-component index pages:
- `app/dashboard/garage/page.tsx`
- `app/dashboard/mechanics/page.tsx`
- `app/dashboard/vendors/page.tsx`

Each:
1. Calls `getServerSession(authOptions)`. If no session → `redirect('/auth/signin')`.
2. Calls the matching `/{role}/profile/me` endpoint with `Authorization: Bearer <session.user.accessToken>`.
3. On success → `redirect('/dashboard/{segment}/{entity.id}')` (the existing rich `[id]` page).
4. On failure (e.g. 401/404) → `redirect('/auth/signin')`.

A small shared server helper (`lib/api/profile.ts`) wraps the three `me` fetches with the Bearer token.

### Frontend: auto-login after registration

In each register page's `onSubmit`, after `authApi.register*` succeeds:
1. Call `signIn('credentials', { email: data.email, password: data.password, redirect: false })`.
2. On success → `router.push('/dashboard/{segment}')` (the index page resolves the id).
3. On `signIn` error → fall back to `router.push('/auth/signin')` with a toast.

### Frontend: logout

Add a client logout control calling `signOut({ callbackUrl: '/auth/signin' })`. Provide it as a small reusable client component (`components/fragments/LogoutButton.tsx`) and place it in each dashboard header area. (The `[id]` dashboards have header/settings regions where a logout control fits.)

### Cleanup

- Delete `app/auth/user/page.tsx` and `app/auth/myaccount/page.tsx` (broken/mock).
- Ensure `middleware.ts` `AUTH_PAGES` no longer references removed pages and its role→route map matches the three index routes (`/dashboard/garage`, `/dashboard/mechanics`, `/dashboard/vendors`).

## Data Flow (end-to-end)

```
Register (garage)
  → POST /api/garage/auth/register → 201
  → signIn('credentials', {email, password, redirect:false})
      → NextAuth authorize → POST /api/auth/login → { accessToken, user }
      → session { user.id, role, accessToken }
  → router.push('/dashboard/garage')
  → index page (server): getServerSession
      → GET /api/garage/profile/me  (Bearer accessToken)
      → { id, ... }
  → redirect('/dashboard/garage/{id}') → rich dashboard renders

Login (existing user)
  → /auth/signin → signIn → session → push('/dashboard/{role}') → same self-resolve

Logout
  → signOut({ callbackUrl: '/auth/signin' })
```

## Components & Boundaries

| Unit | Responsibility | Depends on |
|------|----------------|------------|
| `{role}-profile.controller` `getMe` | Map JWT → own entity | `JwtAuthGuard`, profile service |
| `{role}-profile.service.findByUserId` | Query entity by `userId` | Prisma |
| `lib/api/profile.ts` | Fetch `/me` with Bearer token (server-side) | `NEXT_PUBLIC_API_URL` |
| `app/dashboard/{role}/page.tsx` | Resolve session → entity id → redirect | `getServerSession`, `lib/api/profile.ts` |
| register pages `onSubmit` | Register → auto-login → push index | `authApi`, `signIn` |
| `LogoutButton` | Sign out | `signOut` |

## Error Handling

- **Login failure:** NextAuth `authorize` throws → sign-in page shows a toast (existing behavior).
- **`/me` 401 (expired/absent token) or 404 (no entity):** index page redirects to `/auth/signin`.
- **Auto-login failure after successful register:** toast + redirect to `/auth/signin` (account exists, user can log in manually).
- **Duplicate email/phone on register:** backend returns `409` with message; register page surfaces it via toast (existing behavior).

## Verification

No automated test harness exists. Verification is manual + build checks:

1. **API build:** `pnpm build` (or `nest build`) in `mtokaa-api` compiles clean.
2. **Boot both servers:** API on `:8080`, Next on `:3000`.
3. **Endpoint smoke test:** obtain a token via `POST /api/auth/login`, then `curl` each `GET /api/{role}/profile/me` with the Bearer token → expect the entity JSON with `id`.
4. **E2E per role:** register → confirm auto-login lands on `/dashboard/{role}/{id}`; sign out → lands on sign-in; sign back in → same dashboard.
5. **Frontend build:** `pnpm build` in `mtokaahero` compiles clean (removed pages don't break imports).

## Risks / Notes

- `JWT_SECRET` in the API `.env` is written as `JWT_SECRET= "..."`. Dotenv strips surrounding quotes and trims whitespace, so the effective secret is consistent for both signing and verification — login and `/me` use the same secret, so tokens verify. No change needed, but noted.
- Frontend `NEXTAUTH_SECRET` and backend `JWT_SECRET` are independent token systems (NextAuth session cookie vs. API access token); they do not need to match.
- Both repos are separate git repositories (`mtokaa-api` and `mtokaahero`), each on `main`. Changes span both; commits go to each repo independently.
