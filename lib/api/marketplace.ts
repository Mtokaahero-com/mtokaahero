import type { Money } from '@/lib/format';
import { apiFetch } from './client';

export type ItemType = 'PART' | 'SERVICE' | 'RESCUE_PACKAGE';
export type Fulfilment = 'MOBILE' | 'IN_SHOP' | 'MOBILE_OR_SHOP' | 'PICKUP';
export type OfferSort = 'FASTEST_ARRIVAL' | 'TOP_RATED' | 'LOWEST_PRICE' | 'OEM_FIT';
/** Colour role a provider-entered label is rendered in. */
export type LabelTone = 'rescue' | 'primary' | 'amber' | 'muted' | 'success';

export interface ProviderSummary {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
}

export interface OfferLabel {
    label: string;
    icon?: string;
    tone?: LabelTone;
}

export interface Offer {
    id: string;
    type: ItemType;
    fulfilment: Fulfilment;
    categoryId: string;
    title: string;
    description: string;
    /** Item photos are not supported yet, so `url` is null; use `offerImage()` for the category's stock photo. */
    image: { url: string | null; alt: string };
    provider: ProviderSummary;
    /** Top-left pill on the card image, e.g. "Mobile Rescue Unit". */
    modeLabel: OfferLabel;
    /** Bottom-left tag on the card image, e.g. "Avg 18 mins dispatch"; dark for live dispatch, light for shop facts. */
    highlight: OfferLabel & { style: 'dark' | 'light' };
    /** Fitment / spec row: e.g. "OEM Fit: P83145N" with a note like "Warranty: 24,000 km". */
    spec: { icon: string; label: string; note: OfferLabel };
    price: Money & { label: string };
    priceNote?: OfferLabel & { style?: 'text' | 'chip' };
    /** Call to action for the primary button ("Request Rescue", "Book Service Bay", "Details"). */
    action: { label: string; icon: string };
    /** Distance from the searched locality, or the provider's address without one. */
    distanceLabel?: OfferLabel;
    /** True only when the item declares a fitment matching the searched vehicle; universal items are false. */
    fitsVehicle: boolean;
    distanceKm: number | null;
}

export interface VehicleMake {
    id: string;
    name: string;
    models: { id: string; name: string; years: number[] }[];
}

export interface Locality {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    label: string;
    shortLabel: string;
    icon: string;
    tone: LabelTone | 'neutral';
    rescue: boolean;
    /** Item types that may be listed under this category. */
    types: ItemType[];
}

export interface MarketplaceFilters {
    makes: VehicleMake[];
    localities: Locality[];
    categories: Category[];
    providers: { id: string; name: string }[];
    /** Every count is zero until reviews exist. */
    ratingBuckets: { min: number; count: number }[];
    /** Lowest and highest live price; both 0 when nothing is listed. */
    price: { min: number; max: number; currency: string };
}

export interface MarketplaceSummary {
    /** Workshop bays across every approved provider. */
    activeServiceBays: number;
    region: { name: string };
    /** Within the selected locality when one is given. */
    deliveryModes: { mobileUnits: number; shopBays: number };
    rescue: { acceptingProviders: number };
}

export interface VehicleSelection {
    makeId?: string;
    modelId?: string;
    year?: number;
}

export interface OfferQuery extends VehicleSelection {
    q?: string;
    localityId?: string;
    categoryId?: string;
    fulfilment?: Fulfilment[];
    providerIds?: string[];
    minRating?: number;
    maxPrice?: number;
    sort?: OfferSort;
    page?: number;
    pageSize?: number;
}

export interface OfferPage {
    items: Offer[];
    page: number;
    pageSize: number;
    total: number;
    /** Human label for the vehicle the results were matched against, e.g. "Toyota RAV4 2021". */
    fitment: { label: string; detail: string } | null;
}

export const marketplaceApi = {
    summary: (localityId?: string) => apiFetch<MarketplaceSummary>('/marketplace/summary', { query: { localityId } }),
    filters: () => apiFetch<MarketplaceFilters>('/marketplace/filters'),
    offers: (query: OfferQuery) =>
        apiFetch<OfferPage>('/marketplace/offers', {
            query: {
                q: query.q,
                makeId: query.makeId,
                modelId: query.modelId,
                year: query.year,
                localityId: query.localityId,
                categoryId: query.categoryId,
                fulfilment: query.fulfilment,
                providerId: query.providerIds,
                minRating: query.minRating,
                maxPrice: query.maxPrice,
                sort: query.sort,
                page: query.page,
                pageSize: query.pageSize,
            },
        }),
    offer: (id: string) => apiFetch<Offer>(`/marketplace/offers/${id}`),
};
