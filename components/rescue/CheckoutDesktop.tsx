'use client';

import Link from 'next/link';
import { Icon } from '@/components/brand/Icon';
import { MapSnapshot } from '@/components/map/MapSnapshot';
import type { PaymentMethod } from '@/lib/api/rescue';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Checkout, CheckoutFields } from './useCheckout';

const inputClass =
    'w-full bg-surface-container-lowest px-space-md py-2.5 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm';
const vehicleInput = 'w-full bg-surface-container px-space-sm py-2 rounded-xl font-body-md text-body-md text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container';

export const PAYMENT_OPTIONS: { id: PaymentMethod; title: string; body: string; mobileBody: string; icon: string; tag?: string }[] = [
    { id: 'MPESA', title: 'M-PESA Express', body: 'Instant STK push notification to your phone.', mobileBody: 'Instant prompt to', icon: 'phone_android', tag: 'STK Push' },
    { id: 'CARD', title: 'Card Payment', body: 'Visa, Mastercard, AMEX with 3DS Verification.', mobileBody: 'Visa, Mastercard, 3D Secure', icon: 'credit_card' },
    { id: 'ON_ARRIVAL', title: 'Pay On Arrival', body: 'Card / M-Pesa terminal held by mechanic at scene.', mobileBody: 'Technician mobile handheld POS unit', icon: 'point_of_sale' },
];

function FieldError({ message }: { message?: string }) {
    return message ? <p className="font-body-sm text-body-sm text-tertiary">{message}</p> : null;
}

