import type { Money } from '@/lib/format';
import { marketplaceFetch } from './client';

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
    image: { url: string; alt: string };
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
    /** Compact mobile card details. */
    distanceLabel?: OfferLabel;
    nextSlot?: string;
    chips?: string[];
    fitsVehicle: boolean;
    etaMinutes?: number;
}

export interface VehicleMake {
    id: string;
    name: string;
    models: { id: string; name: string; years: number[] }[];
}

export interface Locality {
    id: string;
    name: string;
    radiusKm?: number;
}

export interface Category {
    id: string;
    label: string;
    shortLabel: string;
    icon: string;
    tone: LabelTone | 'neutral';
    rescue?: boolean;
}

export interface MarketplaceFilters {
    makes: VehicleMake[];
    localities: Locality[];
    categories: Category[];
    providers: { id: string; name: string }[];
    ratingBuckets: { min: number; count: number }[];
    eta: { min: number; max: number };
    price: { min: number; max: number; currency: string };
}

export interface MarketplaceSummary {
    activeServiceBays: number;
    region: { name: string; avgEtaMinutes: number };
    deliveryModes: { mobileUnits: number; shopBays: number };
    rescue: { etaMinutes: { min: number; max: number }; dispatchedNow: number };
    activePatrol: { unit: string; vehicle: 'MOTORBIKE' | 'VAN'; location: string; minutesAway: number } | null;
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
    maxEtaMinutes?: number;
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
    summary: (localityId?: string) => marketplaceFetch<MarketplaceSummary>('/marketplace/summary', { query: { localityId } }),
    filters: () => marketplaceFetch<MarketplaceFilters>('/marketplace/filters'),
    offers: (query: OfferQuery) =>
        marketplaceFetch<OfferPage>('/marketplace/offers', {
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
                maxEtaMinutes: query.maxEtaMinutes,
                maxPrice: query.maxPrice,
                sort: query.sort,
                page: query.page,
                pageSize: query.pageSize,
            },
        }),
    offer: (id: string) => marketplaceFetch<Offer>(`/marketplace/offers/${id}`),
};
