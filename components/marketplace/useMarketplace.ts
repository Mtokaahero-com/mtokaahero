'use client';

import { useMemo, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import {
    marketplaceApi,
    type Fulfilment,
    type OfferQuery,
    type OfferSort,
    type VehicleSelection,
} from '@/lib/api/marketplace';

export const DEFAULT_VEHICLE: VehicleSelection = { makeId: 'toyota', modelId: 'rav4', year: 2021 };

export interface MarketplaceState {
    q: string;
    vehicle: VehicleSelection;
    draftVehicle: VehicleSelection;
    localityId: string;
    categoryId: string;
    fulfilment: Fulfilment[];
    providerIds: string[] | null;
    minRating: number;
    maxEtaMinutes: number;
    maxPrice: number;
    sort: OfferSort;
    page: number;
}

const DEFAULTS: Omit<MarketplaceState, 'q' | 'categoryId'> = {
    vehicle: DEFAULT_VEHICLE,
    draftVehicle: DEFAULT_VEHICLE,
    localityId: 'nbi-cbd',
    fulfilment: ['MOBILE', 'IN_SHOP'],
    providerIds: null,
    minRating: 4.5,
    maxEtaMinutes: 25,
    maxPrice: 19500,
    sort: 'FASTEST_ARRIVAL',
    page: 1,
};

/** Marketplace search state shared by the desktop and mobile layouts, plus the three queries behind them. */
export function useMarketplace(initial: { q?: string; categoryId?: string }, pageSize = 6) {
    const [state, setState] = useState<MarketplaceState>({ ...DEFAULTS, q: initial.q ?? '', categoryId: initial.categoryId ?? 'all' });

    const filters = useApi('filters', marketplaceApi.filters);
    const summary = useApi(`summary:${state.localityId}`, () => marketplaceApi.summary(state.localityId));

    const query: OfferQuery = useMemo(
        () => ({
            q: state.q || undefined,
            ...state.vehicle,
            localityId: state.localityId,
            categoryId: state.categoryId === 'all' ? undefined : state.categoryId,
            fulfilment: state.fulfilment.length === 2 ? undefined : state.fulfilment,
            providerIds: state.providerIds ?? undefined,
            minRating: state.minRating || undefined,
            maxEtaMinutes: state.maxEtaMinutes,
            maxPrice: state.maxPrice,
            sort: state.sort,
            page: state.page,
            pageSize,
        }),
        [state, pageSize],
    );
    const offers = useApi(JSON.stringify(query), () => marketplaceApi.offers(query));

    /** Update one or more fields; any change other than the page itself returns to page 1. */
    const update = (patch: Partial<MarketplaceState>) =>
        setState((s) => ({ ...s, ...patch, page: 'page' in patch ? (patch.page ?? 1) : 1 }));

    const reset = () => setState((s) => ({ ...s, ...DEFAULTS, vehicle: s.vehicle, draftVehicle: s.vehicle, categoryId: 'all', q: '' }));

    return { state, update, reset, filters, summary, offers, pageSize };
}

export type Marketplace = ReturnType<typeof useMarketplace>;
