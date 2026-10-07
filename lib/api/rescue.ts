import type { Money } from '@/lib/format';
import { marketplaceFetch } from './client';

export type ServiceMode = 'ROADSIDE' | 'IN_SHOP';
export type PaymentMethod = 'MPESA' | 'CARD' | 'ON_ARRIVAL';
export type RescueStatus = 'RECEIVED' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED' | 'CANCELLED';

export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface ResolvedLocation extends GeoPoint {
    /** Road or landmark, e.g. "Waiyaki Way, Westlands". */
    label: string;
    /** Extra hint for the mechanic, e.g. "Near TotalEnergies Service Station, Outbound Lane". */
    detail: string;
    accuracyM?: number;
    /** Static map tile covering `bounds`, used until an interactive map is wired in. */
    map: MapTile;
}

export interface MapTile {
    imageUrl: string;
    bounds: { north: number; south: number; east: number; west: number };
}

export interface QuoteLine {
    id: string;
    offerId?: string;
    kind: 'PART' | 'SERVICE';
    title: string;
    image?: string;
    icon?: string;
    /** Mono chip, e.g. "OEM: 0 092 S40 080" or "On-Site Service". */
    code: string;
    /** Coloured note next to the chip, e.g. "18 Mos Warranty". */
    note: { label: string; tone: 'primary' | 'amber' };
    description: string;
    quantity: number;
    amount: Money;
}

export interface QuoteFee {
    id: 'TRAVEL' | 'ESCROW';
    label: string;
    shortLabel: string;
    description: string;
    amount: Money;
}

export interface CheckoutQuote {
    id: string;
    mode: ServiceMode;
    provider: {
        id: string;
        name: string;
        image: string;
        rating: number;
        jobsCompleted: number;
        distanceKm: number;
        bayLabel: string;
    };
    lines: QuoteLine[];
    fees: QuoteFee[];
    subtotal: Money;
    total: Money;
    /** What switching to the in-shop bay saves, shown on the mode selector. */
    inShopSavings: Money;
    responseMinutes: number;
    avgDispatchMinutes: number;
    etaTargetMinutes: number;
    hotline: { display: string; tel: string };
}

export interface RescueRequestInput {
    quoteId: string;
    offerIds: string[];
    mode: ServiceMode;
    contact: { fullName: string; phone: string; email: string };
    vehicle: { make: string; model: string; year: number; plate: string };
    location: GeoPoint & { label: string; detail?: string };
    notes: string;
    paymentMethod: PaymentMethod;
}

export interface RescueRequestCreated {
    id: string;
    code: string;
    /** Unguessable token for the guest tracking link (roadmap P2). */
    trackingToken: string;
    status: RescueStatus;
}

export interface RescueTracking {
    id: string;
    code: string;
    trackingToken: string;
    status: RescueStatus;
    createdAt: string;
    eta: { minutes: number; distanceKm: number; via: string } | null;
    timeline: { status: Exclude<RescueStatus, 'CANCELLED'>; label: string; at: string | null; caption: string }[];
    technician: {
        name: string;
        title: string;
        provider: string;
        photo: string;
        rating: number;
        reviewCount: number;
        vehiclePlate: string;
        level: string;
        phone: string;
        whatsapp: string;
        unitLabel: string;
    } | null;
    releaseCode: string;
    vehicle: { label: string; shortLabel: string; engine: string; plate: string };
    order: { title: string; description: string; total: Money; paymentMethod: PaymentMethod };
    map: MapTile & { technician: GeoPoint | null; motorist: GeoPoint };
    emergencyNumber: string;
}

export const rescueApi = {
    quote: (input: { offerIds: string[]; mode: ServiceMode; location?: GeoPoint }) =>
        marketplaceFetch<CheckoutQuote>('/rescue/quotes', { method: 'POST', body: input }),
    reverseGeocode: (point: GeoPoint) => marketplaceFetch<ResolvedLocation>('/geo/reverse', { query: { lat: point.lat, lng: point.lng } }),
    create: (input: RescueRequestInput, token?: string) =>
        marketplaceFetch<RescueRequestCreated>('/rescue/requests', { method: 'POST', body: input, token }),
    track: (trackingToken: string) => marketplaceFetch<RescueTracking>(`/rescue/track/${encodeURIComponent(trackingToken)}`),
};

const LAST_TRACKING_KEY = 'mtokaa.rescue.last-tracking';

export function rememberTracking(token: string) {
    try {
        localStorage.setItem(LAST_TRACKING_KEY, token);
    } catch {
        // Without storage the motorist still has the SMS link.
    }
}

export function lastTracking(): string | null {
    try {
        return localStorage.getItem(LAST_TRACKING_KEY);
    } catch {
        return null;
    }
}
