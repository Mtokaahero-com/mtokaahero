'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Icon } from '@/components/brand/Icon';
import { MapSnapshot } from '@/components/map/MapSnapshot';
import { useApi } from '@/hooks/use-api';
import type { OrganizationType } from '@/lib/api/account';
import { partnersApi } from '@/lib/api/partners';
import { ApiError } from '@/lib/api/problem';
import { rescueApi, type ResolvedLocation } from '@/lib/api/rescue';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

const DRAFT_KEY = 'mtokaa.partner-draft';

interface Draft {
    type: OrganizationType;
    businessName: string;
    taxPin: string;
    bays: number;
    vans: number;
    address: string;
    capabilityIds: string[];
    radiusKm: number;
    mobileMoney: string;
    bankAccount: string;
}

const EMPTY: Draft = {
    type: 'GARAGE',
    businessName: '',
    taxPin: '',
    bays: 2,
    vans: 1,
    address: '',
    capabilityIds: ['diagnostics', 'rescue'],
    radiusKm: 25,
    mobileMoney: '',
    bankAccount: '',
};

const schema = z
    .object({
        businessName: z.string().trim().min(2, 'Enter your registered business name').max(120),
        taxPin: z.string().trim().regex(/^[AP]\d{9}[A-Z]$/i, 'Enter a KRA PIN like P051892341M'),
        address: z.string().trim().min(5, 'Enter the physical bay address'),
        capabilityIds: z.array(z.string()).min(1, 'Select at least one capability'),
        mobileMoney: z.string().trim(),
        bankAccount: z.string().trim(),
    })
    .refine((d) => d.mobileMoney || d.bankAccount, { path: ['mobileMoney'], message: 'Add a mobile money or bank payout route' });

type Errors = Partial<Record<'businessName' | 'taxPin' | 'address' | 'capabilityIds' | 'mobileMoney' | 'form', string>>;

const ADV_TONE = {
    primary: 'bg-primary/10 text-primary',
    amber: 'bg-secondary/10 text-secondary',
    tint: 'bg-surface-tint/10 text-surface-tint',
    rescue: 'bg-tertiary/10 text-tertiary',
} as const;

function readDraft(): Partial<Draft> {
    try {
        return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}') as Partial<Draft>;
    } catch {
        return {};
    }
}

function Counter({ label, hint, value, onChange }: { label: string; hint: string; value: number; onChange: (n: number) => void }) {
    return (
        <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between">
            <div>
                <div className="font-label-lg text-label-lg text-on-surface">{label}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">{hint}</div>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest px-2 py-1 rounded-lg shadow-sm">
                <button type="button" aria-label={`Fewer ${label}`} onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container font-headline-sm">
                    -
                </button>
                <span className="w-8 text-center font-code-sm text-code-sm font-semibold text-primary" aria-live="polite">
                    {value}
                </span>
                <button type="button" aria-label={`More ${label}`} onClick={() => onChange(Math.min(99, value + 1))} className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container font-headline-sm">
                    +
                </button>
            </div>
        </div>
    );
}

function Err({ message }: { message?: string }) {
    return message ? <p className="font-body-sm text-body-sm text-error">{message}</p> : null;
}

