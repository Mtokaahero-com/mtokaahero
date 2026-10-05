import type { CatalogItem, CatalogItemInput, CatalogPage, DispatchRadar, GarageDashboard, Review } from '@/lib/api/garage';
import type { ItemType } from '@/lib/api/marketplace';

const KES = 'KES';
const money = (amount: number) => ({ amount, currency: KES });

interface GarageState {
    accepting: boolean;
    catalog: CatalogItem[];
    reviews: Review[];
    acceptedCalls: Set<string>;
}

const BASE_ITEMS: CatalogItem[] = [
    {
        id: 'cat_bosch_agm',
        type: 'PART',
        title: 'Bosch AGM 70Ah Car Battery',
        code: 'SKU: BAT-BOS-70AGM • OEM 0 092 S5A 080',
        image: '/images/market/bosch-agm-studio.jpg',
        category: 'Electrical & Starting',
        unitPrice: money(15600),
        stock: { kind: 'UNITS', quantity: 18, label: '18 In Stock' },
        rating: 4.9,
        reviewCount: 52,
        status: 'ACTIVE',
    },
    {
        id: 'cat_jumpstart',
        type: 'RESCUE_PACKAGE',
        title: 'Emergency Mobile Diagnostic & Jumpstart',
        code: 'PKG: RESC-JUMP-01 • 15km Radius Guarantee',
        image: '/images/market/rescue-van-thumb.jpg',
        category: 'Roadside Rescue',
        unitPrice: money(4550),
        stock: { kind: 'INSTANT', quantity: null, label: 'Instant Dispatch' },
        rating: 5.0,
        reviewCount: 114,
        status: 'ACTIVE',
    },
    {
        id: 'cat_brembo',
        type: 'SERVICE',
        title: 'Brembo Ceramic Brake Pad Replacement',
        code: 'SRV: BRK-BREM-02 • Includes Disc Resurfacing',
        image: '/images/market/brembo-caliper.jpg',
        category: 'Braking System',
        unitPrice: money(11050),
        stock: { kind: 'BAYS', quantity: 4, label: '4 Bays Free' },
        rating: 4.8,
        reviewCount: 86,
        status: 'ACTIVE',
    },
    {
        id: 'cat_castrol',
        type: 'PART',
        title: 'Castrol Edge 5W-30 Full Synthetic Oil (4L)',
        code: 'SKU: OIL-CAS-5W30 • API SP / ILSAC GF-6',
        image: '/images/market/castrol-edge.jpg',
        category: 'Fluids & Lubricants',
        unitPrice: money(6240),
        stock: { kind: 'UNITS', quantity: 32, label: '32 In Stock' },
        rating: 4.7,
        reviewCount: 98,
        status: 'ACTIVE',
    },
    {
        id: 'cat_puncture',
        type: 'RESCUE_PACKAGE',
        title: 'Emergency Tyre Puncture Seal & Inflation',
        code: 'PKG: RESC-TYR-04 • Heavy Duty Vulcanizing Plug',
        image: '/images/market/tyre-compressor-kit.jpg',
        category: 'Roadside Rescue',
        unitPrice: money(3250),
        stock: { kind: 'INSTANT', quantity: null, label: 'Instant Dispatch' },
        rating: 4.9,
        reviewCount: 67,
        status: 'ACTIVE',
    },
];

/** Pads the hand-written rows out to the catalogue size shown in the design (19 parts, 6 services, 3 packages). */
function seedCatalog(): CatalogItem[] {
    const target: Record<ItemType, number> = { PART: 19, SERVICE: 6, RESCUE_PACKAGE: 3 };
    const out = [...BASE_ITEMS];
    for (const type of Object.keys(target) as ItemType[]) {
        const pool = BASE_ITEMS.filter((i) => i.type === type);
        let n = out.filter((i) => i.type === type).length;
        while (n < target[type]) {
            const src = pool[n % pool.length];
            out.push({ ...src, id: `${src.id}_${n}` });
            n++;
        }
    }
    return out;
}

