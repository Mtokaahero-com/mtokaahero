import type {
    Category,
    MarketplaceFilters,
    MarketplaceSummary,
    Offer,
    OfferPage,
    OfferSort,
} from '@/lib/api/marketplace';

// Mock data for the in-app mock API (app/api/mock/v1). Content mirrors the Stitch marketplace screens;
// prices are converted to KES (roadmap decision P8) at ~130 KES/USD.

const KES = 'KES';

export const categories: (Category & { mobileIcon: string })[] = [
    { id: 'rescue', label: 'Emergency Mobile Mechanics (Rescue)', shortLabel: 'Emergency Jumpstart', icon: 'emergency', mobileIcon: 'flash_on', tone: 'rescue', rescue: true },
    { id: 'garages', label: 'Certified Garages', shortLabel: 'Garages', icon: 'warehouse', mobileIcon: 'warehouse', tone: 'primary' },
    { id: 'batteries', label: 'Batteries & Alternators', shortLabel: 'Batteries', icon: 'bolt', mobileIcon: 'battery_charging_full', tone: 'amber' },
    { id: 'brakes', label: 'Brakes & Suspension', shortLabel: 'Brakes', icon: 'disc_full', mobileIcon: 'disc_full', tone: 'neutral' },
    { id: 'tyres', label: 'Tyres & Alignment', shortLabel: 'Tyres & Flat', icon: 'tire_repair', mobileIcon: 'trip_origin', tone: 'neutral' },
    { id: 'engine', label: 'Engine Service', shortLabel: 'Oil & Service', icon: 'oil_barrel', mobileIcon: 'water_drop', tone: 'primary' },
    { id: 'diagnostics', label: 'Diagnostics', shortLabel: 'Diagnostics', icon: 'car_crash', mobileIcon: 'car_crash', tone: 'primary' },
];

export const providers = [
    { id: 'prv_speedypro', name: 'SpeedyPro Mobile Rescue', verified: true, rating: 4.9, reviewCount: 184 },
    { id: 'prv_apex', name: 'Apex Motor Works Garage', verified: true, rating: 4.8, reviewCount: 320 },
    { id: 'prv_kijani', name: 'Kijani Auto Tech', verified: true, rating: 4.7, reviewCount: 95 },
    { id: 'prv_autospares', name: 'AutoSpares Express Garage', verified: true, rating: 4.9, reviewCount: 412 },
    { id: 'prv_ranger', name: 'Roadside Ranger Mechanics', verified: true, rating: 4.8, reviewCount: 76 },
    { id: 'prv_premier', name: 'Premier German Auto Care', verified: true, rating: 5.0, reviewCount: 142 },
    { id: 'prv_directparts', name: 'Direct Auto Parts Hub', verified: true, rating: 4.9, reviewCount: 412 },
];

const p = (id: string) => providers.find((x) => x.id === id)!;

