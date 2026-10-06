import type { Money } from '@/lib/format';
import { marketplaceFetch } from './client';
import type { ItemType } from './marketplace';

/** Every garage endpoint is tenant-scoped: bearer token plus the X-Organization-Id header, like mtokaa-api's /organization routes. */
export interface GarageAuth {
    token: string;
    organizationId: string;
}

export interface GarageDashboard {
    shop: {
        id: string;
        name: string;
        tenantCode: string;
        tier: string;
        rating: number;
        reviewCount: number;
        location: string;
        accepting: boolean;
        autoDispatch: boolean;
        utilizationPct: number;
        mechanicsDispatched: number;
    };
    kpis: {
        revenue: { total: Money; previous: Money; changePct: number; sparkline: number[] };
        rescues: { completed: number; avgMinutes: number; onTimePct: number };
        parts: { unitsFitted: number; inStockPct: number; topSeller: { name: string; dispatched: number } };
        csat: { pct: number; rating: number; ratings: number; escalations: number };
    };
    revenue: {
        period: string;
        buckets: { label: string; parts: number; labor: number; rescue: number }[];
        nextPayout: string;
        ledgerUrl: string;
    };
    fleet: { onRoad: number; total: number; note: string };
}

export interface RadarCall {
    id: string;
    title: string;
    icon: string;
    severity: 'URGENT' | 'STANDARD';
    location: string;
    distanceKm: number;
    vehicle: string;
    estimate: Money;
    paymentLabel: string;
    expiresAt: string;
}

export interface DispatchRadar {
    radiusKm: number;
    urgentCount: number;
    calls: RadarCall[];
}

export interface CatalogItem {
    id: string;
    type: ItemType;
    title: string;
    code: string;
    image: string;
    category: string;
    unitPrice: Money;
    stock: { kind: 'UNITS' | 'BAYS' | 'INSTANT'; quantity: number | null; label: string };
    rating: number;
    reviewCount: number;
    status: 'ACTIVE' | 'PAUSED';
}

export interface CatalogPage {
    items: CatalogItem[];
    counts: Record<'ALL' | ItemType, number>;
    page: number;
    pageSize: number;
    total: number;
}

export interface CatalogItemInput {
    title: string;
    type: ItemType;
    unitPrice: number;
    stock: string;
    category: string;
    sku: string;
}

export interface Review {
    id: string;
    author: string;
    vehicle: string;
    rating: number;
    comment: string;
    createdAt: string;
    verified: boolean;
    reply: string | null;
}

const tenant = (a: GarageAuth) => ({ token: a.token, headers: { 'X-Organization-Id': a.organizationId } });

export const garageApi = {
    dashboard: (a: GarageAuth) => marketplaceFetch<GarageDashboard>('/garage/dashboard', tenant(a)),
    radar: (a: GarageAuth) => marketplaceFetch<DispatchRadar>('/garage/dispatch-radar', tenant(a)),
    acceptCall: (a: GarageAuth, id: string) =>
        marketplaceFetch<{ trackingToken: string }>(`/garage/dispatch-radar/${id}/accept`, { ...tenant(a), method: 'POST' }),
    catalog: (a: GarageAuth, query: { type?: ItemType; page?: number; pageSize?: number }) =>
        marketplaceFetch<CatalogPage>('/garage/catalog', { ...tenant(a), query }),
    createItem: (a: GarageAuth, input: CatalogItemInput) =>
        marketplaceFetch<CatalogItem>('/garage/catalog', { ...tenant(a), method: 'POST', body: input }),
    updateItem: (a: GarageAuth, id: string, patch: Partial<Pick<CatalogItem, 'status'>> & { restock?: number }) =>
        marketplaceFetch<CatalogItem>(`/garage/catalog/${id}`, { ...tenant(a), method: 'PATCH', body: patch }),
    deleteItem: (a: GarageAuth, id: string) => marketplaceFetch<void>(`/garage/catalog/${id}`, { ...tenant(a), method: 'DELETE' }),
    reviews: (a: GarageAuth) => marketplaceFetch<Review[]>('/garage/reviews', { ...tenant(a), query: { limit: 3 } }),
    reply: (a: GarageAuth, id: string, body: string) =>
        marketplaceFetch<Review>(`/garage/reviews/${id}/reply`, { ...tenant(a), method: 'POST', body: { body } }),
};
