# Garage Dashboard — Real Data (Products, Customers, Orders) Design

**Date:** 2026-07-23
**Status:** Approved
**Scope:** Replace the garage dashboard's hardcoded template data with real database-backed Products, Customers, and Orders. One shared Prisma migration; three new backend modules; dashboard wiring. Payments/Revenue-as-a-feature stays a "Coming soon" placeholder (Revenue metric is derived from order totals).

## Context

- **Repos:** API `mtokaa-api` (NestJS + Prisma/Supabase), frontend `mtokaahero` (Next.js 16 App Router, NextAuth v4). Both on branch `feat/auth-e2e` (auth work already merged into this branch's history).
- **Current garage dashboard:** `app/dashboard/garage/[garageid]/page.tsx` — a single large `'use client'` component with entirely hardcoded metrics, orders, services, and a non-functional "Add Product" form.
- **Backend today:** only `garage/auth` and `garage/profile` endpoints exist. `JwtAuthGuard` verifies the Bearer token and sets `req.user = { id, email, role }` (id = User id). No code references the `Product`/`Service` Prisma models yet; the dev DB is empty. So schema changes are safe.
- **Decisions locked in during brainstorming:**
  - Customers are **walk-in records the garage creates** (no customer login).
  - Orders are garage **jobs** bundling products + services into a total.
  - Order line items **reference a Product OR Service (optional) plus free-text**; **unit price is captured on the item** at creation (history-stable).
  - Order status lifecycle: **PENDING → IN_PROGRESS → COMPLETED → CANCELLED** (separate from payment).
  - Payments: **derived** — Revenue = sum of order totals; a manual paid/unpaid status is deferred to a later Payments sub-project.
  - Frontend uses **client-side fetching** with the session `accessToken` (keep the dashboard a client component).

## Roadmap (context only)

Full garage dashboard is being made real in sub-projects: **Products → Services → Customers → Orders → Payments**. THIS spec covers Products + Customers + Orders together (one shared migration). Services and Payments are separate later specs. Services endpoints are NOT built here; the existing `Service` model is left as-is and may be referenced by order items via `serviceId` once Services ships (the FK is created now, nullable).

## Section 1: Data Model & Migration

One migration. Because the DB is empty and no code uses these models, it is low-risk.

### Product (cleaned up)
Remove the ambiguous multi-owner fields. A product belongs to one garage.
```
model Product {
  id          String   @id @default(uuid())
  name        String
  price       Float
  description String?
  garageId    String
  garage      Garage   @relation(fields: [garageId], references: [id], onDelete: Cascade)
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
This drops `shopId`, `mechanicId`, and the `Shop` relation from Product. Shop has no code using products; nothing breaks. Shop-owned products, if ever needed, are modeled separately later.

### Service (left as-is, plus back-relation)
Keep existing fields. Add `orderItems OrderItem[]` back-relation so order items can reference services later. No other change.

### Customer (new)
```
model Customer {
  id          String   @id @default(uuid())
  name        String
  phoneNumber String?
  vehicleInfo String?
  garageId    String
  garage      Garage   @relation(fields: [garageId], references: [id], onDelete: Cascade)
  orders      Order[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Order (new)
```
enum OrderStatus { PENDING IN_PROGRESS COMPLETED CANCELLED }

model Order {
  id         String      @id @default(uuid())
  garageId   String
  garage     Garage      @relation(fields: [garageId], references: [id], onDelete: Cascade)
  customerId String
  customer   Customer    @relation(fields: [customerId], references: [id])
  status     OrderStatus @default(PENDING)
  total      Float       @default(0)
  items      OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

### OrderItem (new)
```
model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String?
  product     Product? @relation(fields: [productId], references: [id])
  serviceId   String?
  service     Service? @relation(fields: [serviceId], references: [id])
  description String
  quantity    Int      @default(1)
  unitPrice   Float
  createdAt   DateTime @default(now())
}
```
Line total = `quantity * unitPrice`. Order `total` = sum of line totals, recomputed on any item change.

### Garage relations
Add `customers Customer[]` and `orders Order[]` to the `Garage` model. `products Product[]` already exists.

## Section 2: Backend API

Three new modules under `src/garage/`, each mirroring the `garage/profile` pattern (controller + service, guarded by `JwtAuthGuard`, `class-validator` DTOs). Register in `GarageModule`.

### Shared ownership helper
`resolveGarageId(userId: string): Promise<string>` — looks up `garage.id` by `userId`; throws `NotFoundException` if the user has no garage. Every endpoint calls this with `req.user.id` and scopes all queries by the resolved `garageId`. A garage can never read or mutate another garage's data; `:id` operations verify the target row's `garageId` matches (else 404).

### garage/products
- `GET  /api/garage/products` — list caller's garage products.
- `POST /api/garage/products` — create. DTO: `name` (non-empty), `price` (number ≥ 0), `description?`.
- `PATCH /api/garage/products/:id` — update (ownership-checked). Partial DTO.
- `DELETE /api/garage/products/:id` — delete (ownership-checked).

### garage/customers
- `GET  /api/garage/customers` — list.
- `POST /api/garage/customers` — create. DTO: `name` (non-empty), `phoneNumber?`, `vehicleInfo?`.
- `PATCH /api/garage/customers/:id` — update (ownership-checked).
- `DELETE /api/garage/customers/:id` — delete (ownership-checked).

### garage/orders
- `GET  /api/garage/orders` — list. Each row: `id, status, total, createdAt, customer {id,name}, itemCount`.
- `GET  /api/garage/orders/:id` — full order incl. `items[]` (with product/service names when linked).
- `POST /api/garage/orders` — create. DTO:
  - `customerId` (must belong to caller's garage → else 400/404).
  - `status?` (default `PENDING`).
  - `items[]`, each: `{ productId?, serviceId?, description (non-empty), quantity (int ≥ 1), unitPrice? }`.
    - If `productId` given: verify it belongs to the garage, capture ITS current `price` as `unitPrice` (ignore any client `unitPrice`).
    - Else if `serviceId` given: same, capture the service's `price`.
    - Else (ad-hoc): `unitPrice` is **required** from the client (number ≥ 0).
  - Server computes each line and the order `total` inside a `$transaction`. Client never sends prices for catalog items.
- `PATCH /api/garage/orders/:id` — update `status` and/or replace `items[]` (recompute total). Ownership-checked.
- `DELETE /api/garage/orders/:id` — delete order + items (cascade). Ownership-checked.

### Errors
`class-validator` rejects malformed bodies (400). Cross-garage references (customer/product/service not owned by caller) → 400 or 404. Missing garage for the user → 404.

## Section 3: Frontend

### API clients (`lib/api/`)
- `lib/api/http.ts` — shared `apiFetch(path, { method, body, token })` helper: sets `Authorization: Bearer <token>`, JSON headers, throws `Error(message)` on non-2xx. (Generalizes the existing `lib/api/auth.ts` fetch pattern.)
- `lib/api/products.ts`, `lib/api/customers.ts`, `lib/api/orders.ts` — typed CRUD wrappers + response interfaces.

### Dashboard restructure
`app/dashboard/garage/[garageid]/page.tsx` currently does too much. Extract the tabs into `components/dashboard/garage/`:
- `ProductsTab.tsx` — fetch list on mount (session token), table (name, price, description, created, edit/delete actions), "Add Product" form → real POST → refetch. Loading/empty states, sonner toasts.
- `CustomersTab.tsx` — same shape for customers (name, phone, vehicle).
- `OrdersTab.tsx` — list (customer, status, item count, total, created); "New Order" dialog: pick a customer, add line items (select a product/service from the garage catalog or ad-hoc with description+unitPrice, set quantity; a display-only running total; authoritative total returned by server); change status; delete.
- The page composes the shell (sidebar/header/theme — unchanged) + the tabs.

### Metric cards (real)
- Products = product count.
- Pending Orders = count of orders with status PENDING.
- Active Customers = customer count.
- Total Revenue = sum of all order totals (derived; label clarifies it's gross order value).
- Payments Information card → replaced with a clearly-marked "Coming soon" placeholder.

### Data flow
Client component fetches with `useSession()` `accessToken` on mount per tab. After any mutation, refetch that resource and recompute the affected metric. No server-component conversion.

## Verification

No automated test framework in either repo (established constraint). Verify by:
1. `pnpm build` (API via `nest build`, frontend via `next build`) — both compile.
2. Apply migration to the dev DB; confirm new tables exist.
3. Boot API; with a real garage access token (register/login a garage), curl each endpoint: create/list/update/delete a product; same for customer; create an order referencing that product + an ad-hoc item, confirm server-computed total; list/detail/patch status/delete.
4. Ownership check: a second garage's token cannot see or mutate the first garage's rows (expect empty list / 404).
5. Dashboard E2E: add customer → add product → create order referencing them → metrics update (Products, Pending Orders, Active Customers, Revenue) → edit + delete flows work; Payments shows "Coming soon".

## Global Constraints

- API port 8080, global prefix `/api`. Frontend port 3000. `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.
- Two separate git repos; commit to each independently. Both on `feat/auth-e2e`.
- No test framework; verification is build + runtime curl/UI (do not introduce a test framework).
- JWT payload `{ id, email, role }`; `JwtAuthGuard` sets `req.user`. All garage endpoints scope by garage resolved from `req.user.id`; never trust a client-supplied garageId.
- Order item unit prices for catalog references are captured server-side from the Product/Service record; only ad-hoc items accept a client `unitPrice`.
- Migration is destructive to the `Product` model shape (drops shop/mechanic ownership); acceptable because no code uses it and the dev DB is empty. Requires explicit consent for any `migrate reset`; prefer `migrate dev` (additive + Product alter) which does not need a full reset.

## Risks / Notes

- Altering `Product` (dropping columns/relations) is a schema change `prisma migrate dev` handles with a generated migration; since the table is empty, no data migration is needed. If Prisma flags the Shop relation removal as needing a reset, confirm the DB is empty first and proceed with an additive-then-alter migration rather than a full reset where possible.
- `OrderItem` allows both `productId` and `serviceId` null (ad-hoc). The service enforces "at most one of productId/serviceId, and if neither then unitPrice required" — this rule lives in the service/DTO, not the DB.
- Revenue as "sum of all order totals" counts cancelled orders too unless filtered; the metric will exclude CANCELLED to avoid inflating revenue.