export const offers: Offer[] = [
    {
        id: 'off_jumpstart',
        type: 'RESCUE_PACKAGE',
        fulfilment: 'MOBILE',
        categoryId: 'rescue',
        title: 'Emergency Mobile Battery Jumpstart & Diagnostic',
        description:
            'On-Demand Mechanic comes directly to your coordinates. Includes heavy-duty booster, alternator charge test & battery health certificate.',
        image: {
            url: '/images/market/rescue-van.jpg',
            alt: 'Emergency mobile auto rescue service van parked on a roadside with battery diagnostics equipment.',
        },
        provider: p('prv_speedypro'),
        modeLabel: { label: 'Mobile Rescue Unit', tone: 'rescue' },
        highlight: { label: 'Avg 18 mins dispatch', icon: 'timer', tone: 'amber', style: 'dark' },
        spec: { icon: 'check_circle', label: 'RAV4 All Trims Matched', note: { label: 'Priority Dispatched', tone: 'rescue' } },
        price: { amount: 4550, currency: KES, label: 'Standard Callout Fee' },
        priceNote: { label: 'Flat Rate Guaranteed', tone: 'amber' },
        action: { label: 'Request Rescue', icon: 'bolt' },
        distanceLabel: { label: '1.4 km away • Patrol Van #4', icon: 'location_on', tone: 'primary' },
        fitsVehicle: true,
        etaMinutes: 18,
    },
    {
        id: 'off_brembo',
        type: 'SERVICE',
        fulfilment: 'IN_SHOP',
        categoryId: 'brakes',
        title: 'Brembo Ceramic Front Brake Pads + Free In-Shop Fitment',
        description: 'Genuine Brembo OE low-dust compound. Includes brake rotor resurfacing check and fluid top-up in private bay.',
        image: {
            url: '/images/market/brake-pads-workbench.jpg',
            alt: 'Ceramic brake pads on a clean steel workbench beside precision calipers.',
        },
        provider: p('prv_apex'),
        modeLabel: { label: 'In-Shop Garage Bay', icon: 'storefront', tone: 'primary' },
        highlight: { label: 'Hoist 3: Slot Open 2:30 PM', tone: 'primary', style: 'light' },
        spec: { icon: 'verified', label: 'OEM Fit: P83145N', note: { label: 'Warranty: 24,000 km', tone: 'primary' } },
        price: { amount: 11050, currency: KES, label: 'Parts + Installation' },
        priceNote: { label: 'Save KES 2,860 bundle', style: 'chip' },
        action: { label: 'Book Service Bay', icon: 'event_available' },
        nextSlot: 'Today 2:30 PM',
        distanceLabel: { label: 'Includes Caliper Degrease', icon: 'build', tone: 'muted' },
        fitsVehicle: true,
    },
    {
        id: 'off_oilchange',
        type: 'SERVICE',
        fulfilment: 'MOBILE_OR_SHOP',
        categoryId: 'engine',
        title: 'Full Synthetic Oil Change & 30-Point Safety Inspection',
        description:
            'Castrol Edge 0W-20 (4.5L), genuine Toyota filter replacement, tire pressure calibration, and electronic battery check.',
        image: {
            url: '/images/market/oil-change.jpg',
            alt: 'Certified mechanic pouring synthetic motor oil into a car engine.',
        },
        provider: p('prv_kijani'),
        modeLabel: { label: 'Mobile Van OR Workshop', icon: 'sync_alt', tone: 'amber' },
        highlight: { label: '30-Point Diagnostic Report', icon: 'fact_check', tone: 'primary', style: 'dark' },
        spec: { icon: 'oil_barrel', label: '0W-20 SN Plus Standard', note: { label: 'Includes Filter', tone: 'muted' } },
        price: { amount: 8450, currency: KES, label: 'Complete Package' },
        priceNote: { label: 'Service Duration: 40m', tone: 'amber' },
        action: { label: 'Book Service', icon: 'calendar_month' },
        distanceLabel: { label: 'Van or Kilimani bay', icon: 'sync_alt', tone: 'muted' },
        fitsVehicle: true,
    },
    {
        id: 'off_alternator',
        type: 'PART',
        fulfilment: 'PICKUP',
        categoryId: 'batteries',
        title: 'Heavy Duty All-Weather Alternator (Denso 12V 130A)',
        description:
            'Factory original high-amperage output unit. Sealed bearings against tropical dust & heat. Includes manufacturer warranty.',
        image: {
            url: '/images/market/denso-alternator.jpg',
            alt: 'Denso automotive alternator on a clean industrial workbench.',
        },
        provider: p('prv_autospares'),
        modeLabel: { label: 'Genuine Physical Part', icon: 'inventory_2', tone: 'muted' },
        highlight: { label: '7 units left in shop', tone: 'amber', style: 'light' },
        spec: { icon: 'qr_code_2', label: 'DENSO #104210-9120', note: { label: 'Same-Day Pickup', tone: 'muted' } },
        price: { amount: 18200, currency: KES, label: 'Component Price' },
        priceNote: { label: 'Optional Bay Fitting +KES 2,600', tone: 'primary' },
        action: { label: 'Details', icon: 'visibility' },
        chips: ['130A Output', '12 Mo Warranty', 'OEM Sealed'],
        distanceLabel: { label: '7 in stock locally', icon: 'inventory_2', tone: 'muted' },
        fitsVehicle: true,
    },
    {
        id: 'off_flattyre',
        type: 'RESCUE_PACKAGE',
        fulfilment: 'MOBILE',
        categoryId: 'tyres',
        title: 'Roadside Flat Tyre Repair & Nitrogen Refill',
        description:
            'Puncture plugging, heavy-duty vulcanization patch, spare wheel changeover, and 4-wheel nitrogen pressure balancing.',
        image: {
            url: '/images/market/flat-tyre-roadside.jpg',
            alt: 'Roadside mobile mechanic repairing a punctured SUV tyre on the highway shoulder.',
        },
        provider: p('prv_ranger'),
        modeLabel: { label: 'Mobile Rescue Hero', tone: 'rescue' },
        highlight: { label: 'Dispatched within 12 mins', icon: 'near_me', tone: 'rescue', style: 'dark' },
        spec: { icon: 'tire_repair', label: 'Fits 16" - 21" Rims', note: { label: 'Live GPS Tracker', tone: 'rescue' } },
        price: { amount: 3640, currency: KES, label: 'Emergency On-Site Price' },
        priceNote: { label: 'No Hidden Surcharges', tone: 'amber' },
        action: { label: 'Dispatch Now', icon: 'crisis_alert' },
        distanceLabel: { label: '2 Units Nearby CBD', icon: 'navigation', tone: 'amber' },
        fitsVehicle: true,
        etaMinutes: 12,
    },
    {
        id: 'off_diagnostics',
        type: 'SERVICE',
        fulfilment: 'IN_SHOP',
        categoryId: 'diagnostics',
        title: 'Complete Computer Diagnostics & OBD2 Scan',
        description:
            'Full ECU parameter readout, gearbox adaptation testing, ABS/SRS sensor clearance, and PDF live health report printout.',
        image: {
            url: '/images/market/diagnostics-tablet.jpg',
            alt: 'Technician holding a diagnostic scanning tablet connected to a car.',
        },
        provider: p('prv_premier'),
        modeLabel: { label: 'Specialist Bay Service', icon: 'home_repair_service', tone: 'primary' },
        highlight: { label: '5.0 Flawless Master Shop', icon: 'star', tone: 'amber', style: 'light' },
        spec: { icon: 'memory', label: 'All CAN-Bus Protocols', note: { label: 'Dealer-Level Scopes', tone: 'primary' } },
        price: { amount: 5850, currency: KES, label: 'Diagnostics Fee' },
        priceNote: { label: 'Waived if repairs booked', tone: 'muted' },
        action: { label: 'Book Bay Slot', icon: 'calendar_today' },
        nextSlot: 'Tomorrow 9:00 AM',
        distanceLabel: { label: 'Westlands bay', icon: 'location_on', tone: 'muted' },
        fitsVehicle: true,
    },
    {
        id: 'off_bosch_agm',
        type: 'PART',
        fulfilment: 'PICKUP',
        categoryId: 'batteries',
        title: 'Bosch AGM 70Ah Car Battery (Direct Fit)',
        description: 'Start-stop ready absorbent glass mat battery with sealed terminals and core exchange.',
        image: {
            url: '/images/market/bosch-s5-showroom.jpg',
            alt: 'Bosch S5 AGM car battery on a workshop showroom pedestal.',
        },
        provider: p('prv_directparts'),
        modeLabel: { label: 'Same-Day Van Dispatch', icon: 'local_shipping', tone: 'muted' },
        highlight: { label: 'OEM Fit: S5-A08', tone: 'primary', style: 'light' },
        spec: { icon: 'qr_code_2', label: 'BOSCH S5 A08', note: { label: '760 CCA', tone: 'muted' } },
        price: { amount: 15600, currency: KES, label: 'Component Price' },
        priceNote: { label: '36 Mo Warranty', tone: 'primary' },
        action: { label: 'Order Van', icon: 'add_shopping_cart' },
        chips: ['760 CCA', '36 Mo Warranty', 'Free Old Core Pickup'],
        distanceLabel: { label: '9 in stock locally', icon: 'inventory_2', tone: 'muted' },
        fitsVehicle: true,
    },
];