const REVIEWS: Review[] = [
    {
        id: 'rev_1',
        author: 'Kelvin Mwangi',
        vehicle: '2021 Subaru Outback 2.5i',
        rating: 5,
        comment: 'Mechanic David arrived in 15 minutes and sorted my alternator issue on the spot! Cleanest roadside experience I have had in years.',
        createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
        verified: true,
        reply: null,
    },
    {
        id: 'rev_2',
        author: 'Sarah Njeri',
        vehicle: '2019 Toyota Hilux D4D',
        rating: 5,
        comment: 'Replaced my ceramic brake pads in bay 2. Everything was transparently quoted upfront on the app with zero hidden labor charges.',
        createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
        verified: true,
        reply: null,
    },
    {
        id: 'rev_3',
        author: 'Ahmed Omar',
        vehicle: '2022 Mercedes Benz C200',
        rating: 4,
        comment: 'Purchased genuine Castrol synthetic oil. Fast delivery to my location within Westlands, authenticated with QR code seal.',
        createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
        verified: true,
        reply: null,
    },
];

const states: Map<string, GarageState> = ((globalThis as Record<string, unknown>).__mtokaaGarage ??= new Map()) as Map<string, GarageState>;

function state(orgId: string): GarageState {
    let s = states.get(orgId);
    if (!s) {
        s = { accepting: true, catalog: seedCatalog(), reviews: REVIEWS.map((r) => ({ ...r })), acceptedCalls: new Set() };
        states.set(orgId, s);
    }
    return s;
}

export function dashboard(orgId: string): GarageDashboard {
    const s = state(orgId);
    return {
        shop: {
            id: orgId,
            name: 'Apex Auto Hub & Mobile Rescue',
            tenantCode: `#GK-${(orgId.replace(/\D/g, '') + '4092').slice(0, 4)}`,
            tier: 'Elite Partner Tier',
            rating: 4.92,
            reviewCount: 428,
            location: 'Nairobi West Bypass, Node 4',
            accepting: s.accepting,
            autoDispatch: s.accepting,
            utilizationPct: 85,
            mechanicsDispatched: 3,
        },
        kpis: {
            revenue: { total: money(3230500), previous: money(2727400), changePct: 18.4, sparkline: [4, 8, 6, 14, 10, 18, 16, 22] },
            rescues: { completed: 84, avgMinutes: 16.2, onTimePct: 98 },
            parts: { unitsFitted: 312, inStockPct: 94.2, topSeller: { name: 'Bosch AGM', dispatched: 41 } },
            csat: { pct: 98.6, rating: 4.9, ratings: 428, escalations: 0 },
        },
        revenue: {
            period: 'Last 30 Days',
            buckets: [
                { label: 'May 01 - 03', parts: 45, labor: 28, rescue: 28 },
                { label: 'May 04 - 06', parts: 60, labor: 33, rescue: 33 },
                { label: 'May 07 - 09', parts: 70, labor: 38, rescue: 33 },
                { label: 'May 10 - 12', parts: 55, labor: 28, rescue: 33 },
                { label: 'May 13 - 15', parts: 80, labor: 38, rescue: 33 },
                { label: 'May 16 - 18', parts: 65, labor: 33, rescue: 33 },
                { label: 'May 19 - 21', parts: 90, labor: 38, rescue: 33 },
                { label: 'May 22 - 24', parts: 75, labor: 33, rescue: 33 },
                { label: 'May 25 - 27', parts: 100, labor: 38, rescue: 33 },
                { label: 'Current (Today)', parts: 110, labor: 40, rescue: 26 },
            ],
            nextPayout: 'Friday at 00:00 EAT',
            ledgerUrl: '/api/mock/v1/garage/ledger.csv',
        },
        fleet: { onRoad: 3, total: 4, note: 'Van #2 Ready in Yard' },
    };
}

export function setAvailability(orgId: string, accepting: boolean) {
    state(orgId).accepting = accepting;
    return dashboard(orgId).shop;
}

