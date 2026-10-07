import type {
    CheckoutQuote,
    GeoPoint,
    MapTile,
    QuoteLine,
    RescueRequestCreated,
    RescueRequestInput,
    RescueStatus,
    RescueTracking,
    ResolvedLocation,
    ServiceMode,
} from '@/lib/api/rescue';
import { offers } from './marketplace';

const KES = 'KES';
const money = (amount: number) => ({ amount, currency: KES });

const WESTLANDS: MapTile = {
    imageUrl: '/images/market/map-westlands.png',
    bounds: { north: -1.234, south: -1.294, west: 36.774, east: 36.834 },
};

const NAIROBI: MapTile = {
    imageUrl: '/images/market/map-nairobi.png',
    bounds: { north: -1.24, south: -1.31, west: 36.78, east: 36.85 },
};

export function reverseGeocode(point: GeoPoint): ResolvedLocation {
    return {
        ...point,
        label: 'Waiyaki Way, Westlands',
        detail: 'Near TotalEnergies Service Station, Outbound Lane',
        accuracyM: 3,
        map: {
            imageUrl: WESTLANDS.imageUrl,
            bounds: {
                north: point.lat + 0.03,
                south: point.lat - 0.03,
                west: point.lng - 0.03,
                east: point.lng + 0.03,
            },
        },
    };
}

const DEFAULT_LINES: QuoteLine[] = [
    {
        id: 'ln_battery',
        kind: 'PART',
        title: 'Bosch S4 70Ah Battery',
        image: '/images/market/bosch-s4-battery.jpg',
        code: 'OEM: 0 092 S40 080',
        note: { label: '18 Mos Warranty', tone: 'primary' },
        description: 'Direct fit for 2019 Toyota Prado TX',
        quantity: 1,
        amount: money(14300),
    },
    {
        id: 'ln_install',
        kind: 'SERVICE',
        title: 'Mobile Rescue & Install',
        icon: 'handyman',
        code: 'On-Site Service',
        note: { label: 'Certified Mechanic', tone: 'amber' },
        description: 'Includes alternator diagnostic & terminal clean',
        quantity: 1,
        amount: money(3900),
    },
];

function linesFor(offerIds: string[]): { lines: QuoteLine[]; providerId: string } {
    const picked = offerIds
        .map((id) => offers.find((o) => id === o.id || id.startsWith(`${o.id}_`)))
        .filter((o): o is (typeof offers)[number] => Boolean(o));
    if (!picked.length) return { lines: DEFAULT_LINES, providerId: 'prv_speedypro' };
    const providerId = picked[0].provider.id;
    const lines = picked
        .filter((o) => o.provider.id === providerId)
        .map<QuoteLine>((o) =>
            o.type === 'PART'
                ? {
                      id: `ln_${o.id}`,
                      offerId: o.id,
                      kind: 'PART',
                      title: o.title,
                      image: o.image.url,
                      code: o.spec.label,
                      note: { label: o.spec.note.label, tone: 'primary' },
                      description: o.description,
                      quantity: 1,
                      amount: money(o.price.amount),
                  }
                : {
                      id: `ln_${o.id}`,
                      offerId: o.id,
                      kind: 'SERVICE',
                      title: o.title,
                      icon: o.type === 'RESCUE_PACKAGE' ? 'handyman' : 'home_repair_service',
                      code: o.fulfilment === 'IN_SHOP' ? 'Workshop Bay' : 'On-Site Service',
                      note: { label: 'Certified Mechanic', tone: 'amber' },
                      description: o.description,
                      quantity: 1,
                      amount: money(o.price.amount),
                  },
        );
    return { lines, providerId };
}

const PROVIDER_CARD: Record<string, CheckoutQuote['provider']> = {
    prv_speedypro: {
        id: 'prv_speedypro',
        name: 'SpeedyPro Mobile Rescue',
        image: '/images/market/workshop-bay.jpg',
        rating: 4.94,
        jobsCompleted: 218,
        distanceKm: 1.8,
        bayLabel: 'SpeedyPro Workshop Bay 3',
    },
};

export function buildQuote(input: { offerIds?: string[]; mode?: ServiceMode }): CheckoutQuote {
    const mode = input.mode ?? 'ROADSIDE';
    const { lines, providerId } = linesFor(input.offerIds ?? []);
    const offer = offers.find((o) => o.provider.id === providerId);
    const provider = PROVIDER_CARD[providerId] ?? {
        id: providerId,
        name: offer?.provider.name ?? 'Partner Garage',
        image: '/images/market/workshop-bay.jpg',
        rating: offer?.provider.rating ?? 4.8,
        jobsCompleted: offer?.provider.reviewCount ?? 100,
        distanceKm: 2.4,
        bayLabel: `${offer?.provider.name ?? 'Partner'} Bay 1`,
    };
    const travel = { id: 'TRAVEL' as const, label: 'Rapid Rescue Mobile Travel Fee', shortLabel: 'Rapid Rescue Travel Fee (Westlands Sector)', description: 'Priority corridor emergency bike dispatch', amount: money(650) };
    const escrow = { id: 'ESCROW' as const, label: 'MtokaaHero Escrow & Guarantee', shortLabel: 'MtokaaHero Escrow Protection', description: 'Held until you sign off with your release code', amount: money(325) };
    const fees = mode === 'ROADSIDE' ? [travel, escrow] : [escrow];
    const subtotal = lines.reduce((s, l) => s + l.amount.amount * l.quantity, 0);
    const total = subtotal + fees.reduce((s, f) => s + f.amount.amount, 0);
    return {
        id: `qt_${Date.now().toString(36)}`,
        mode,
        provider,
        lines,
        fees,
        subtotal: money(subtotal),
        total: money(total),
        inShopSavings: money(4550),
        responseMinutes: 18,
        avgDispatchMinutes: 14,
        etaTargetMinutes: 15,
        hotline: { display: '0800 720 000 (Toll Free)', tel: '0800720000' },
    };
}