export const filters: MarketplaceFilters = {
    makes: [
        {
            id: 'toyota',
            name: 'Toyota',
            models: [
                { id: 'rav4', name: 'RAV4 (XA50 / 2.5L)', years: [2024, 2023, 2022, 2021, 2020, 2018] },
                { id: 'prado', name: 'Land Cruiser Prado', years: [2023, 2021, 2019, 2017] },
                { id: 'hilux', name: 'Hilux D-4D 2.8', years: [2024, 2022, 2021, 2019] },
            ],
        },
        { id: 'subaru', name: 'Subaru', models: [{ id: 'forester', name: 'Forester XT', years: [2022, 2020, 2018] }] },
        { id: 'mercedes', name: 'Mercedes-Benz', models: [{ id: 'cclass', name: 'C-Class W205', years: [2021, 2019, 2017] }] },
        { id: 'nissan', name: 'Nissan', models: [{ id: 'xtrail', name: 'X-Trail T32', years: [2021, 2019, 2017] }] },
        { id: 'isuzu', name: 'Isuzu', models: [{ id: 'dmax', name: 'D-Max Double Cabin', years: [2023, 2021, 2019] }] },
    ],
    localities: [
        { id: 'nbi-cbd', name: 'Nairobi CBD', radiusKm: 10 },
        { id: 'westlands', name: 'Westlands / Parklands' },
        { id: 'industrial', name: 'Industrial Area Central' },
        { id: 'kilimani', name: 'Kilimani / Ngong Rd' },
        { id: 'mombasa-rd', name: 'Mombasa Rd Hub' },
    ],
    categories,
    providers: providers.slice(0, 6).map(({ id, name }) => ({ id, name })),
    ratingBuckets: [
        { min: 4.5, count: 112 },
        { min: 4.0, count: 198 },
    ],
    eta: { min: 10, max: 60 },
    price: { min: 2600, max: 39000, currency: KES },
};

