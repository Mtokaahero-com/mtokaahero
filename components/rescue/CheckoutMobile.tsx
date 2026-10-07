'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { LogoMark } from '@/components/brand/Logo';
import { MapSnapshot } from '@/components/map/MapSnapshot';
import { AccountMenu } from '@/components/site/AccountMenu';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PAYMENT_OPTIONS } from './CheckoutDesktop';
import type { Checkout, CheckoutFields } from './useCheckout';

function Err({ message }: { message?: string }) {
    return message ? <p className="font-body-sm text-body-sm text-tertiary">{message}</p> : null;
}

const field =
    'w-full h-11 rounded-lg bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container';

export function CheckoutMobile({ checkout }: { checkout: Checkout }) {
    const router = useRouter();
    const { fields, set, errors, quote, location, mode, setMode, payment, setPayment } = checkout;
    const q = quote.data;
    const vehicleReady = Boolean(fields.make && fields.model && fields.year && fields.plate);
    const [editingVehicle, setEditingVehicle] = useState(false);
    const showVehicleForm = editingVehicle || !vehicleReady || Boolean(errors.make || errors.model || errors.year || errors.plate);
    const input = (key: keyof CheckoutFields) => ({ value: fields[key], onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value) });
    const maskedPhone = fields.phone.length === 9 ? `+254 ${fields.phone.slice(0, 3)} ••• ${fields.phone.slice(6)}` : 'your phone';

    return (
        <>
            <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
                <div className="h-16 px-gutter flex items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm min-w-0">
                        <button
                            type="button"
                            aria-label="Go Back"
                            onClick={() => router.back()}
                            className="w-11 h-11 flex items-center justify-center text-on-surface rounded-full hover:bg-surface-container active:scale-95 transition-all shrink-0"
                        >
                            <Icon name="arrow_back" className="text-[24px]" />
                        </button>
                        <LogoMark className="h-6 max-[370px]:hidden" />
                        <h1 className="font-headline-sm text-headline-sm text-on-surface truncate max-w-[150px]">
                            {mode === 'ROADSIDE' ? 'Emergency Dispatch' : 'Bay Booking'}
                        </h1>
                    </div>
                    <AccountMenu compact />
                </div>
            </header>

            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    void checkout.submit();
                }}
                className="flex flex-col w-full pt-16 pb-44"
            >
                <div className="w-full bg-surface-container-low px-gutter py-3 shadow-sm">
                    <div className="flex items-center justify-between text-on-surface relative">
                        <div className="flex items-center gap-1.5 z-10">
                            <div
                                className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center shadow-sm',
                                    checkout.step > 1 ? 'bg-primary text-on-primary' : 'bg-primary-container text-on-primary animate-pulse',
                                )}
                            >
                                {checkout.step > 1 ? <Icon name="check" className="text-[15px]" /> : <span className="font-code-xs text-code-xs font-bold">1</span>}
                            </div>
                            <span className={cn('font-label-md text-label-md', checkout.step > 1 ? 'text-on-surface font-semibold' : 'text-primary font-bold')}>
                                1. Vehicle
                            </span>
                        </div>
                        <div className={cn('h-0.5 flex-1 mx-2', checkout.step > 1 ? 'bg-primary' : 'bg-outline-variant/40')} />
                        <div className={cn('flex items-center gap-1.5 z-10', checkout.step < 2 && 'opacity-70')}>
                            <div
                                className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center font-code-xs text-code-xs font-bold',
                                    checkout.step === 2 ? 'bg-primary-container text-on-primary shadow-md animate-pulse' : 'bg-surface-container-highest text-on-surface-variant',
                                )}
                            >
                                2
                            </div>
                            <span className={cn('font-label-md text-label-md', checkout.step === 2 ? 'text-primary font-bold' : 'text-on-surface-variant')}>
                                2. Service
                            </span>
                        </div>
                        <div className="h-0.5 flex-1 mx-2 bg-outline-variant/40" />
                        <div className="flex items-center gap-1.5 z-10 opacity-70">
                            <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-code-xs text-code-xs font-semibold">
                                3
                            </div>
                            <span className="font-label-md text-label-md text-on-surface-variant">3. Escrow</span>
                        </div>
                    </div>
                </div>

                <div className="px-gutter pt-4 flex flex-col gap-4">
                    {!checkout.signedIn && (
                        <div className="w-full rounded-xl bg-surface-container-highest/80 p-3.5 flex items-start gap-3 shadow-sm">
                            <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container mt-0.5">
                                <Icon name="bolt" fill className="text-[20px]" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-title-md text-title-md text-on-surface tracking-tight">Guest Motorist Checkout</span>
                                    <span className="bg-secondary-fixed text-on-secondary-fixed font-code-xs text-code-xs px-1.5 py-0.5 rounded uppercase font-semibold">
                                        Zero Wait
                                    </span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-tight">
                                    No password required. Instant tracking portal link dispatched via SMS &amp; WhatsApp on confirmation.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="w-full rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3">
                        <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Motorist Contact</span>
                        <div className="flex flex-col gap-1">
                            <input aria-label="Full name" autoComplete="name" className={field} placeholder="Full name" {...input('fullName')} />
                            <Err message={errors.fullName} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="relative flex items-center">
                                <span className="absolute left-3 font-code-xs text-code-xs text-on-surface-variant font-bold">+254</span>
                                <input
                                    aria-label="Phone number"
                                    autoComplete="tel-national"
                                    inputMode="numeric"
                                    type="tel"
                                    className={cn(field, 'pl-14')}
                                    placeholder="712 345 678"
                                    {...input('phone')}
                                />
                            </div>
                            <Err message={errors.phone} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input aria-label="Email" autoComplete="email" type="email" className={field} placeholder="Email for your receipt" {...input('email')} />
                            <Err message={errors.email} />
                        </div>
                    </div>

                    <div className="w-full rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">Identified Vehicle &amp; Part Match</span>
                            {vehicleReady && !showVehicleForm ? (
                                <span className="inline-flex items-center gap-1 bg-surface-container text-primary font-code-xs text-code-xs px-2 py-0.5 rounded-full font-bold">
                                    <Icon name="verified" fill className="text-[13px]" />
                                    FITMENT CONFIRMED
                                </span>
                            ) : null}
                        </div>
                        {showVehicleForm ? (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                    <input aria-label="Make" className={field} placeholder="Make (Toyota)" {...input('make')} />
                                    <Err message={errors.make} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <input aria-label="Model" className={field} placeholder="Model (Prado TX)" {...input('model')} />
                                    <Err message={errors.model} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <input aria-label="Year" inputMode="numeric" className={field} placeholder="Year" {...input('year')} />
                                    <Err message={errors.year} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <input aria-label="Plate number" className={cn(field, 'font-code-sm text-code-sm uppercase font-bold text-primary')} placeholder="KDA 482B" {...input('plate')} />
                                    <Err message={errors.plate} />
                                </div>
                                {vehicleReady && (
                                    <button type="button" onClick={() => setEditingVehicle(false)} className="col-span-2 h-10 rounded-lg bg-surface-container text-primary font-label-lg text-label-lg font-bold">
                                        Done
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button type="button" onClick={() => setEditingVehicle(true)} className="flex items-center gap-3 text-left">
                                <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0 relative shadow-inner flex items-center justify-center text-primary">
                                    <Icon name="directions_car" className="text-[28px]" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                                        {fields.year} {fields.make} {fields.model}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="font-code-sm text-code-sm bg-surface-container-high px-2 py-0.5 rounded font-semibold text-on-surface tracking-wider uppercase">
                                            {fields.plate}
                                        </span>
                                        <span className="font-body-sm text-body-sm text-primary">• Edit</span>
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-0.5">
                            <span className="font-title-md text-title-md text-on-surface">Service Delivery Mode</span>
                            <span className="font-code-xs text-code-xs text-primary font-semibold">RESPONSE: ~{q?.responseMinutes ?? 18} MIN</span>
                        </div>
                        {(['ROADSIDE', 'IN_SHOP'] as const).map((m) => {
                            const active = mode === m;
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setMode(m)}
                                    className={cn(
                                        'w-full rounded-xl p-3.5 flex items-start gap-3.5 text-left transition-all',
                                        active ? 'bg-surface-container-lowest shadow-md' : 'bg-surface-container-low shadow-sm opacity-85',
                                    )}
                                >
                                    <div className="pt-0.5">
                                        <div className={cn('w-5 h-5 rounded-full flex items-center justify-center', active ? 'bg-primary' : 'bg-surface-container-highest')}>
                                            <div className={cn('w-2 h-2 rounded-full', active ? 'bg-surface-container-lowest' : 'bg-transparent')} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            {m === 'ROADSIDE' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-title-md text-title-md text-on-surface font-semibold">Roadside Rescue</span>
                                                    <span className="bg-error-container text-error font-code-xs text-code-xs px-1.5 py-0.5 rounded-full font-bold uppercase animate-pulse">
                                                        Live SOS
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-title-md text-title-md text-on-surface font-semibold">In-Shop Garage Bay</span>
                                            )}
                                            {m === 'ROADSIDE' ? (
                                                <span className="font-code-sm text-code-sm text-primary font-bold">Fastest</span>
                                            ) : (
                                                <span className="font-code-sm text-code-sm text-outline">Save {q ? formatMoney(q.inShopSavings) : ''}</span>
                                            )}
                                        </div>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-normal">
                                            {m === 'ROADSIDE'
                                                ? 'Dispatch equipped emergency mobile unit directly to your breakdown GPS coordinates.'
                                                : `Drive into certified partner service bay (${q?.provider.bayLabel ?? 'partner bay'} reserved for 45 mins).`}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-full rounded-xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Icon name="fmd_bad" fill className="text-primary text-[20px]" />
                                <span className="font-title-md text-title-md text-on-surface">Rescue Target Spot</span>
                            </div>
                            <button
                                type="button"
                                onClick={checkout.locate}
                                className="inline-flex items-center gap-1 text-primary font-label-md text-label-md font-bold px-2 py-1 rounded bg-surface-container active:scale-95 transition-transform"
                            >
                                <Icon name="edit_location_alt" className="text-[16px]" />
                                Re-pin GPS
                            </button>
                        </div>
                        {location.kind === 'ready' ? (
                            <MapSnapshot tile={location.location.map} label={`Map of ${location.location.label}`} className="w-full h-36 rounded-lg shadow-inner">
                                <div className="absolute bottom-2 left-2 right-2 rounded-md bg-inverse-surface/90 backdrop-blur-md p-2 flex items-center justify-between text-inverse-on-surface shadow-md">
                                    <div className="flex flex-col min-w-0 pr-2">
                                        <span className="font-title-md text-[13px] leading-tight truncate text-inverse-on-surface font-semibold">{location.location.label}</span>
                                        <span className="font-code-xs text-code-xs text-inverse-primary truncate">
                                            Lat: {location.location.lat.toFixed(4)}° • Long: {location.location.lng.toFixed(4)}°
                                            {location.approximate ? ' (approx.)' : location.location.accuracyM ? ` (±${location.location.accuracyM}m)` : ''}
                                        </span>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <Icon name="navigation" className="text-on-primary text-[16px] animate-bounce" />
                                    </div>
                                </div>
                            </MapSnapshot>
                        ) : (
                            <div className="w-full h-36 rounded-lg bg-surface-container flex items-center justify-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                                <Icon name={location.kind === 'locating' ? 'sync' : 'location_off'} className={cn('text-[20px]', location.kind === 'locating' && 'animate-spin')} />
                                {location.kind === 'locating' ? 'Locating your breakdown spot…' : "Couldn't get your location — tap Re-pin GPS."}
                            </div>
                        )}
                        <Err message={errors.location} />
                    </div>

                    <div id="symptoms" className="w-full rounded-xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="font-title-md text-title-md text-on-surface flex items-center gap-1.5" htmlFor="symptoms-input">
                                <Icon name="assignment_late" className="text-[18px] text-secondary" />
                                Vehicle Symptoms &amp; Safe Spot Notes
                            </label>
                            <span className="font-code-xs text-code-xs text-outline shrink-0">Mechanic Brief</span>
                        </div>
                        <textarea
                            id="symptoms-input"
                            value={checkout.notes}
                            onChange={(e) => checkout.setNotes(e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="e.g. Car clicked and stopped cranking on the shoulder. Hazard lights flashing."
                            className="w-full rounded-lg bg-surface-container-low p-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-inner transition-colors resize-none"
                        />
                        <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
                            <span className="flex items-center gap-1">
                                <Icon name="security" className="text-[14px] text-primary" />
                                High-visibility emergency beacon en-route
                            </span>
                            <span className="font-code-xs text-code-xs text-outline">{checkout.notes.length} chars</span>
                        </div>
                    </div>

                    {q && (
                        <div className="w-full rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center justify-between pb-2">
                                <span className="font-title-md text-title-md text-on-surface">Itemized Rescue Invoice</span>
                                <span className="font-code-xs text-code-xs px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">Taxes Included</span>
                            </div>
                            {q.lines.map((l, i) => (
                                <div key={l.id} className="flex items-start justify-between gap-2">
                                    <div className="flex flex-col min-w-0">
                                        <span className={cn('font-body-md text-body-md text-on-surface truncate', i === 0 && 'font-semibold')}>{l.title}</span>
                                        <span className="font-code-xs text-code-xs text-on-surface-variant">
                                            {l.code} • {l.note.label}
                                        </span>
                                    </div>
                                    <span className={cn('font-code-sm text-code-sm text-on-surface whitespace-nowrap', i === 0 ? 'font-bold' : 'font-semibold')}>
                                        {formatMoney(l.amount)}
                                    </span>
                                </div>
                            ))}
                            {q.fees.map((f) => (
                                <div key={f.id} className="flex items-start justify-between gap-2">
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
                                            {f.shortLabel}
                                            {f.id === 'ESCROW' && <Icon name="verified_user" className="text-[15px] text-primary" />}
                                        </span>
                                        {f.id === 'TRAVEL' && <span className="font-code-xs text-code-xs text-on-surface-variant">{f.description}</span>}
                                    </div>
                                    <span className="font-code-sm text-code-sm text-on-surface font-semibold whitespace-nowrap">{formatMoney(f.amount)}</span>
                                </div>
                            ))}
                            <div className="pt-3 mt-1 bg-surface-container-low p-3 rounded-lg flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-title-md text-title-md text-on-surface font-bold">Total Authorized Hold</span>
                                    <span className="font-code-xs text-code-xs text-on-surface-variant">Released only after your sign-off</span>
                                </div>
                                <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight whitespace-nowrap">{formatMoney(q.total)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-0.5">
                            <span className="font-title-md text-title-md text-on-surface">Payment Method</span>
                            <span className="font-label-md text-label-md text-outline">Funds locked in escrow</span>
                        </div>
                        {PAYMENT_OPTIONS.map((p) => {
                            const active = payment === p.id;
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setPayment(p.id)}
                                    className={cn(
                                        'w-full rounded-xl p-3.5 flex items-center justify-between text-left transition-all',
                                        active ? 'bg-surface-container-lowest shadow-md' : 'bg-surface-container-low shadow-sm opacity-80',
                                    )}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={cn(
                                                'w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0',
                                                active ? 'text-primary' : 'text-on-surface-variant',
                                            )}
                                        >
                                            <Icon name={p.icon} fill={active} className="text-[22px]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={cn('font-title-md text-title-md text-on-surface', active && 'font-bold')}>{p.id === 'CARD' ? 'Credit / Debit Card' : p.title}</span>
                                                {p.tag && <span className="bg-surface-container text-primary font-code-xs text-code-xs px-1.5 rounded font-semibold">{p.tag}</span>}
                                            </div>
                                            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                                                {p.id === 'MPESA' ? `${p.mobileBody} ${maskedPhone}` : p.mobileBody}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0', active ? 'bg-primary text-on-primary' : 'bg-surface-container-highest')}>
                                        <Icon name="check" className={cn('text-[16px]', !active && 'text-transparent')} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-full rounded-xl bg-surface-container-high/80 p-3.5 flex items-start gap-3 shadow-sm mb-2">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary">
                            <Icon name="verified_user" fill className="text-[20px]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-title-md text-[14px] text-on-surface font-bold">100% Escrow Motorist Shield</span>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                                Funds are held safely in escrow and only released to the field mechanic after you confirm your engine starts and sign off with
                                your 4-digit token.
                            </p>
                        </div>
                    </div>
                    {errors.form && (
                        <p role="alert" className="rounded-lg bg-error-container px-space-md py-space-sm font-body-sm text-body-sm text-on-error-container">
                            {errors.form}
                        </p>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl p-gutter pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex flex-col gap-2 max-w-md mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-outline uppercase font-semibold">Total Breakdown Due</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">{q ? formatMoney(q.total) : '--'}</span>
                                <span className="font-code-xs text-code-xs text-on-surface-variant">VAT incl.</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-primary bg-surface-container px-2 py-1 rounded">
                            <Icon name="autorenew" className="text-[16px] animate-spin" />
                            <span className="font-code-xs text-code-xs font-bold uppercase">Hero Ready</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={checkout.submitting || !q}
                        className="w-full h-14 rounded-lg bg-primary text-on-primary flex items-center justify-center gap-2 font-headline-sm text-[17px] leading-tight whitespace-nowrap font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-70"
                    >
                        <span>{checkout.submitting ? 'Dispatching…' : mode === 'ROADSIDE' ? 'Confirm & Dispatch Mechanic Now' : 'Confirm & Reserve Bay'}</span>
                        <Icon name="bolt" fill className="text-[22px] text-secondary-fixed animate-pulse" />
                    </button>
                </div>
            </form>
        </>
    );
}