interface StoredRequest {
    created: RescueRequestCreated;
    input: RescueRequestInput;
    createdAt: number;
    total: number;
    title: string;
    description: string;
}

// Survives hot reloads in dev; a real backend replaces this.
const store: Map<string, StoredRequest> = ((globalThis as Record<string, unknown>).__mtokaaRescueStore ??= new Map()) as Map<
    string,
    StoredRequest
>;

const randomToken = () => `trk_${crypto.randomUUID().replace(/-/g, '')}`;

export function createRequest(input: RescueRequestInput): RescueRequestCreated {
    const quote = buildQuote({ offerIds: input.offerIds, mode: input.mode });
    const created: RescueRequestCreated = {
        id: `rr_${crypto.randomUUID()}`,
        code: `#MTH-${Math.floor(10000 + Math.random() * 89999)}`,
        trackingToken: randomToken(),
        status: 'RECEIVED',
    };
    store.set(created.trackingToken, {
        created,
        input,
        createdAt: Date.now(),
        total: quote.total.amount,
        title: quote.lines[0]?.title ?? 'Mobile Jumpstart & Full Diagnostic',
        description: quote.lines.slice(1).map((l) => l.title).join(' + ') || 'Includes 12V Alternator Check & Battery Test',
    });
    return created;
}

const DEMO: StoredRequest = {
    created: { id: 'rr_demo', code: '#MTH-98421', trackingToken: 'demo', status: 'EN_ROUTE' },
    input: {
        quoteId: 'qt_demo',
        offerIds: ['off_jumpstart'],
        mode: 'ROADSIDE',
        contact: { fullName: 'David Mwangi', phone: '712345678', email: 'david.mwangi@motorist.co.ke' },
        vehicle: { make: 'Toyota', model: 'Prado TX', year: 2019, plate: 'KBX 319A' },
        location: { lat: -1.2918, lng: 36.8311, label: 'Waiyaki Way' },
        notes: '',
        paymentMethod: 'MPESA',
    },
    createdAt: Date.now() - 60_000,
    total: 19175,
    title: 'Mobile Jumpstart & Full Diagnostic',
    description: 'Includes 12V Alternator Check & Battery Test',
};

const TRAVEL_MINUTES = 11;
const hhmm = (ms: number) => new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });

export function tracking(token: string): RescueTracking | null {
    const req = token === 'demo' ? { ...DEMO, createdAt: DEMO.createdAt } : store.get(token);
    if (!req) return null;

    // Simulated dispatch: accepted after 20 s, then the van closes in over TRAVEL_MINUTES.
    const elapsedMin = (Date.now() - req.createdAt) / 60_000;
    const accepted = elapsedMin > 1 / 3 || token === 'demo';
    const travelled = accepted ? Math.min(1, (elapsedMin - (token === 'demo' ? 0 : 1 / 3)) / TRAVEL_MINUTES) : 0;
    const status: RescueStatus = !accepted ? 'RECEIVED' : travelled >= 1 ? 'ON_SITE' : 'EN_ROUTE';
    const remaining = Math.max(1, Math.ceil(TRAVEL_MINUTES * (1 - travelled)));

    const start = { lat: -1.2575, lng: 36.7996 };
    const motorist = { lat: -1.2918, lng: 36.8311 };
    const technician = accepted
        ? { lat: start.lat + (motorist.lat - start.lat) * travelled, lng: start.lng + (motorist.lng - start.lng) * travelled }
        : null;

    const v = req.input.vehicle;
    return {
        id: req.created.id,
        code: req.created.code,
        trackingToken: req.created.trackingToken,
        status,
        createdAt: new Date(req.createdAt).toISOString(),
        eta: status === 'EN_ROUTE' ? { minutes: remaining, distanceKm: Math.round(2.8 * (1 - travelled) * 10) / 10, via: 'Waiyaki Way' } : null,
        timeline: [
            { status: 'RECEIVED', label: 'Received', at: new Date(req.createdAt).toISOString(), caption: hhmm(req.createdAt) },
            { status: 'EN_ROUTE', label: 'En Route', at: accepted ? new Date(req.createdAt).toISOString() : null, caption: status === 'EN_ROUTE' ? `ETA ${remaining}m` : accepted ? 'Arrived' : 'Matching' },
            { status: 'ON_SITE', label: 'On-Site', at: status === 'ON_SITE' ? new Date().toISOString() : null, caption: status === 'ON_SITE' ? 'Diagnosing' : 'Pending' },
            { status: 'COMPLETED', label: 'Done', at: null, caption: 'Escrow' },
        ],
        technician: accepted
            ? {
                  name: 'David Kamau',
                  title: 'Master Tech',
                  provider: 'SpeedyPro Mobile Rescue',
                  photo: '/images/market/technician-david.jpg',
                  rating: 4.9,
                  reviewCount: 218,
                  vehiclePlate: 'KCP 184F',
                  level: 'Level 4 Specialist',
                  phone: '+254700000000',
                  whatsapp: '254700000000',
                  unitLabel: 'Van #4',
              }
            : null,
        releaseCode: '4921',
        vehicle: {
            label: `${v.year} ${v.make} ${v.model}`,
            shortLabel: `My ${v.model}`,
            engine: token === 'demo' ? 'Engine: 2.8L Turbo Diesel (1GD-FTV)' : '',
            plate: v.plate.toUpperCase(),
        },
        order: { title: req.title, description: req.description, total: money(req.total), paymentMethod: req.input.paymentMethod },
        map: { ...NAIROBI, technician, motorist },
        emergencyNumber: '999',
    };
}
