'use client';

import { Icon } from '@/components/brand/Icon';
import type { Offer, OfferSort } from '@/lib/api/marketplace';
import { formatCount } from '@/lib/format';
import { cn } from '@/lib/utils';
import { FiltersSidebar } from './FiltersSidebar';
import { OfferCard, OfferCardSkeleton } from './OfferCard';
import { Pagination } from './Pagination';
import { SosStrip } from './SosStrip';
import type { Marketplace } from './useMarketplace';
import { VehicleFilterBar } from './VehicleFilterBar';

const SORTS: { value: OfferSort; label: string }[] = [
    { value: 'FASTEST_ARRIVAL', label: 'Fastest Emergency Arrival' },
    { value: 'TOP_RATED', label: 'Highest Customer Rating' },
    { value: 'LOWEST_PRICE', label: 'Lowest Price First' },
    { value: 'OEM_FIT', label: 'Guaranteed OEM Fit' },
];

const CHIP_ICON_TONE: Record<string, string> = {
    primary: 'text-primary',
    amber: 'text-secondary',
    neutral: 'text-on-surface',
    rescue: 'text-tertiary',
    muted: 'text-on-surface-variant',
    success: 'text-emerald-700',
};

export function DesktopMarketplace({
    market,
    onPrimary,
    onAddToCart,
}: {
    market: Marketplace;
    onPrimary: (offer: Offer) => void;
    onAddToCart: (offer: Offer) => void;
}) {
    const { state, update, filters, summary, offers, pageSize } = market;
    const s = summary.data;
    const page = offers.data;
    const pages = page ? Math.max(1, Math.ceil(page.total / pageSize)) : 1;
    const first = page && page.total ? (page.page - 1) * pageSize + 1 : 0;
    const last = page ? Math.min(page.page * pageSize, page.total) : 0;

    const chipBase = 'px-space-md py-2 rounded-full font-label-md text-label-md shadow-sm whitespace-nowrap flex items-center gap-1 transition-all';

    return (
        <div className="flex flex-col w-full">
            <section className="w-full bg-surface-container-low px-gutter-lg py-space-xl relative overflow-hidden">
                <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />
                <div className="max-w-[1440px] mx-auto flex flex-col gap-space-lg relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed mb-space-xs shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="font-code-xs text-code-xs tracking-wider uppercase font-semibold">
                                    Live High-Trust Network{s ? ` • ${formatCount(s.activeServiceBays)} Active Service Bays` : ''}
                                </span>
                            </div>
                            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                                Find Top Garages, Genuine Parts &amp; Mobile Rescue Mechanics
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                                Standardized pricing, verified technician credentials, and guaranteed OEM compatibility across verified workshop partners.
                            </p>
                        </div>
                        <div className="flex items-center gap-space-md bg-surface-container-lowest p-space-sm px-space-md rounded-xl shadow-sm self-start lg:self-auto">
                            <div className="flex items-center gap-2">
                                <Icon name="fmd_good" className="text-tertiary text-[20px]" />
                                <div className="flex flex-col">
                                    <span className="font-code-sm text-code-sm text-on-surface font-semibold leading-none">
                                        {s?.region.name ?? 'Locating…'}
                                    </span>
                                    <span className="font-code-xs text-code-xs text-on-surface-variant">
                                        Avg ETA: {s ? `${s.region.avgEtaMinutes} mins` : '--'}
                                    </span>
                                </div>
                            </div>
                            <div className="h-6 w-px bg-surface-container-high" />
                            <div className="flex items-center gap-2">
                                <Icon name="verified_user" className="text-secondary text-[20px]" />
                                <div className="flex flex-col">
                                    <span className="font-code-sm text-code-sm text-on-surface font-semibold leading-none">Escrow Lock</span>
                                    <span className="font-code-xs text-code-xs text-on-surface-variant">Post-Inspection Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <VehicleFilterBar market={market} />

                    <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label="Categories">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={state.categoryId === 'all'}
                            onClick={() => update({ categoryId: 'all' })}
                            className={cn(
                                chipBase,
                                state.categoryId === 'all'
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-container-lowest hover:bg-surface-container-high text-on-surface-variant',
                            )}
                        >
                            <Icon name="grid_view" className="text-[16px]" />
                            All Services &amp; Spares
                        </button>
                        {filters.data?.categories.map((c) => {
                            const active = state.categoryId === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => update({ categoryId: c.id })}
                                    className={cn(
                                        chipBase,
                                        active
                                            ? 'bg-primary text-on-primary'
                                            : cn(
                                                  'bg-surface-container-lowest hover:bg-surface-container-high',
                                                  c.rescue ? 'text-tertiary' : 'text-on-surface-variant',
                                              ),
                                    )}
                                >
                                    {c.rescue ? (
                                        <span className={cn('w-2 h-2 rounded-full animate-ping', active ? 'bg-on-primary' : 'bg-tertiary')} />
                                    ) : (
                                        <Icon name={c.icon} className={cn('text-[16px]', !active && CHIP_ICON_TONE[c.tone])} />
                                    )}
                                    {c.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="w-full px-gutter-lg py-space-xl max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                    <FiltersSidebar market={market} />
                    <div className="lg:col-span-9 flex flex-col gap-space-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-sm px-space-md rounded-xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                                    {page ? `Showing ${page.items.length} Verified Offers` : 'Loading verified offers…'}
                                </span>
                                {page?.fitment && (
                                    <span className="font-code-xs text-code-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                                        {page.fitment.label} Matched
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-space-xs self-end sm:self-auto">
                                <label htmlFor="offer-sort" className="font-code-xs text-code-xs text-on-surface-variant uppercase">
                                    Sort By:
                                </label>
                                <select
                                    id="offer-sort"
                                    value={state.sort}
                                    onChange={(e) => update({ sort: e.target.value as OfferSort })}
                                    className="bg-surface-container-low font-body-sm text-body-sm text-on-surface px-space-sm py-1 rounded focus:outline-none cursor-pointer"
                                >
                                    {SORTS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {offers.error ? (
                            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl flex flex-col items-center gap-space-sm text-center">
                                <Icon name="cloud_off" className="text-[32px] text-tertiary" />
                                <p className="font-title-md text-title-md text-on-surface">We couldn&apos;t load offers right now.</p>
                                <button type="button" onClick={offers.reload} className="font-label-lg text-label-lg text-primary hover:underline">
                                    Try again
                                </button>
                            </div>
                        ) : page && page.items.length === 0 ? (
                            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl flex flex-col items-center gap-space-sm text-center">
                                <Icon name="search_off" className="text-[32px] text-on-surface-variant" />
                                <p className="font-title-md text-title-md text-on-surface">No verified offers match these filters.</p>
                                <button type="button" onClick={market.reset} className="font-label-lg text-label-lg text-primary hover:underline">
                                    Reset filters
                                </button>
                            </div>
                        ) : (
                            <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md transition-opacity', offers.loading && page && 'opacity-50')}>
                                {page
                                    ? page.items.map((o) => <OfferCard key={o.id} offer={o} onPrimary={onPrimary} onAddToCart={onAddToCart} />)
                                    : Array.from({ length: pageSize }, (_, i) => <OfferCardSkeleton key={i} />)}
                            </div>
                        )}

                        {page && page.total > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                    Showing{' '}
                                    <strong className="text-on-surface">
                                        {first} - {last}
                                    </strong>{' '}
                                    of {page.total} total compatible listings{page.fitment ? ' for selected vehicle' : ''}
                                </span>
                                <Pagination page={page.page} pages={pages} onPage={(p) => update({ page: p })} />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <SosStrip etaMin={s?.rescue.etaMinutes.min} etaMax={s?.rescue.etaMinutes.max} />
        </div>
    );
}