export function radar(orgId: string): DispatchRadar {
    const s = state(orgId);
    const now = Date.now();
    const calls = [
        {
            id: 'call_battery',
            title: 'Dead Battery & No Crank',
            icon: 'battery_alert',
            severity: 'URGENT' as const,
            location: 'Highway A104, KM 18 Outer Ring Road',
            distanceKm: 4.2,
            vehicle: 'Toyota Prado TX',
            estimate: money(5850),
            paymentLabel: 'Cashless M-PESA',
            expiresAt: new Date(now + 102_000).toISOString(),
        },
        {
            id: 'call_tyres',
            title: 'Dual Tyre Blowout',
            icon: 'tire_repair',
            severity: 'STANDARD' as const,
            location: 'Southern Bypass Exit 3',
            distanceKm: 6.8,
            vehicle: 'Isuzu D-Max Double Cabin',
            estimate: money(8450),
            paymentLabel: 'Mobile Hoist',
            expiresAt: new Date(now + 195_000).toISOString(),
        },
    ].filter((c) => !s.acceptedCalls.has(c.id));
    return { radiusKm: 15, urgentCount: s.accepting ? calls.length : 0, calls: s.accepting ? calls : [] };
}

export function acceptCall(orgId: string, callId: string) {
    state(orgId).acceptedCalls.add(callId);
    return { trackingToken: 'demo' };
}

export function catalog(orgId: string, q: URLSearchParams): CatalogPage {
    const s = state(orgId);
    const type = q.get('type') as ItemType | null;
    const page = Math.max(1, Number(q.get('page') ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(q.get('pageSize') ?? 5)));
    const filtered = type ? s.catalog.filter((i) => i.type === type) : s.catalog;
    const count = (t: ItemType) => s.catalog.filter((i) => i.type === t).length;
    return {
        items: filtered.slice((page - 1) * pageSize, page * pageSize),
        counts: { ALL: s.catalog.length, PART: count('PART'), SERVICE: count('SERVICE'), RESCUE_PACKAGE: count('RESCUE_PACKAGE') },
        page,
        pageSize,
        total: filtered.length,
    };
}

const IMAGE_FOR: Record<ItemType, string> = {
    PART: '/images/market/bosch-agm-studio.jpg',
    SERVICE: '/images/market/brembo-caliper.jpg',
    RESCUE_PACKAGE: '/images/market/rescue-van-thumb.jpg',
};

export function createItem(orgId: string, input: CatalogItemInput): CatalogItem {
    const qty = Number.parseInt(input.stock, 10);
    const item: CatalogItem = {
        id: `cat_${crypto.randomUUID().slice(0, 8)}`,
        type: input.type,
        title: input.title.trim(),
        code: `${input.type === 'PART' ? 'SKU' : input.type === 'SERVICE' ? 'SRV' : 'PKG'}: ${input.sku.trim().toUpperCase()}`,
        image: IMAGE_FOR[input.type],
        category: input.category,
        unitPrice: money(input.unitPrice),
        stock:
            input.type === 'RESCUE_PACKAGE'
                ? { kind: 'INSTANT', quantity: null, label: 'Instant Dispatch' }
                : input.type === 'SERVICE'
                  ? { kind: 'BAYS', quantity: Number.isFinite(qty) ? qty : null, label: Number.isFinite(qty) ? `${qty} Bays Free` : 'Bays Open' }
                  : { kind: 'UNITS', quantity: Number.isFinite(qty) ? qty : null, label: Number.isFinite(qty) ? `${qty} In Stock` : 'Unlimited' },
        rating: 0,
        reviewCount: 0,
        status: 'ACTIVE',
    };
    state(orgId).catalog.unshift(item);
    return item;
}

export function updateItem(orgId: string, id: string, patch: { status?: CatalogItem['status']; restock?: number }): CatalogItem | null {
    const item = state(orgId).catalog.find((i) => i.id === id);
    if (!item) return null;
    if (patch.status) item.status = patch.status;
    if (patch.restock && item.stock.kind !== 'INSTANT') {
        const qty = (item.stock.quantity ?? 0) + patch.restock;
        item.stock = { ...item.stock, quantity: qty, label: item.stock.kind === 'UNITS' ? `${qty} In Stock` : `${qty} Bays Free` };
    }
    return item;
}

export function deleteItem(orgId: string, id: string): boolean {
    const s = state(orgId);
    const before = s.catalog.length;
    s.catalog = s.catalog.filter((i) => i.id !== id);
    return s.catalog.length < before;
}

export function reviews(orgId: string): Review[] {
    return state(orgId).reviews;
}

export function reply(orgId: string, id: string, body: string): Review | null {
    const review = state(orgId).reviews.find((r) => r.id === id);
    if (!review) return null;
    review.reply = body;
    return review;
}