export function OnboardingPortal() {
    const router = useRouter();
    const params = useSearchParams();
    const { data: session } = useSession();
    const program = useApi('partner-program', partnersApi.program);
    const p = program.data;

    const [draft, setDraft] = useState<Draft>(() => ({ ...EMPTY, type: params.get('type') === 'MOBILE_MECHANIC' ? 'MOBILE_MECHANIC' : 'GARAGE' }));
    const [files, setFiles] = useState<File[]>([]);
    const [location, setLocation] = useState<ResolvedLocation | null>(null);
    const [locating, setLocating] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState<{ name: string } | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const sections = { 1: useRef<HTMLElement>(null), 2: useRef<HTMLElement>(null), 3: useRef<HTMLElement>(null) };

    useEffect(() => setDraft((d) => ({ ...d, ...readDraft(), type: params.get('type') === 'MOBILE_MECHANIC' ? 'MOBILE_MECHANIC' : (readDraft().type ?? d.type) })), [params]);

    const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
        setDraft((d) => ({ ...d, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
    };

    const step1Done = Boolean(draft.businessName.trim() && draft.taxPin.trim() && draft.address.trim());
    const step2Done = step1Done && draft.capabilityIds.length > 0;
    const activeStep = !step1Done ? 1 : !step2Done ? 2 : 3;

    const saveDraft = (quiet = false) => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
            if (!quiet) toast.success('Application draft saved on this device');
        } catch {
            if (!quiet) toast.error('Could not save the draft in this browser');
        }
    };

    const pinLocation = () => {
        setLocating(true);
        const fallback = { lat: -1.286389, lng: 36.817223 };
        const done = (pt: { lat: number; lng: number }) =>
            rescueApi
                .reverseGeocode(pt)
                .then(setLocation)
                .finally(() => setLocating(false));
        if (!('geolocation' in navigator)) return void done(fallback);
        navigator.geolocation.getCurrentPosition(
            (pos) => void done({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => void done(fallback),
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    const submit = async () => {
        const parsed = schema.safeParse(draft);
        if (!parsed.success) {
            const next: Errors = {};
            for (const issue of parsed.error.issues) next[issue.path[0] as keyof Errors] ??= issue.message;
            setErrors(next);
            const first = next.businessName || next.taxPin || next.address ? 1 : next.capabilityIds ? 2 : 3;
            sections[first as 1 | 2 | 3].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (!session) {
            saveDraft(true);
            router.push('/auth/signup?callbackUrl=/partners');
            return;
        }
        if (!session.user.emailVerified) {
            setErrors({ form: 'Verify your email first — use the link we sent you, or Resend from the banner at the top.' });
            return;
        }

        setSubmitting(true);
        try {
            const fresh = await getSession();
            const token = fresh?.user.accessToken;
            if (!token || fresh?.error) throw new Error('Your session expired. Sign in again to submit.');
            const org = await partnersApi.createOrganization(
                {
                    name: draft.businessName.trim(),
                    type: draft.type,
                    addressLine: draft.address.trim(),
                    city: 'Nairobi',
                    contactPhone: session.user.phone ?? undefined,
                },
                token,
            );
            const docs = await Promise.all(files.map((f) => partnersApi.uploadDocument(f, token)));
            await partnersApi.submit(
                {
                    organizationId: org.id,
                    type: draft.type,
                    taxPin: draft.taxPin.trim().toUpperCase(),
                    bays: draft.bays,
                    vans: draft.vans,
                    address: draft.address.trim(),
                    location: location ? { lat: location.lat, lng: location.lng } : null,
                    capabilityIds: draft.capabilityIds,
                    radiusKm: draft.radiusKm,
                    documentIds: docs.map((d) => d.id),
                    payout: { mobileMoney: draft.mobileMoney.trim(), bankAccount: draft.bankAccount.trim() },
                },
                token,
            );
            try {
                localStorage.removeItem(DRAFT_KEY);
            } catch {
                // ignore
            }
            setDone({ name: org.name });
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.code === 'EMAIL_NOT_VERIFIED'
                        ? 'Verify your email before registering a business.'
                        : err.message
                    : err instanceof Error
                      ? err.message
                      : 'Submission failed. Try again.';
            setErrors({ form: message });
        } finally {
            setSubmitting(false);
        }
    };

    const roleTab = (active: boolean) =>
        cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-lg text-label-lg transition-all',
            active ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
        );

    const stepTab = (n: 1 | 2 | 3, title: string) => {
        const active = activeStep === n;
        const complete = activeStep > n;
        return (
            <button
                type="button"
                onClick={() => sections[n].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={cn('flex items-center gap-3 text-left p-2 rounded-lg transition-all', active ? 'bg-surface-container-low' : 'hover:bg-surface-container-low')}
                aria-current={active ? 'step' : undefined}
            >
                <span
                    className={cn(
                        'w-8 h-8 rounded-md flex items-center justify-center font-code-sm text-code-sm font-semibold shrink-0',
                        active || complete ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant',
                    )}
                >
                    {complete ? <Icon name="check" className="text-[18px]" /> : n}
                </span>
                <div className="min-w-0">
                    <span className={cn('block font-code-xs text-code-xs font-semibold uppercase', active ? 'text-primary' : 'text-on-surface-variant')}>Step 0{n}</span>
                    <span className="block font-label-md text-label-md text-on-surface truncate">{title}</span>
                </div>
            </button>
        );
    };

    const fieldBox = 'flex items-center gap-2 bg-surface-container-low px-3.5 py-2.5 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface-container-lowest transition-all';

    if (done) {
        return (
            <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-xl shadow-sm p-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                    <Icon name="verified" fill className="text-[32px]" />
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{done.name} is registered</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                    Your verification documents are in review. You can set up your catalogue and start accepting rescues from your shop dashboard now.
                </p>
                <Link
                    href="/dashboard/garage"
                    className="px-8 py-3.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container flex items-center gap-2"
                >
                    Open Shop Dashboard <Icon name="arrow_forward" className="text-[20px]" />
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-7xl mx-auto pb-space-xl">
            <div className="w-full bg-surface-container-low rounded-xl p-6 lg:p-8 mb-space-lg shadow-sm relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/5 rounded-full pointer-events-none blur-3xl" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-code-xs text-code-xs tracking-wider uppercase">Official Partner Portal</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight max-sm:text-headline-lg-mobile">Join the MtokaaHero Network</h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                            Accelerate your garage bookings, process automated escrow payouts, and dispatch roadside rescues effortlessly.
                        </p>
                    </div>
                    <div className="inline-flex flex-wrap lg:flex-nowrap lg:shrink-0 p-1.5 bg-surface-container rounded-xl shadow-inner self-start lg:self-center" role="tablist" aria-label="Partner type">
                        <button type="button" role="tab" aria-selected={draft.type === 'GARAGE'} className={roleTab(draft.type === 'GARAGE')} onClick={() => set('type', 'GARAGE')}>
                            <Icon name="storefront" className="text-[18px]" />
                            <span>Full Garage / Auto Shop</span>
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={draft.type === 'MOBILE_MECHANIC'}
                            className={roleTab(draft.type === 'MOBILE_MECHANIC')}
                            onClick={() => set('type', 'MOBILE_MECHANIC')}
                        >
                            <Icon name="handyman" className="text-[18px]" />
                            <span>Mobile Mechanic Hero</span>
                        </button>
                        <Link href="/auth/signin?callbackUrl=/dashboard/garage" className={roleTab(false)}>
                            <Icon name="login" className="text-[18px]" />
                            <span>Partner Login</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                            {stepTab(1, draft.type === 'GARAGE' ? 'Business Profile' : 'Mechanic Profile')}
                            {stepTab(2, 'Services & Radius')}
                            {stepTab(3, 'Payout & KYC')}
                        </div>
                    </div>

                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            void submit();
                        }}
                        className="bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-sm flex flex-col gap-8"
                    >
                        <section ref={sections[1]} className="flex flex-col gap-6 scroll-mt-28">
                            <div className="flex items-center justify-between gap-4 pb-4 border-b border-surface-container">
                                <div>
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                        {draft.type === 'GARAGE' ? 'Garage & Workshop Profile' : 'Mobile Mechanic Profile'}
                                    </h2>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Provide key credentials visible to drivers requesting service.</p>
                                </div>
                                <span className="px-3 py-1 bg-surface-container-high rounded-full font-code-xs text-code-xs text-on-surface-variant font-semibold whitespace-nowrap">
                                    STATUS: {step1Done ? 'COMPLETE' : 'IN PROGRESS'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="pt-name" className="font-label-md text-label-md text-on-surface">
                                        {draft.type === 'GARAGE' ? 'Garage / Registered Business Name *' : 'Trading Name *'}
                                    </label>
                                    <div className={fieldBox}>
                                        <Icon name="domain" className="text-outline" />
                                        <input
                                            id="pt-name"
                                            className="bg-transparent w-full text-on-surface font-body-md text-body-md outline-none"
                                            placeholder="e.g. SpeedMasters Auto Care"
                                            value={draft.businessName}
                                            onChange={(e) => set('businessName', e.target.value)}
                                        />
                                    </div>
                                    <Err message={errors.businessName} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="pt-pin" className="font-label-md text-label-md text-on-surface">
                                        Tax Registration / PIN Number *
                                    </label>
                                    <div className={fieldBox}>
                                        <Icon name="badge" className="text-outline" />
                                        <input
                                            id="pt-pin"
                                            className="bg-transparent w-full text-on-surface font-code-sm text-code-sm tracking-wider uppercase outline-none placeholder:normal-case"
                                            placeholder="P051892341M"
                                            value={draft.taxPin}
                                            onChange={(e) => set('taxPin', e.target.value)}
                                        />
                                    </div>
                                    <Err message={errors.taxPin} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {draft.type === 'GARAGE' && (
                                    <Counter label="Active Service Hoists / Bays" hint="Simultaneous in-shop repairs" value={draft.bays} onChange={(n) => set('bays', n)} />
                                )}
                                <Counter label="Mobile Roadside Vans" hint="Field triage & towing units" value={draft.vans} onChange={(n) => set('vans', n)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center gap-2">
                                    <label htmlFor="pt-address" className="font-label-md text-label-md text-on-surface">
                                        {draft.type === 'GARAGE' ? 'Physical Bay Address & Real-Time Coordinates' : 'Base Location & Real-Time Coordinates'}
                                    </label>
                                    <button type="button" onClick={pinLocation} className="font-code-xs text-code-xs text-primary flex items-center gap-1 hover:underline">
                                        <Icon name={locating ? 'sync' : 'my_location'} className={cn('text-[14px]', locating && 'animate-spin')} />
                                        {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Pin my location'}
                                    </button>
                                </div>
                                <div className={cn(fieldBox, 'mb-2')}>
                                    <Icon name="location_on" className="text-outline" />
                                    <input
                                        id="pt-address"
                                        className="bg-transparent w-full text-on-surface font-body-md text-body-md outline-none"
                                        placeholder="Enterprise Road, Industrial Area Gate 4, Nairobi"
                                        value={draft.address}
                                        onChange={(e) => set('address', e.target.value)}
                                    />
                                </div>
                                <Err message={errors.address} />
                                {location ? (
                                    <MapSnapshot tile={location.map} label="Shop location map" className="w-full h-44 rounded-xl shadow-inner flex items-center justify-center">
                                        <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-[1px]" />
                                        <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-pill bg-surface-container-lowest/90 backdrop-blur shadow-md">
                                            <span className="w-2.5 h-2.5 rounded-pill bg-error animate-ping" />
                                            <span className="font-label-md text-label-md text-on-surface">Shop Pin Latched (GPS Verified)</span>
                                        </div>
                                    </MapSnapshot>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={pinLocation}
                                        className="w-full h-44 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:border-primary transition-colors"
                                    >
                                        <Icon name={locating ? 'sync' : 'add_location_alt'} className={cn('text-[28px] text-primary', locating && 'animate-spin')} />
                                        <span className="font-label-lg text-label-lg text-on-surface">{locating ? 'Latching GPS…' : 'Latch shop pin from GPS'}</span>
                                        <span className="font-body-sm text-body-sm">Motorists are routed to this exact point.</span>
                                    </button>
                                )}
                            </div>
                        </section>

                        <section ref={sections[2]} className="flex flex-col gap-6 scroll-mt-28">
                            <div className="flex items-center justify-between gap-4 pb-4 border-b border-surface-container">
                                <div>
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Capabilities &amp; Service Radius</h2>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Select authorized skills to trigger automatic job dispatches.</p>
                                </div>
                                <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant rounded font-code-xs text-code-xs">MATRIX</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(p?.capabilities ?? []).map((c) => (
                                    <label key={c.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                                        <input
                                            checked={draft.capabilityIds.includes(c.id)}
                                            onChange={(e) =>
                                                set('capabilityIds', e.target.checked ? [...draft.capabilityIds, c.id] : draft.capabilityIds.filter((x) => x !== c.id))
                                            }
                                            className="w-4 h-4 rounded accent-primary"
                                            type="checkbox"
                                        />
                                        <div className="min-w-0">
                                            <div className="font-label-md text-label-md text-on-surface">{c.label}</div>
                                            <div className="font-code-xs text-code-xs text-on-surface-variant">{c.detail}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <Err message={errors.capabilityIds} />
                            <div className="p-5 bg-surface-container-low rounded-xl flex flex-col gap-4">
                                <div className="flex justify-between items-center gap-4">
                                    <div>
                                        <span className="font-label-lg text-label-lg text-on-surface">Emergency Response Geo-Radius</span>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">Maximum distance your mobile rescue vans will deploy.</p>
                                    </div>
                                    <div className="px-3 py-1 bg-surface-container-lowest rounded-lg shadow-sm whitespace-nowrap">
                                        <span className="font-headline-sm text-headline-sm text-primary font-bold">{draft.radiusKm}</span>{' '}
                                        <span className="font-code-sm text-code-sm text-on-surface-variant">KM</span>
                                    </div>
                                </div>
                                <input
                                    aria-label="Emergency response radius in kilometres"
                                    className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                                    min={p?.radiusKm.min ?? 5}
                                    max={p?.radiusKm.max ?? 60}
                                    type="range"
                                    value={draft.radiusKm}
                                    onChange={(e) => set('radiusKm', Number(e.target.value))}
                                />
                                <div className="flex justify-between font-code-xs text-code-xs text-on-surface-variant">
                                    {(p?.radiusKm.marks ?? []).map((m) => (
                                        <span key={m.km}>{m.label}</span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section ref={sections[3]} className="flex flex-col gap-6 scroll-mt-28">
                            <div className="flex items-center justify-between gap-4 pb-4 border-b border-surface-container">
                                <div>
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Verification &amp; Escrow Payouts</h2>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Funds are automatically settled to this account upon driver job completion.</p>
                                </div>
                                <span className="flex items-center gap-1 text-primary font-code-xs text-code-xs whitespace-nowrap">
                                    <Icon name="lock" className="text-[16px]" />
                                    256-BIT ENCRYPTED
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-label-md text-label-md text-on-surface">Trade Licenses &amp; Garage Certification</span>
                                <input
                                    ref={fileInput}
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="sr-only"
                                    onChange={(e) => {
                                        const picked = Array.from(e.target.files ?? []).filter((f) => f.size <= 15 * 1024 * 1024);
                                        setFiles((fs) => [...fs, ...picked]);
                                        e.target.value = '';
                                    }}
                                />
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => fileInput.current?.click()}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setFiles((fs) => [...fs, ...Array.from(e.dataTransfer.files).filter((f) => f.size <= 15 * 1024 * 1024)]);
                                    }}
                                    className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-6 bg-surface-container-low/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Icon name="cloud_upload" className="text-primary text-[28px]" />
                                    </div>
                                    <div className="font-label-lg text-label-lg text-on-surface">Click to upload or drag files here</div>
                                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                        County Business Permit, Mechanic Trade Cert, or Liability Insurance (PDF, JPG, PNG up to 15MB)
                                    </div>
                                    {files.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                                            {files.map((f, i) => (
                                                <span
                                                    key={`${f.name}-${i}`}
                                                    className="px-2 py-1 bg-surface-container-lowest rounded text-on-surface-variant font-code-xs text-code-xs shadow-sm flex items-center gap-1"
                                                >
                                                    <Icon name="verified" className="text-[14px] text-secondary" />
                                                    {f.name}
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove ${f.name}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFiles((fs) => fs.filter((_, j) => j !== i));
                                                        }}
                                                        className="ml-0.5 hover:text-error"
                                                    >
                                                        <Icon name="close" className="text-[14px]" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="pt-mm" className="font-label-lg text-label-lg text-on-surface flex items-center gap-2">
                                            <Icon name="phone_android" className="text-primary" />
                                            Instant Mobile Money
                                        </label>
                                        <span className="text-secondary font-code-xs text-code-xs font-semibold">TILL / PAYBILL</span>
                                    </div>
                                    <input
                                        id="pt-mm"
                                        className="bg-surface-container-lowest px-3.5 py-2 rounded-lg font-code-sm text-code-sm text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-primary"
                                        placeholder="Paybill: 400222 | Acc: 0110948201"
                                        value={draft.mobileMoney}
                                        onChange={(e) => set('mobileMoney', e.target.value)}
                                    />
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">Real-time settlement within 60 seconds of client rescue signoff.</span>
                                </div>
                                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="pt-bank" className="font-label-lg text-label-lg text-on-surface flex items-center gap-2">
                                            <Icon name="account_balance" className="text-primary" />
                                            Bank Wire (EFT / RTGS)
                                        </label>
                                        <span className="text-on-surface-variant font-code-xs text-code-xs font-semibold">COMMERCIAL</span>
                                    </div>
                                    <input
                                        id="pt-bank"
                                        className="bg-surface-container-lowest px-3.5 py-2 rounded-lg font-code-sm text-code-sm text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-primary"
                                        placeholder="Stanbic Bank - 0100004928190"
                                        value={draft.bankAccount}
                                        onChange={(e) => set('bankAccount', e.target.value)}
                                    />
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">Batched daily reconciliation for larger overhaul shop operations.</span>
                                </div>
                            </div>
                            <Err message={errors.mobileMoney} />
                        </section>

                        {errors.form && (
                            <p role="alert" className="rounded-lg bg-error-container px-space-md py-space-sm font-body-sm text-body-sm text-on-error-container">
                                {errors.form}
                            </p>
                        )}

                        <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => saveDraft()}
                                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon name="save" className="text-[20px]" />
                                <span>Save Application Draft</span>
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm tracking-wide shadow-md hover:bg-primary-container hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                <span>{submitting ? 'Submitting…' : session ? 'Submit Verification & Launch Store' : 'Create Account & Continue'}</span>
                                <Icon name="arrow_forward" className="text-[20px]" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-5">
                        <div>
                            <span className="font-code-xs text-code-xs text-primary font-bold uppercase tracking-wider">Partner Advantage</span>
                            <h3 className="font-title-lg text-title-lg text-on-surface mt-1">Why Partner with MtokaaHero?</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {(p?.advantages ?? []).map((a) => (
                                <div key={a.title} className="flex items-start gap-3">
                                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', ADV_TONE[a.tone])}>
                                        <Icon name={a.icon} className="text-[22px]" />
                                    </div>
                                    <div>
                                        <div className="font-label-lg text-label-lg text-on-surface">{a.title}</div>
                                        <div className="font-body-sm text-body-sm text-on-surface-variant">{a.body}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3.5 bg-surface-container-low rounded-lg flex items-center justify-between text-on-surface">
                            <div className="flex items-center gap-2">
                                <Icon name="support_agent" className="text-secondary text-[20px]" />
                                <span className="font-label-md text-label-md">Need setup assistance?</span>
                            </div>
                            <Link className="font-code-xs text-code-xs text-primary font-semibold hover:underline" href={p?.support.href ?? '/contact'}>
                                {p?.support.label ?? 'Chat with Ops'}
                            </Link>
                        </div>
                    </div>

                    {p?.testimonial && (
                        <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-6 rounded-xl shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className="w-14 h-14 rounded-full object-cover shadow-sm" alt={p.testimonial.name} src={p.testimonial.photo} />
                                <div>
                                    <h4 className="font-title-md text-title-md text-on-surface">{p.testimonial.name}</h4>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">{p.testimonial.business}</span>
                                </div>
                            </div>
                            <blockquote className="font-body-sm text-body-sm text-on-surface italic mb-4">“{p.testimonial.quote}”</blockquote>
                            <div className="p-3 bg-surface-container-lowest rounded-xl flex items-center justify-between shadow-sm">
                                <div>
                                    <span className="font-code-xs text-code-xs text-on-surface-variant block uppercase">Monthly Network Payout</span>
                                    <span className="font-headline-sm text-headline-sm text-primary font-bold">{formatMoney(p.testimonial.monthlyPayout)}+</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex text-secondary-container">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Icon key={i} name="star" fill className="text-[16px]" />
                                        ))}
                                    </div>
                                    <span className="font-code-xs text-code-xs text-on-surface-variant">
                                        {p.testimonial.rating} ({p.testimonial.reviewCount} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {p && (
                        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-center text-on-surface-variant">
                                <span className="font-label-md text-label-md">Average Rescue Dispatch</span>
                                <span className="font-code-sm text-code-sm text-on-surface font-semibold">{p.dispatch.avgMinutes} Mins</span>
                            </div>
                            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (1 - p.dispatch.avgMinutes / (p.dispatch.targetMinutes * 4)) * 100)}%` }} />
                            </div>
                            <div className="flex justify-between font-code-xs text-code-xs text-on-surface-variant">
                                <span>Target: &lt;{p.dispatch.targetMinutes}m</span>
                                <span className="text-primary font-semibold">Top Tier {p.dispatch.onTimeRate}% On-Time</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
