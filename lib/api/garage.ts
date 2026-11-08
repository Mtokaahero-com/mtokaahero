import type { Money } from '@/lib/format';
import { API_URL, apiFetch } from './client';
import type { ItemType } from './marketplace';
import { parseProblem } from './problem';

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

export interface CatalogFitment {
    makeId: string;
    modelId: string | null;
    yearFrom: number | null;
    yearTo: number | null;
}

/** mtokaa-api `GET /organization/catalog` item. */
export interface CatalogItem {
    id: string;
    type: ItemType;
    title: string;
    description: string | null;
    sku: string;
    category: { id: string; label: string };
    unitPrice: Money;
    /** Parts carry units (quantity null = not tracked); services are by booking; rescue packages dispatch on demand. */
    stock: { kind: 'UNITS' | 'BOOKING' | 'INSTANT'; quantity: number | null; label: string };
    fitment: (CatalogFitment & { label: string }) | null;
    /** Always 0 until reviews exist. */
    rating: number;
    reviewCount: number;
    status: 'ACTIVE' | 'PAUSED';
    createdAt: string;
    updatedAt: string;
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
    description?: string | null;
    sku: string;
    categoryId: string;
    /** Whole KES. */
    unitPrice: number;
    /** Parts only; null when stock is not tracked. */
    stockQuantity?: number | null;
    fitment?: (Partial<CatalogFitment> & { makeId: string }) | null;
}

export interface CatalogItemPatch {
    status?: CatalogItem['status'];
    /** Units to add to a part. */
    restock?: number;
    unitPrice?: number;
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
    dashboard: (a: GarageAuth) => apiFetch<GarageDashboard>('/garage/dashboard', tenant(a)),
    ledgerCsv: async (a: GarageAuth): Promise<string> => {
        const res = await fetch(`${API_URL}/garage/ledger.csv`, {
            headers: {
                Accept: 'text/csv',
                Authorization: `Bearer ${a.token}`,
                'X-Organization-Id': a.organizationId,
            },
            cache: 'no-store',
        });
        if (!res.ok) throw await parseProblem(res);
        return res.text();
    },
    radar: (a: GarageAuth) => apiFetch<DispatchRadar>('/garage/dispatch-radar', tenant(a)),
    acceptCall: (a: GarageAuth, id: string) =>
        apiFetch<{ trackingToken: string }>(`/garage/dispatch-radar/${id}/accept`, { ...tenant(a), method: 'POST' }),
    reviews: (a: GarageAuth) => apiFetch<Review[]>('/garage/reviews', { ...tenant(a), query: { limit: 3 } }),
    reply: (a: GarageAuth, id: string, body: string) =>
        apiFetch<Review>(`/garage/reviews/${id}/reply`, { ...tenant(a), method: 'POST', body: { body } }),

    // mtokaa-api catalog.
    catalog: (a: GarageAuth, query: { type?: ItemType; page?: number; pageSize?: number }) =>
        apiFetch<CatalogPage>('/organization/catalog', { ...tenant(a), query }),
    createItem: (a: GarageAuth, input: CatalogItemInput) =>
        apiFetch<CatalogItem>('/organization/catalog', { ...tenant(a), method: 'POST', body: input }),
    updateItem: (a: GarageAuth, id: string, patch: CatalogItemPatch) =>
        apiFetch<CatalogItem>(`/organization/catalog/${id}`, { ...tenant(a), method: 'PATCH', body: patch }),
    /** Archives the item; it leaves the catalog and the marketplace. */
    deleteItem: (a: GarageAuth, id: string) =>
        apiFetch<void>(`/organization/catalog/${id}`, { ...tenant(a), method: 'DELETE' }),
};
