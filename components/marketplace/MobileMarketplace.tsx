'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import type { Fulfilment, Offer, VehicleSelection } from '@/lib/api/marketplace';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useCart } from '@/providers/cart-provider';
import { MobileOfferCard } from './MobileOfferCard';
import { Pagination } from './Pagination';
import type { Marketplace } from './useMarketplace';
import { modelsFor } from './VehicleFilterBar';

const MODE_CYCLE: { label: string; value: Fulfilment[] }[] = [
    { label: 'All', value: ['MOBILE', 'IN_SHOP'] },
    { label: 'Mobile', value: ['MOBILE'] },
    { label: 'In-Shop', value: ['IN_SHOP'] },
];
const BUDGET = 13000;

function vehicleName(market: Marketplace, v: VehicleSelection) {
    const make = market.filters.data?.makes.find((m) => m.id === v.makeId);
    const model = make?.models.find((m) => m.id === v.modelId);
    if (!make) return 'Select your vehicle';
    return `${make.name} ${model?.name.split(' (')[0] ?? ''}${v.year ? ` (${v.year})` : ''}`.trim();
}

function VehicleDrawer({ market, open, onOpenChange }: { market: Marketplace; open: boolean; onOpenChange: (o: boolean) => void }) {
    const [draft, setDraft] = useState<VehicleSelection>(market.state.vehicle);
    const f = market.filters.data;
    const models = modelsFor(f, draft);
    const years = models.find((m) => m.id === draft.modelId)?.years ?? [];
    const select = 'w-full h-12 px-space-sm rounded-lg bg-surface-container-low font-title-md text-title-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary';

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Switch vehicle</DrawerTitle>
                    <DrawerDescription>Parts and rescue units are filtered for guaranteed fitment.</DrawerDescription>
                </DrawerHeader>
                <div className="px-gutter pb-space-lg flex flex-col gap-space-sm">
                    <label className="font-code-xs text-code-xs text-on-surface-variant">VEHICLE MAKE</label>
                    <select
                        className={select}
                        value={draft.makeId}
                        onChange={(e) => {
                            const model = f?.makes.find((m) => m.id === e.target.value)?.models[0];
                            setDraft({ makeId: e.target.value, modelId: model?.id, year: model?.years[0] });
                        }}
                    >
                        {f?.makes.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <label className="font-code-xs text-code-xs text-on-surface-variant">SERIES / MODEL</label>
                    <select
                        className={select}
                        value={draft.modelId}
                        onChange={(e) => setDraft({ ...draft, modelId: e.target.value, year: models.find((m) => m.id === e.target.value)?.years[0] })}
                    >
                        {models.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <label className="font-code-xs text-code-xs text-on-surface-variant">BUILD YEAR</label>
                    <select className={select} value={draft.year} onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })}>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => {
                            market.update({ vehicle: draft, draftVehicle: draft });
                            onOpenChange(false);
                        }}
                        className="mt-space-sm min-h-[48px] w-full bg-primary text-on-primary font-label-lg text-label-lg font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <Icon name="check_circle" className="text-[20px]" />
                        Apply Fitment
                    </button>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export function MobileMarketplace({ market, onPrimary }: { market: Marketplace; onPrimary: (offer: Offer) => void }) {
    const router = useRouter();
    const cart = useCart();
    const { state, update, filters, summary, offers, pageSize } = market;
    const [vehicleOpen, setVehicleOpen] = useState(false);
    const [locating, setLocating] = useState(false);
    const s = summary.data;
    const page = offers.data;
    const modeIndex = Math.max(0, MODE_CYCLE.findIndex((m) => m.value.length === state.fulfilment.length && m.value.every((v) => state.fulfilment.includes(v))));
    const currency = filters.data?.price.currency ?? 'KES';

    const gpsRescue = () => {
        if (!('geolocation' in navigator)) return router.push('/rescue');
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => router.push(`/rescue?lat=${pos.coords.latitude.toFixed(5)}&lng=${pos.coords.longitude.toFixed(5)}`),
            () => router.push('/rescue'),
            { enableHighAccuracy: true, timeout: 8000 },
        );
    };

    const pill = (active: boolean) =>
        cn(
            'shrink-0 px-space-md py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 flex items-center gap-1.5',
            active ? 'bg-primary text-on-primary font-bold shadow-sm' : 'bg-surface-container-low hover:bg-surface-container text-on-surface',
        );
    const chip = (active: boolean) =>
        cn(
            'flex items-center gap-1 px-space-sm py-1.5 rounded-lg text-on-surface font-label-md text-label-md active:scale-95 transition-all',
            active ? 'bg-surface-container-high' : 'bg-surface-container',
        );
    const PILL_ICON: Record<string, string> = { primary: 'text-primary', amber: 'text-secondary', rescue: 'text-secondary', neutral: 'text-tertiary' };

    return (
        <div className="flex flex-col w-full pb-8">
            <section className="px-gutter pt-space-sm pb-space-xs">
                <div className="bg-surface-container-low rounded-xl p-space-sm shadow-sm flex items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                            <Icon name="directions_car" className="text-[24px]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-code-xs text-code-xs uppercase tracking-wider text-on-surface-variant font-bold">Fitment Active</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            </div>
                            <button type="button" onClick={() => setVehicleOpen(true)} className="flex items-center gap-1 text-left min-w-0 group">
                                <span className="font-title-md text-title-md text-on-surface truncate font-semibold">{vehicleName(market, state.vehicle)}</span>
                                <Icon name="expand_more" className="text-[18px] text-on-surface-variant transition-transform group-hover:translate-y-0.5" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setVehicleOpen(true)}
                        className="shrink-0 px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all text-primary font-label-md text-label-md font-bold"
                    >
                        Switch
                    </button>
                </div>
            </section>

            <section className="px-gutter pt-space-xs pb-space-sm">
                <div className="relative overflow-hidden rounded-xl bg-tertiary text-on-tertiary p-space-md shadow-md">
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
                    <div className="flex items-start justify-between gap-space-sm relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-container" />
                            </span>
                            <span className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-tertiary-container">Urgent Roadside Triage</span>
                        </div>
                        <div className="flex items-center gap-1 bg-on-tertiary/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            <Icon name="bolt" className="text-[14px] text-secondary-fixed" />
                            <span className="font-code-xs text-code-xs text-on-tertiary font-bold tracking-tight">ETA ~{s?.rescue.etaMinutes.min ?? 14} min</span>
                        </div>
                    </div>
                    <div className="mt-2 relative z-10">
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-tertiary leading-tight">Broken Down on Road?</h2>
                        <p className="font-body-sm text-body-sm text-on-tertiary/80 mt-0.5">Tap for 1-Click Instant GPS Mechanic Rescue dispatch nearby.</p>
                    </div>
                    <div className="mt-space-sm pt-space-xs flex items-center gap-space-sm relative z-10">
                        <button
                            type="button"
                            onClick={gpsRescue}
                            disabled={locating}
                            className="flex-1 min-h-[48px] px-space-md bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            <Icon name={locating ? 'sync' : 'emergency'} fill={!locating} className={cn('text-[20px]', locating && 'animate-spin')} />
                            <span>{locating ? 'Locating GPS…' : '1-Tap GPS Rescue'}</span>
                        </button>
                        <Link
                            href="/rescue#symptoms"
                            aria-label="Describe the breakdown"
                            className="w-12 h-12 rounded-lg bg-on-tertiary/15 text-on-tertiary flex items-center justify-center active:scale-95 transition-transform shrink-0"
                        >
                            <Icon name="record_voice_over" className="text-[22px]" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-gutter py-space-xs">
                <form
                    role="search"
                    className="relative flex items-center"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Icon name="search" className="absolute left-3 text-outline text-[20px] pointer-events-none" />
                    <input
                        value={state.q}
                        onChange={(e) => update({ q: e.target.value })}
                        aria-label="Search the marketplace"
                        className="w-full h-12 pl-10 pr-12 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md shadow-sm outline-none transition-all focus:bg-surface-container-lowest focus:shadow-md"
                        placeholder="Search parts, mechanics, OBD codes, garages..."
                        type="search"
                    />
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => update({ q: '' })}
                        className="absolute right-2 p-1.5 rounded-md hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors"
                    >
                        <Icon name={state.q ? 'close' : 'document_scanner'} className="text-[20px]" />
                    </button>
                </form>
            </section>

            <section className="py-space-xs">
                <div className="flex items-center gap-2 overflow-x-auto px-gutter no-scrollbar py-1">
                    <button type="button" className={pill(state.categoryId === 'all')} onClick={() => update({ categoryId: 'all' })}>
                        <Icon name="widgets" className="text-[16px]" />
                        <span>All</span>
                    </button>
                    {filters.data?.categories.map((c) => {
                        const active = state.categoryId === c.id;
                        const icon = (c as { mobileIcon?: string }).mobileIcon ?? c.icon;
                        return (
                            <button key={c.id} type="button" className={pill(active)} onClick={() => update({ categoryId: c.id })}>
                                <Icon name={icon} className={cn('text-[16px]', !active && PILL_ICON[c.tone])} />
                                <span>{c.shortLabel}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="px-gutter py-space-xs flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 shrink-0">
                    <button type="button" className={chip(true)} onClick={() => update({ fulfilment: MODE_CYCLE[(modeIndex + 1) % MODE_CYCLE.length].value })}>
                        <Icon name="tune" className="text-[16px] text-primary" />
                        <span>Mode: {MODE_CYCLE[modeIndex].label}</span>
                        <Icon name="arrow_drop_down" className="text-[14px] text-outline" />
                    </button>
                    <button type="button" aria-pressed={state.minRating >= 4.5} className={chip(state.minRating >= 4.5)} onClick={() => update({ minRating: state.minRating >= 4.5 ? 0 : 4.5 })}>
                        <Icon name="star" fill className="text-[16px] text-secondary" />
                        <span>4.5+ Rating</span>
                    </button>
                    <button
                        type="button"
                        aria-pressed={state.maxPrice <= BUDGET}
                        className={chip(state.maxPrice <= BUDGET)}
                        onClick={() => update({ maxPrice: state.maxPrice <= BUDGET ? (filters.data?.price.max ?? 39000) : BUDGET })}
                    >
                        <Icon name="payments" className="text-[16px] text-outline" />
                        <span>Under {formatMoney({ amount: BUDGET, currency })}</span>
                    </button>
                </div>
                {s && (
                    <div className="shrink-0">
                        <span className="font-code-xs text-code-xs text-outline uppercase tracking-wider font-semibold">{s.rescue.dispatchedNow} Dispatched</span>
                    </div>
                )}
            </section>

            {page?.fitment && (
                <section className="px-gutter pt-space-xs pb-1">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <Icon name="verified" className="text-[16px] text-primary" />
                        <span className="font-body-sm text-body-sm">
                            Showing parts &amp; rescue units certified for <strong className="text-on-surface font-semibold">{page.fitment.detail}</strong>
                        </span>
                    </div>
                </section>
            )}

            <section className={cn('px-gutter flex flex-col gap-space-md pt-space-xs transition-opacity', offers.loading && page && 'opacity-50')}>
                {offers.error ? (
                    <div className="bg-surface-container-lowest rounded-xl p-space-lg text-center flex flex-col items-center gap-2">
                        <Icon name="cloud_off" className="text-[28px] text-tertiary" />
                        <p className="font-title-md text-title-md">We couldn&apos;t load offers.</p>
                        <button type="button" onClick={offers.reload} className="font-label-lg text-label-lg text-primary">
                            Try again
                        </button>
                    </div>
                ) : page ? (
                    page.items.length ? (
                        page.items.map((o) => <MobileOfferCard key={o.id} offer={o} onPrimary={onPrimary} />)
                    ) : (
                        <div className="bg-surface-container-lowest rounded-xl p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
                            No offers match. Try another category or clear the filters.
                        </div>
                    )
                ) : (
                    Array.from({ length: 3 }, (_, i) => <div key={i} className="h-72 rounded-xl bg-surface-container-lowest shadow-sm animate-pulse" />)
                )}
                {page && page.total > pageSize && (
                    <div className="flex justify-center">
                        <Pagination page={page.page} pages={Math.ceil(page.total / pageSize)} onPage={(p) => update({ page: p })} />
                    </div>
                )}
            </section>

            {s?.activePatrol && (
                <section className="px-gutter pt-space-md">
                    <div className="bg-surface-container-high rounded-xl p-space-md flex items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-sm min-w-0">
                            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                                <Icon name={s.activePatrol.vehicle === 'MOTORBIKE' ? 'two_wheeler' : 'local_shipping'} className="text-[20px]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-label-md text-label-md font-bold text-on-surface">{s.activePatrol.unit} Active</span>
                                    <span className="w-2 h-2 rounded-full bg-secondary-container" />
                                </div>
                                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                                    {s.activePatrol.location} • {s.activePatrol.minutesAway} mins from your area
                                </span>
                            </div>
                        </div>
                        <Link
                            href="/rescue"
                            aria-label="Request this patrol"
                            className="shrink-0 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary shadow-sm active:scale-95 transition-transform"
                        >
                            <Icon name="radar" className="text-[20px]" />
                        </Link>
                    </div>
                </section>
            )}

            {cart.count > 0 && cart.total && (
                <div className="sticky bottom-24 px-gutter pt-space-sm z-30 pointer-events-none">
                    <div className="pointer-events-auto bg-inverse-surface text-inverse-on-surface rounded-xl p-space-sm shadow-xl flex items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-2.5 min-w-0 pl-1">
                            <div className="relative">
                                <Icon name="shopping_bag" className="text-[24px] text-inverse-on-surface" />
                                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-secondary text-on-secondary font-code-xs text-[9px] flex items-center justify-center font-bold">
                                    {cart.count}
                                </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-title-md text-title-md text-inverse-on-surface font-semibold leading-tight">{formatMoney(cart.total)}</span>
                                <span className="font-code-xs text-code-xs text-inverse-on-surface/70 truncate">{cart.lines[0].title} pending</span>
                            </div>
                        </div>
                        <Link
                            href="/rescue"
                            className="h-10 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold flex items-center gap-1.5 active:scale-95 transition-transform shrink-0"
                        >
                            <span>Checkout</span>
                            <Icon name="arrow_forward" className="text-[16px]" />
                        </Link>
                    </div>
                </div>
            )}

            <VehicleDrawer key={vehicleOpen ? 'open' : 'closed'} market={market} open={vehicleOpen} onOpenChange={setVehicleOpen} />
        </div>
    );
}