export function Stepper({ step }: { step: 1 | 2 }) {
    const steps = [
        { icon: 'directions_car', label: '1. Vehicle & Location', caption: step === 1 ? 'Active' : 'Done' },
        { icon: 'engineering', label: '2. Service Mode', caption: 'Automated' },
        { icon: 'verified_user', label: '3. Escrow & Dispatch', caption: 'Pending' },
    ];
    return (
        <div className="w-full bg-surface-container py-space-md">
            <div className="max-w-4xl mx-auto px-gutter lg:px-gutter-lg">
                <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-surface-variant rounded-full" />
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-container rounded-full transition-all"
                        style={{ width: step === 1 ? '50%' : '75%' }}
                    />
                    {steps.map((s, i) => {
                        const reached = i < 2;
                        const current = (step === 1 && i === 0) || (step === 2 && i === 1);
                        return (
                            <div key={s.label} className="flex flex-col items-center relative z-10">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center font-code-sm text-code-sm',
                                        reached ? 'bg-primary-container text-on-primary shadow-md' : 'bg-surface-container-highest text-on-surface-variant',
                                    )}
                                >
                                    <Icon name={s.icon} className="text-[20px]" />
                                </div>
                                <span
                                    className={cn(
                                        'mt-space-xs font-label-md text-label-md',
                                        current ? 'text-primary font-bold' : reached ? 'text-on-surface font-semibold' : 'text-on-surface-variant',
                                    )}
                                >
                                    {s.label}
                                </span>
                                <span
                                    className={cn(
                                        'font-code-xs text-code-xs mt-0.5',
                                        current ? 'text-primary bg-primary-fixed px-space-xs rounded-full' : 'text-on-surface-variant',
                                    )}
                                >
                                    {current ? 'Active' : s.caption}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function CheckoutDesktop({ checkout }: { checkout: Checkout }) {
    const { fields, set, errors, quote, location, mode, setMode, payment, setPayment } = checkout;
    const q = quote.data;
    const input = (key: keyof CheckoutFields) => ({ value: fields[key], onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value) });

    return (
        <div className="flex flex-col w-full">
            <div className="w-full bg-surface-container-low py-space-md">
                <div className="max-w-7xl mx-auto px-gutter lg:px-gutter-lg flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary">
                            <Icon name="bolt" className="text-[18px]" />
                        </span>
                        <div>
                            <h1 className="font-headline-sm text-headline-sm text-on-surface">Express Rescue &amp; Checkout</h1>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Instant roadside dispatch &amp; verified spare parts procurement</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                        <span className="font-code-xs text-code-xs text-on-surface font-semibold uppercase tracking-wider">
                            Average Dispatch Response: <span className="text-secondary font-bold">{q ? `${q.avgDispatchMinutes} Mins` : '--'}</span>
                        </span>
                    </div>
                </div>
            </div>

            <Stepper step={checkout.step as 1 | 2} />

            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    void checkout.submit();
                }}
                className="max-w-7xl mx-auto px-gutter lg:px-gutter-lg py-space-xl w-full"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                    <div className="lg:col-span-7 flex flex-col gap-space-lg">
                        {!checkout.signedIn && (
                            <div className="bg-primary-fixed/40 p-space-md rounded-xl flex items-center justify-between gap-space-md shadow-sm">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
                                        <Icon name="person_pin" className="text-[20px]" />
                                    </div>
                                    <div>
                                        <span className="font-label-lg text-label-lg text-primary font-bold">Express Guest Motorist Checkout</span>
                                        <p className="font-body-sm text-body-sm text-on-surface">No account required. Instant rescue link will be texted to your phone.</p>
                                    </div>
                                </div>
                                <Link
                                    className="font-label-md text-label-md text-primary font-semibold underline underline-offset-2 flex-shrink-0"
                                    href="/auth/signin?callbackUrl=/rescue"
                                >
                                    Log in
                                </Link>
                            </div>
                        )}

                        <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-xs">
                                    <Icon name="contact_phone" className="text-primary text-[22px]" />
                                    <h3 className="font-title-lg text-title-lg text-on-surface">Motorist Contact Details</h3>
                                </div>
                                <span className="font-code-xs text-code-xs text-on-surface-variant uppercase tracking-wider">SMS Live Tracking</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                                <div className="flex flex-col gap-space-xs">
                                    <label htmlFor="co-name" className="font-label-md text-label-md text-on-surface font-medium">
                                        Full Name <span className="text-tertiary">*</span>
                                    </label>
                                    <input id="co-name" autoComplete="name" className={inputClass} placeholder="e.g. David Mwangi" type="text" {...input('fullName')} />
                                    <FieldError message={errors.fullName} />
                                </div>
                                <div className="flex flex-col gap-space-xs">
                                    <label htmlFor="co-phone" className="font-label-md text-label-md text-on-surface font-medium">
                                        Phone (for Rescue Mechanic WhatsApp/SMS) <span className="text-tertiary">*</span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 font-code-xs text-code-xs text-on-surface-variant font-bold">+254</span>
                                        <input
                                            id="co-phone"
                                            autoComplete="tel-national"
                                            inputMode="numeric"
                                            className={cn(inputClass, 'pl-14')}
                                            placeholder="712 345 678"
                                            type="tel"
                                            {...input('phone')}
                                        />
                                    </div>
                                    <FieldError message={errors.phone} />
                                </div>
                                <div className="sm:col-span-2 flex flex-col gap-space-xs">
                                    <label htmlFor="co-email" className="font-label-md text-label-md text-on-surface font-medium">
                                        Email Address (for Escrow &amp; Parts Receipt) <span className="text-tertiary">*</span>
                                    </label>
                                    <input id="co-email" autoComplete="email" className={inputClass} placeholder="youremail@domain.com" type="email" {...input('email')} />
                                    <FieldError message={errors.email} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-xs">
                                    <Icon name="car_repair" className="text-primary text-[22px]" />
                                    <h3 className="font-title-lg text-title-lg text-on-surface">Vehicle Identification</h3>
                                </div>
                                <span className="bg-primary-fixed text-on-primary-fixed px-space-xs py-0.5 rounded-md font-code-xs text-code-xs font-semibold">
                                    100% Fitment Match
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
                                {(
                                    [
                                        ['make', 'Make', 'Toyota'],
                                        ['model', 'Model', 'Prado TX'],
                                        ['year', 'Year', '2019'],
                                    ] as const
                                ).map(([key, label, ph]) => (
                                    <div key={key} className="flex flex-col gap-space-xs">
                                        <label htmlFor={`co-${key}`} className="font-label-md text-label-md text-on-surface font-medium">
                                            {label}
                                        </label>
                                        <input
                                            id={`co-${key}`}
                                            className={vehicleInput}
                                            placeholder={ph}
                                            inputMode={key === 'year' ? 'numeric' : undefined}
                                            type="text"
                                            {...input(key)}
                                        />
                                        <FieldError message={errors[key]} />
                                    </div>
                                ))}
                                <div className="flex flex-col gap-space-xs">
                                    <label htmlFor="co-plate" className="font-label-md text-label-md text-on-surface font-medium">
                                        Reg / Plate No
                                    </label>
                                    <input
                                        id="co-plate"
                                        className="w-full bg-surface-container-high px-space-sm py-2 rounded-xl font-code-sm text-code-sm text-primary font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary-container placeholder:normal-case placeholder:font-medium"
                                        placeholder="KDA 482B"
                                        type="text"
                                        {...input('plate')}
                                    />
                                    <FieldError message={errors.plate} />
                                </div>
                            </div>
                        </section>

                        <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-xs">
                                    <Icon name="pin_drop" className="text-tertiary text-[22px]" />
                                    <h3 className="font-title-lg text-title-lg text-on-surface">Service Delivery Mode &amp; Location</h3>
                                </div>
                                <span className="flex items-center gap-1 font-code-xs text-code-xs text-tertiary font-bold">
                                    <span className={cn('w-2 h-2 rounded-full bg-tertiary', location.kind !== 'failed' && 'animate-ping')} />
                                    {location.kind === 'locating' ? 'Pinning Location…' : location.kind === 'ready' && !location.approximate ? 'Live Pinning Active' : 'Approximate Pin'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm" role="radiogroup" aria-label="Service delivery mode">
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={mode === 'ROADSIDE'}
                                    onClick={() => setMode('ROADSIDE')}
                                    className={cn(
                                        'flex items-start gap-space-sm p-space-md rounded-xl text-left transition-all',
                                        mode === 'ROADSIDE' ? 'bg-surface-container-high shadow-sm' : 'bg-surface-container-low hover:bg-surface-container opacity-80',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                            mode === 'ROADSIDE' ? 'bg-tertiary text-on-tertiary' : 'bg-surface-variant text-on-surface-variant',
                                        )}
                                    >
                                        <Icon name="near_me" className="text-[18px]" />
                                    </div>
                                    <div>
                                        <span className="font-title-md text-title-md text-on-surface flex items-center gap-1">
                                            Roadside Rescue
                                            <span className="bg-tertiary-fixed text-tertiary font-code-xs text-code-xs px-1.5 py-0.5 rounded-full font-bold">Express</span>
                                        </span>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Send mechanic &amp; parts directly to your GPS breakdown spot.</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={mode === 'IN_SHOP'}
                                    onClick={() => setMode('IN_SHOP')}
                                    className={cn(
                                        'flex items-start gap-space-sm p-space-md rounded-xl text-left transition-all',
                                        mode === 'IN_SHOP' ? 'bg-surface-container-high shadow-sm' : 'bg-surface-container-low hover:bg-surface-container opacity-80',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                            mode === 'IN_SHOP' ? 'bg-primary-container text-on-primary' : 'bg-surface-variant text-on-surface-variant',
                                        )}
                                    >
                                        <Icon name="storefront" className="text-[18px]" />
                                    </div>
                                    <div>
                                        <span className="font-title-md text-title-md text-on-surface">In-Shop Garage Bay</span>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                            Drive car into {q?.provider.bayLabel ?? 'the partner workshop bay'}.
                                        </p>
                                    </div>
                                </button>
                            </div>

                            {location.kind === 'ready' ? (
                                <MapSnapshot tile={location.location.map} label={`Map of ${location.location.label}`} className="w-full h-52 rounded-xl shadow-sm">
                                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/30 to-transparent p-space-md flex flex-col justify-end text-on-primary">
                                        <div className="flex items-center justify-between gap-space-sm">
                                            <div className="flex items-center gap-space-xs">
                                                <Icon name="crisis_alert" className="text-secondary text-[24px]" />
                                                <div>
                                                    <h4 className="font-title-md text-title-md font-bold">{location.location.label}</h4>
                                                    <p className="font-body-sm text-body-sm text-inverse-on-surface">{location.location.detail}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={checkout.locate}
                                                title="Re-pin my GPS location"
                                                className="bg-surface/20 backdrop-blur-md px-space-sm py-1 rounded font-code-xs text-code-xs hover:bg-surface/30 transition-colors"
                                            >
                                                {Math.abs(location.location.lat).toFixed(4)}° {location.location.lat < 0 ? 'S' : 'N'},{' '}
                                                {Math.abs(location.location.lng).toFixed(4)}° {location.location.lng < 0 ? 'W' : 'E'}
                                            </button>
                                        </div>
                                    </div>
                                </MapSnapshot>
                            ) : (
                                <div className="w-full h-52 rounded-xl bg-surface-container flex flex-col items-center justify-center gap-space-xs text-on-surface-variant">
                                    <Icon name={location.kind === 'locating' ? 'sync' : 'location_off'} className={cn('text-[28px]', location.kind === 'locating' && 'animate-spin')} />
                                    <span className="font-body-md text-body-md">{location.kind === 'locating' ? 'Locating your breakdown spot…' : "We couldn't get your location."}</span>
                                    {location.kind === 'failed' && (
                                        <button type="button" onClick={checkout.locate} className="font-label-lg text-label-lg text-primary hover:underline">
                                            Try again
                                        </button>
                                    )}
                                </div>
                            )}
                            <FieldError message={errors.location} />

                            <div className="flex flex-col gap-space-xs" id="symptoms">
                                <label htmlFor="co-notes" className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
                                    <span>Mechanic Access Note / Vehicle Symptoms</span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">Visible to dispatched technician</span>
                                </label>
                                <textarea
                                    id="co-notes"
                                    value={checkout.notes}
                                    onChange={(e) => checkout.setNotes(e.target.value)}
                                    className="w-full bg-surface-container px-space-md py-space-xs rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-container"
                                    rows={2}
                                    maxLength={500}
                                    placeholder="e.g. Car suddenly clicked and stopped cranking on road shoulder. Hazard lights are flashing."
                                />
                            </div>
                        </section>

                        <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-xs">
                                    <Icon name="lock" className="text-primary text-[22px]" />
                                    <h3 className="font-title-lg text-title-lg text-on-surface">Secured Escrow Payment Method</h3>
                                </div>
                                <span className="font-code-xs text-code-xs text-secondary-container font-bold uppercase tracking-wider bg-secondary-fixed/50 px-2 py-0.5 rounded">
                                    Safe Escrow Protected
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                                {PAYMENT_OPTIONS.map((p) => (
                                    <label
                                        key={p.id}
                                        className={cn(
                                            'flex flex-col p-space-md rounded-xl cursor-pointer transition-all',
                                            payment === p.id ? 'bg-surface-container-high shadow-sm' : 'bg-surface-container-low hover:bg-surface-container',
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-title-md text-title-md text-on-surface font-bold">{p.title}</span>
                                            <input
                                                checked={payment === p.id}
                                                onChange={() => setPayment(p.id)}
                                                className="accent-primary"
                                                name="payment_method"
                                                type="radio"
                                            />
                                        </div>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">{p.body}</p>
                                        {p.id === 'MPESA' && (
                                            <div className="mt-space-sm flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="font-code-xs text-code-xs text-primary font-semibold">Recommended in East Africa</span>
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-space-md lg:sticky lg:top-24">
                        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
                            {q ? (
                                <>
                                    <div className="bg-surface-container p-space-md rounded-xl flex items-center gap-space-md">
                                        <div className="w-12 h-12 rounded-xl bg-surface-container-highest overflow-hidden flex-shrink-0 shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img className="w-full h-full object-cover" alt={`${q.provider.name} workshop`} src={q.provider.image} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="font-code-xs text-code-xs uppercase tracking-wider text-on-surface-variant font-bold">
                                                {mode === 'ROADSIDE' ? 'Dispatched Workshop Bay' : 'Reserved Workshop Bay'}
                                            </span>
                                            <h4 className="font-title-md text-title-md text-on-surface font-bold truncate">{q.provider.name}</h4>
                                            <div className="flex items-center gap-space-xs mt-0.5">
                                                <Icon name="star" className="text-secondary text-[16px]" />
                                                <span className="font-code-sm text-code-sm font-bold text-on-surface">{q.provider.rating.toFixed(2)}</span>
                                                <span className="font-body-sm text-body-sm text-on-surface-variant">({q.provider.jobsCompleted} rescues)</span>
                                                <span className="text-on-surface-variant text-xs">•</span>
                                                <span className="font-body-sm text-body-sm text-primary font-semibold">{q.provider.distanceKm} km away</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pb-space-xs">
                                        <h3 className="font-title-lg text-title-lg text-on-surface">Cart &amp; Rescue Order</h3>
                                        <span className="bg-surface-container px-2 py-0.5 rounded-full font-code-xs text-code-xs font-bold text-on-surface-variant">
                                            {q.lines.length} {q.lines.length === 1 ? 'Item' : 'Items'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-space-sm">
                                        {q.lines.map((l) => (
                                            <div key={l.id} className="flex items-start gap-space-sm p-space-sm rounded-xl bg-surface-container-low">
                                                <div className="w-14 h-14 rounded-lg bg-surface-container-lowest overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center text-primary">
                                                    {l.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img className="w-full h-full object-cover" alt={l.title} src={l.image} />
                                                    ) : (
                                                        <Icon name={l.icon ?? 'handyman'} className="text-[28px]" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-1">
                                                        <h5 className="font-title-md text-title-md text-on-surface font-bold truncate">{l.title}</h5>
                                                        <span className="font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">{formatMoney(l.amount)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-space-xs mt-0.5">
                                                        <span className="font-code-xs text-code-xs bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded">{l.code}</span>
                                                        <span className={cn('font-code-xs text-code-xs font-medium', l.note.tone === 'amber' ? 'text-secondary' : 'text-primary')}>
                                                            {l.note.label}
                                                        </span>
                                                    </div>
                                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">{l.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-space-xs pt-space-xs">
                                        <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                                            <span>Subtotal (Parts &amp; Labor)</span>
                                            <span className="font-code-sm text-code-sm text-on-surface font-semibold">{formatMoney(q.subtotal)}</span>
                                        </div>
                                        {q.fees.map((f) => (
                                            <div key={f.id} className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                                                <span className="flex items-center gap-1" title={f.description}>
                                                    <span>{f.label}</span>
                                                    <Icon name={f.id === 'TRAVEL' ? 'info' : 'verified'} className="text-[14px]" />
                                                </span>
                                                <span className="font-code-sm text-code-sm text-on-surface font-semibold">{formatMoney(f.amount)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-baseline pt-space-sm mt-space-xs">
                                            <span className="font-title-lg text-title-lg text-on-surface font-bold">Total Pay Amount</span>
                                            <div className="text-right">
                                                <span className="font-headline-lg text-headline-lg text-primary font-bold">{formatMoney(q.total)}</span>
                                                <span className="block font-code-xs text-code-xs text-on-surface-variant">VAT inclusive • Held in escrow</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-surface-container-high p-space-md rounded-xl flex items-start gap-space-sm">
                                        <Icon name="gavel" className="text-primary text-[24px] flex-shrink-0" />
                                        <div className="text-left">
                                            <h6 className="font-label-lg text-label-lg text-on-surface font-bold">Safe Escrow Protection</h6>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                                Funds are held in neutral escrow. {q.provider.name.split(' ')[0]} mechanic is only paid once your car starts and you sign
                                                off the digital delivery token.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-space-sm animate-pulse" aria-label="Loading your quote">
                                    <div className="h-20 rounded-xl bg-surface-container" />
                                    <div className="h-6 w-1/2 rounded bg-surface-container" />
                                    <div className="h-20 rounded-xl bg-surface-container-low" />
                                    <div className="h-20 rounded-xl bg-surface-container-low" />
                                    <div className="h-10 rounded bg-surface-container" />
                                </div>
                            )}

                            {errors.form && (
                                <p role="alert" className="rounded-lg bg-error-container px-space-md py-space-sm font-body-sm text-body-sm text-on-error-container">
                                    {errors.form}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={checkout.submitting || !q}
                                className="w-full relative group overflow-hidden bg-primary-container text-on-primary py-space-md px-space-lg rounded-xl font-headline-sm text-headline-sm font-bold shadow-lg hover:bg-primary transition-all flex items-center justify-center gap-space-sm disabled:opacity-70"
                            >
                                <span className="relative z-10 flex items-center gap-space-xs">
                                    <span className={cn('w-3 h-3 rounded-full bg-secondary-container', !checkout.submitting && 'animate-ping')} />
                                    <span>
                                        {checkout.submitting ? 'Dispatching…' : mode === 'ROADSIDE' ? 'Confirm & Dispatch Mechanic Now' : 'Confirm & Reserve Workshop Bay'}
                                    </span>
                                </span>
                                {q && (
                                    <span className="relative z-10 font-code-sm text-code-sm bg-primary-fixed text-on-primary-fixed px-space-xs py-1 rounded ml-1 font-extrabold whitespace-nowrap">
                                        {formatMoney(q.total)}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-space-lg text-center pt-space-xs">
                                <div className="flex items-center gap-1 font-code-xs text-code-xs text-on-surface-variant">
                                    <Icon name="verified_user" className="text-[16px] text-primary" />
                                    <span>256-bit SSL</span>
                                </div>
                                <div className="flex items-center gap-1 font-code-xs text-code-xs text-on-surface-variant">
                                    <Icon name="speed" className="text-[16px] text-secondary" />
                                    <span>{q?.etaTargetMinutes ?? 15} Min ETA Target</span>
                                </div>
                                <div className="flex items-center gap-1 font-code-xs text-code-xs text-on-surface-variant">
                                    <Icon name="support_agent" className="text-[16px] text-tertiary" />
                                    <span>24/7 Hotline</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container p-space-md rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-space-xs">
                                <Icon name="phone_in_talk" className="text-tertiary text-[20px]" />
                                <span className="font-label-md text-label-md text-on-surface font-semibold">Immediate Hotline Assistance</span>
                            </div>
                            <a className="font-code-sm text-code-sm text-tertiary font-bold hover:underline" href={`tel:${q?.hotline.tel ?? '0800720000'}`}>
                                {q?.hotline.display ?? '0800 720 000 (Toll Free)'}
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
