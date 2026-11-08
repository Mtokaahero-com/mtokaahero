'use client';

import { Icon } from '@/components/brand/Icon';
import type { Fulfilment } from '@/lib/api/marketplace';
import { formatMoney } from '@/lib/format';
import type { Marketplace } from './useMarketplace';

const sectionTitle = 'font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider';

function Stars({ value }: { value: number }) {
    return (
        <span className="flex items-center text-secondary">
            {[1, 2, 3, 4, 5].map((i) => (
                <Icon
                    key={i}
                    name={value >= i ? 'star' : value >= i - 0.5 ? 'star_half' : 'star'}
                    fill={value >= i - 0.5}
                    className="text-[16px]"
                />
            ))}
        </span>
    );
}

/** "Precision Filters" sidebar from the desktop marketplace. */
export function FiltersSidebar({ market }: { market: Marketplace }) {
    const { state, update, reset, filters, summary } = market;
    const f = filters.data;
    const s = summary.data;

    const toggleMode = (mode: Fulfilment, on: boolean) =>
        update({ fulfilment: on ? [...state.fulfilment, mode] : state.fulfilment.filter((m) => m !== mode) });

    const allProviders = f?.providers.map((p) => p.id) ?? [];
    const checkedProviders = state.providerIds ?? allProviders;
    const toggleProvider = (id: string, on: boolean) => {
        const next = on ? [...checkedProviders, id] : checkedProviders.filter((p) => p !== id);
        update({ providerIds: next.length === allProviders.length ? null : next });
    };

    const currency = f?.price.currency ?? 'KES';
    const priceMin = f?.price.min ?? 0;
    const priceMax = f?.price.max ?? 0;
    // Ratings arrive with reviews; until someone is rated the filter would only ever empty the results.
    const hasRatings = Boolean(f?.ratingBuckets.some((b) => b.count > 0));

    return (
        <aside className="lg:col-span-3 flex flex-col gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-space-xs">
                    <Icon name="tune" className="text-primary text-[20px]" />
                    <h3 className="font-title-lg text-title-lg text-on-surface">Precision Filters</h3>
                </div>
                <button
                    className="font-code-xs text-code-xs text-primary hover:underline"
                    type="button"
                    onClick={reset}>
                    Reset All
                </button>
            </div>

            <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className={sectionTitle}>Delivery Mode</span>
                <div className="flex flex-col gap-1.5">
                    <label className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
                        <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                            <input
                                checked={state.fulfilment.includes('MOBILE')}
                                onChange={(e) => toggleMode('MOBILE', e.target.checked)}
                                className="w-4 h-4 rounded accent-primary-container"
                                type="checkbox"
                            />
                            <span>Mobile On-Site Hero</span>
                        </span>
                        {s && (
                            <span className="font-code-xs text-code-xs bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded font-bold">
                                {s.deliveryModes.mobileUnits} Units
                            </span>
                        )}
                    </label>
                    <label className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
                        <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                            <input
                                checked={state.fulfilment.includes('IN_SHOP')}
                                onChange={(e) => toggleMode('IN_SHOP', e.target.checked)}
                                className="w-4 h-4 rounded accent-primary-container"
                                type="checkbox"
                            />
                            <span>In-Shop Garage Bay</span>
                        </span>
                        {s && (
                            <span className="font-code-xs text-code-xs bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-bold">
                                {s.deliveryModes.shopBays} Bays
                            </span>
                        )}
                    </label>
                </div>
            </div>
            <div className="h-px bg-surface-container" />

            <div className="flex flex-col gap-space-xs">
                <span className={sectionTitle}>Tenant Workshops</span>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {f?.providers.map((p) => (
                        <label
                            key={p.id}
                            className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface cursor-pointer p-1 rounded hover:bg-surface-container-low">
                            <input
                                checked={checkedProviders.includes(p.id)}
                                onChange={(e) => toggleProvider(p.id, e.target.checked)}
                                className="w-4 h-4 rounded accent-primary-container"
                                type="checkbox"
                            />
                            <span className="truncate">{p.name}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="h-px bg-surface-container" />

            {hasRatings && (
                <>
                    <div className="flex flex-col gap-space-xs">
                        <span className={sectionTitle}>Garage Trust Score</span>
                        <div className="flex flex-col gap-1.5">
                            {f?.ratingBuckets.map((b) => (
                                <label
                                    key={b.min}
                                    className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-surface-container-low">
                                    <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                                        <input
                                            checked={state.minRating === b.min}
                                            onChange={() => update({ minRating: b.min })}
                                            className="accent-primary-container"
                                            name="rating-filter"
                                            type="radio"
                                        />
                                        <Stars value={b.min} />
                                        <span className="font-code-sm text-code-sm">{b.min.toFixed(1)} &amp; up</span>
                                    </div>
                                    <span className="font-code-xs text-code-xs text-on-surface-variant">
                                        ({b.count})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="h-px bg-surface-container" />
                </>
            )}

            {priceMax > priceMin && (
                <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                        <span className={sectionTitle}>Max Price Range</span>
                        <span className="font-code-sm text-code-sm text-primary font-bold">
                            {state.maxPrice === null ? 'Any price' : formatMoney({ amount: state.maxPrice, currency })}
                        </span>
                    </div>
                    <input
                        aria-label="Maximum price"
                        className="w-full accent-primary-container cursor-pointer"
                        min={priceMin}
                        max={priceMax}
                        step={50}
                        type="range"
                        value={state.maxPrice ?? priceMax}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            update({ maxPrice: value >= priceMax ? null : value });
                        }}
                    />
                    <div className="flex justify-between font-code-xs text-code-xs text-on-surface-variant">
                        <span>{formatMoney({ amount: priceMin, currency })}</span>
                        <span>{formatMoney({ amount: priceMax, currency })}</span>
                    </div>
                </div>
            )}

            <div className="bg-surface-container p-space-sm rounded-lg flex items-start gap-space-xs mt-2">
                <Icon name="payments" className="text-secondary text-[20px]" />
                <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                    You pay the workshop or mechanic directly, by M-Pesa or cash, once the job is done. MtokaaHero never
                    holds your money.
                </p>
            </div>
        </aside>
    );
}