export const summary: MarketplaceSummary = {
    activeServiceBays: 248,
    region: { name: 'Nairobi Metro', avgEtaMinutes: 16 },
    deliveryModes: { mobileUnits: 14, shopBays: 38 },
    rescue: { etaMinutes: { min: 14, max: 22 }, dispatchedNow: 4 },
    activePatrol: { unit: 'Patrol Unit #12', vehicle: 'MOTORBIKE', location: 'Cruising Uhuru Hwy', minutesAway: 3 },
};

const TOTAL_LISTINGS = 48;

/** Stands in for GET /marketplace/offers: filters the fixtures, then pads the result set to a realistic size. */
export function queryOffers(params: URLSearchParams): OfferPage {
    const page = Math.max(1, Number(params.get('page') ?? 1));
    const pageSize = Math.min(24, Math.max(1, Number(params.get('pageSize') ?? 6)));
    const q = params.get('q')?.toLowerCase().trim();
    const categoryId = params.get('categoryId');
    const fulfilment = params.getAll('fulfilment');
    const providerIds = params.getAll('providerId');
    const minRating = Number(params.get('minRating') ?? 0);
    const maxEta = Number(params.get('maxEtaMinutes') ?? Infinity);
    const maxPrice = Number(params.get('maxPrice') ?? Infinity);
    const sort = (params.get('sort') ?? 'FASTEST_ARRIVAL') as OfferSort;

    let base = offers.filter((o) => {
        if (q && !`${o.title} ${o.description} ${o.provider.name}`.toLowerCase().includes(q)) return false;
        if (categoryId && categoryId !== 'all') {
            if (categoryId === 'rescue' ? o.type !== 'RESCUE_PACKAGE' : categoryId === 'garages' ? o.fulfilment !== 'IN_SHOP' : o.categoryId !== categoryId)
                return false;
        }
        if (fulfilment.length) {
            const mobile = o.fulfilment === 'MOBILE' || o.fulfilment === 'MOBILE_OR_SHOP';
            const shop = o.fulfilment !== 'MOBILE';
            if (!((fulfilment.includes('MOBILE') && mobile) || (fulfilment.includes('IN_SHOP') && shop))) return false;
        }
        if (providerIds.length && !providerIds.includes(o.provider.id)) return false;
        if (o.provider.rating < minRating) return false;
        if (o.etaMinutes !== undefined && o.etaMinutes > maxEta) return false;
        if (o.price.amount > maxPrice) return false;
        return true;
    });

    base = [...base].sort((a, b) => {
        switch (sort) {
            case 'TOP_RATED':
                return b.provider.rating - a.provider.rating;
            case 'LOWEST_PRICE':
                return a.price.amount - b.price.amount;
            case 'OEM_FIT':
                return Number(b.type === 'PART') - Number(a.type === 'PART');
            default:
                return 0;
        }
    });

    // The design shows a 48-listing catalogue; repeat the filtered fixtures to fill it when nothing narrows them.
    const narrowed = base.length < offers.length || Boolean(q);
    const total = base.length === 0 ? 0 : narrowed ? base.length : TOTAL_LISTINGS;
    const start = (page - 1) * pageSize;
    const items: Offer[] = [];
    for (let i = start; i < Math.min(start + pageSize, total); i++) {
        const src = base[i % base.length];
        items.push(i < base.length ? src : { ...src, id: `${src.id}_${Math.floor(i / base.length)}` });
    }

    const make = filters.makes.find((m) => m.id === params.get('makeId'));
    const model = make?.models.find((m) => m.id === params.get('modelId'));
    const year = params.get('year');
    const fitment = make
        ? {
              label: [make.name, model?.name.split(' (')[0], year].filter(Boolean).join(' '),
              detail: [year, make.name, model?.name.replace(/[()]/g, '').replace(' / ', ' ')].filter(Boolean).join(' '),
          }
        : null;

    return { items, page, pageSize, total, fitment };
}
