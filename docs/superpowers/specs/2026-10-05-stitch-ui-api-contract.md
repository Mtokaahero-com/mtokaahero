# Stitch UI overhaul — API contract

**Date:** 2026-10-05
**UI source:** Stitch project "Mtokaahero Auto Services Marketplace" (`13639541138554380214`)
**Status:** Frontend built against this contract; served today by the in-app mock (`app/api/mock/v1/[...path]`).

The frontend now matches the Stitch screens: marketplace (desktop + mobile), express rescue checkout,
live rescue tracking, partner onboarding, the garage command dashboard, and the auth screens. Most of
those screens need endpoints that `mtokaa-api` does not have yet. This document is the contract the
frontend codes against, so the backend can implement it without UI changes.

## Switching from the mock to the real API

All calls in this contract go through `marketplaceFetch` (`lib/api/client.ts`), whose base URL is
`NEXT_PUBLIC_MARKETPLACE_API_URL` (default `/api/mock/v1`). Point it at `http://localhost:8080/api/v1`
once the endpoints exist, then delete `app/api/mock` and `lib/mock`.

Two calls already use the real API: `POST /organizations` (partner onboarding) and `GET /me`
(memberships for the header and dashboard gate).

## Conventions

- Money is `{ amount: number, currency: 'KES' }` in whole shillings (roadmap P8).
- Errors are problem+json `{ code, detail, errors?: [{ field, message }] }`, as `parseProblem` expects.
  Validation failures are `422 VALIDATION_FAILED` with field errors; the forms map them onto inputs.
- Garage endpoints are tenant-scoped: bearer token plus `X-Organization-Id`, same as `/organization`.
- Types live in `lib/api/{marketplace,rescue,partners,garage,support}.ts`. Those files are the source of truth.

## Marketplace (public)

| Method | Path | Returns | Notes |
|---|---|---|---|
| GET | `/marketplace/summary?localityId=` | `MarketplaceSummary` | Hero badge (active bays), region ETA, delivery-mode counts, rescue ETA window, active patrol. |
| GET | `/marketplace/filters` | `MarketplaceFilters` | Makes → models → years, localities, categories, providers, rating buckets, ETA and price ranges. |
| GET | `/marketplace/offers` | `OfferPage` | Query: `q, makeId, modelId, year, localityId, categoryId, fulfilment[], providerId[], minRating, maxEtaMinutes, maxPrice, sort (FASTEST_ARRIVAL\|TOP_RATED\|LOWEST_PRICE\|OEM_FIT), page, pageSize`. `fitment` echoes the matched vehicle. |
| GET | `/marketplace/offers/:id` | `Offer` | |

`Offer` carries domain fields (`type`, `fulfilment`, `price`, `provider`) plus provider-entered display
labels the cards show: `modeLabel`, `highlight` (dark = live dispatch, light = shop fact), `spec`,
`priceNote`, `action`, and mobile extras (`distanceLabel`, `nextSlot`, `chips`). Label tones are
semantic (`rescue | primary | amber | muted | success`), never colours.

## Rescue (public, guest-friendly — roadmap P2)

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| POST | `/rescue/quotes` | `{ offerIds, mode: ROADSIDE\|IN_SHOP, location? }` | `CheckoutQuote`: provider card, lines, fees (travel fee only for ROADSIDE), totals, in-shop savings, response/dispatch times, hotline. One provider per quote (P10). |
| GET | `/geo/reverse?lat=&lng=` | | `ResolvedLocation`: label, detail, accuracy, static map tile + bounds. Replace with Google Maps geocoding. |
| POST | `/rescue/requests` | `RescueRequestInput` (contact, vehicle, location, notes, payment method, quote id) | `201 RescueRequestCreated` with an unguessable `trackingToken`. Optional bearer token links it to an account. |
| GET | `/rescue/track/:trackingToken` | | `RescueTracking`: status, ETA, 4-step timeline, technician, release code, vehicle, order, map tile with technician + motorist points. |

The tracking page polls every 10 s (P4's location cadence) until the WebSocket gateway exists.
`paymentMethod` is recorded as the motorist's preference; P5 still holds (no platform money handling)
until the payments spec changes it.

## Partners

| Method | Path | Returns | Notes |
|---|---|---|---|
| GET | `/partners/program` | `PartnerProgram` | Capability list, radius range/marks, advantages, testimonial, dispatch stats (P9: real data or omitted). |
| POST | `/organizations` | `OrganizationView` | **Exists.** Called first; needs a verified email. |
| POST | `/partners/documents` | `UploadedDocument` | `multipart/form-data` with `file` (PDF/JPG/PNG ≤ 15 MB). |
| POST | `/partners/applications` | `PartnerApplication` | `{ organizationId, type, taxPin, bays, vans, address, location, capabilityIds, radiusKm, documentIds, payout }`. Maps to roadmap sub-project 1's new organization fields. |

## Garage operations (tenant-scoped)

| Method | Path | Returns |
|---|---|---|
| GET | `/garage/dashboard` | `GarageDashboard`: shop header, 4 KPIs, revenue buckets (parts/labor/rescue), payout date, ledger URL, fleet. |
| PATCH | `/garage/availability` | `{ accepting }` → shop. Drives the "Online: Accepting Rescues" toggle (SOS broadcast eligibility, P3). |
| GET | `/garage/dispatch-radar` | `DispatchRadar`: open SOS calls in the geo-fence with `expiresAt` for the countdown. Polled every 15 s. |
| POST | `/garage/dispatch-radar/:id/accept` | `{ trackingToken }`; `409` when another garage won (first to accept wins). |
| GET | `/garage/catalog?type=&page=&pageSize=` | `CatalogPage` with per-type counts for the tabs. |
| POST | `/garage/catalog` | `CatalogItemInput` → `CatalogItem`. |
| PATCH | `/garage/catalog/:id` | `{ status?, restock? }` → `CatalogItem`. |
| DELETE | `/garage/catalog/:id` | `204`. |
| GET | `/garage/reviews?limit=3` | `Review[]`. |
| POST | `/garage/reviews/:id/reply` | `{ body }` → `Review`. |
| GET | `/garage/ledger.csv` | CSV download (served from `revenue.ledgerUrl`). |

## Support

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/support/messages` | `{ name, email, topic, message }` | `201 { id, ticket }` |

## Deliberate departures from the Stitch mocks

- Prices are KES (P8), so `$35.00` reads `KES 4,550`; KPI tiles use compact figures (`KES 3.23M`).
- Sign-in follows P1 (email or phone + password); the OTP/social variant of the screen is not used.
- The homepage hero video is gone; the Stitch marketplace replaces it.
- Desktop tracking reuses the mobile modules beside a larger map (the design is mobile-only).
