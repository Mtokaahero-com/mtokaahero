'use client';

import { useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { MapSnapshot, project } from '@/components/map/MapSnapshot';
import type { RescueTracking } from '@/lib/api/rescue';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

const STATUS_BADGE: Record<RescueTracking['status'], { label: string; className: string; dot: string }> = {
    RECEIVED: { label: 'Matching Nearest Hero', className: 'bg-[#fffbeb] text-[#b45309]', dot: 'bg-[#f59e0b]' },
    EN_ROUTE: { label: 'Mechanic En Route', className: 'bg-[#f0fdf4] text-[#15803d]', dot: 'bg-[#22c55e]' },
    ON_SITE: { label: 'Mechanic On-Site', className: 'bg-[#eff6ff] text-primary-container', dot: 'bg-[#2563eb]' },
    COMPLETED: { label: 'Rescue Completed', className: 'bg-[#f0fdf4] text-[#15803d]', dot: 'bg-[#22c55e]' },
    CANCELLED: { label: 'Cancelled', className: 'bg-[#fef2f2] text-[#b91c1c]', dot: 'bg-[#ef4444]' },
};

const STEP_ICON = { RECEIVED: 'check', EN_ROUTE: 'navigation', ON_SITE: 'build', COMPLETED: 'verified' } as const;
const ORDER = ['RECEIVED', 'EN_ROUTE', 'ON_SITE', 'COMPLETED'] as const;

function headline(t: RescueTracking) {
    if (t.status === 'EN_ROUTE' && t.eta) return `Arrival in ~${t.eta.minutes} min`;
    if (t.status === 'RECEIVED') return 'Finding your rescue hero…';
    if (t.status === 'ON_SITE') return 'Your mechanic has arrived';
    if (t.status === 'COMPLETED') return 'Back on the road';
    return 'Rescue cancelled';
}

export function TrackingMap({ t, className }: { t: RescueTracking; className?: string }) {
    const [spin, setSpin] = useState(false);
    const tech = t.map.technician ? project(t.map, t.map.technician) : null;
    const me = project(t.map, t.map.motorist);
    return (
        <MapSnapshot tile={t.map} label="Live map of your rescue" className={cn('w-full bg-surface-container-high', className)}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-surface pointer-events-none" />
            {tech && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d={`M ${tech.left} ${tech.top} L ${me.left} ${me.top}`} stroke="#001551" strokeOpacity="0.15" strokeWidth="8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    <path
                        className="animate-pulse"
                        d={`M ${tech.left} ${tech.top} L ${me.left} ${me.top}`}
                        stroke="#1d4ed8"
                        strokeWidth="4"
                        strokeDasharray="8 8"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            )}
            {tech && t.technician && (
                <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000" style={{ left: `${tech.left}%`, top: `${tech.top}%` }}>
                    <div className="bg-primary text-on-primary px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 mb-1 animate-bounce">
                        <Icon name="local_shipping" className="text-[14px]" />
                        <span className="font-code-xs text-code-xs font-semibold whitespace-nowrap">{t.technician.unitLabel}</span>
                    </div>
                    <div className="relative w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
                        <Icon name="directions_car" className="text-[18px]" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-container" />
                        </span>
                    </div>
                </div>
            )}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${me.left}%`, top: `${me.top}%` }}>
                <div className="bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 mb-1">
                    <Icon name="warning" className="text-[12px] text-error" />
                    <span className="font-label-md text-label-md font-semibold whitespace-nowrap">{t.vehicle.shortLabel}</span>
                </div>
                <div className="relative flex items-center justify-center w-8 h-8">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-40" />
                    <span className="relative w-4 h-4 rounded-full bg-primary shadow-md" />
                </div>
            </div>
            {t.eta && (
                <div className="absolute top-4 right-4 z-10 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
                    <Icon name="near_me" className="text-primary text-[18px]" />
                    <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-bold text-on-surface">{t.eta.minutes} mins away</span>
                        <span className="font-code-xs text-code-xs text-on-surface-variant">
                            {t.eta.distanceKm} km • {t.eta.via}
                        </span>
                    </div>
                </div>
            )}
            <button
                type="button"
                aria-label="Recenter map view"
                onClick={() => {
                    setSpin(true);
                    setTimeout(() => setSpin(false), 300);
                }}
                className={cn(
                    'absolute bottom-6 right-4 z-10 w-11 h-11 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-md active:scale-95 transition-transform',
                    spin && 'rotate-45',
                )}
            >
                <Icon name="my_location" className="text-[20px]" />
            </button>
        </MapSnapshot>
    );
}

export function StatusCard({ t }: { t: RescueTracking }) {
    const badge = STATUS_BADGE[t.status];
    const currentIndex = ORDER.indexOf(t.status as (typeof ORDER)[number]);
    const created = new Date(t.createdAt);
    const today = created.toDateString() === new Date().toDateString();
    const time = created.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
            <div className="flex items-start justify-between gap-space-sm">
                <div className="flex flex-col">
                    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit', badge.className)} role="status">
                        <span className="relative flex h-2 w-2">
                            <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', badge.dot)} />
                            <span className={cn('relative inline-flex rounded-full h-2 w-2', badge.dot)} />
                        </span>
                        <span className="font-label-md text-label-md font-bold">{badge.label}</span>
                    </div>
                    <span className="font-headline-sm text-headline-sm text-on-surface mt-1">{headline(t)}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-code-sm text-code-sm text-primary font-semibold">{t.code}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {today ? 'Today' : created.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {time}
                    </span>
                </div>
            </div>
            <div className="pt-2">
                <ol className="grid grid-cols-4 gap-1 relative">
                    {t.timeline.map((step, i) => {
                        const done = i < currentIndex;
                        const current = i === currentIndex;
                        return (
                            <li key={step.status} className="flex flex-col items-center text-center" aria-current={current ? 'step' : undefined}>
                                <div className={cn('w-full h-1.5 rounded-full mb-2', done || current ? 'bg-primary' : 'bg-surface-container-high')} />
                                <div
                                    className={cn(
                                        'w-5 h-5 rounded-full flex items-center justify-center',
                                        done ? 'bg-primary text-on-primary' : current ? 'bg-primary-container text-on-primary animate-pulse' : 'bg-surface-container-high text-on-surface-variant',
                                    )}
                                >
                                    <Icon name={done ? 'check' : STEP_ICON[step.status]} className="text-[12px]" />
                                </div>
                                <span
                                    className={cn(
                                        'font-label-md text-label-md mt-1',
                                        current ? 'font-bold text-primary' : done ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant',
                                    )}
                                >
                                    {step.label}
                                </span>
                                <span className={cn('font-code-xs text-code-xs', current ? 'text-primary font-semibold' : 'text-on-surface-variant')}>{step.caption}</span>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
}

export function TechnicianCard({ t }: { t: RescueTracking }) {
    const tech = t.technician;
    if (!tech) {
        return (
            <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-md flex items-center gap-space-sm">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <Icon name="radar" className="text-[28px] animate-spin [animation-duration:3s]" />
                </div>
                <div className="flex flex-col">
                    <span className="font-title-md text-title-md text-on-surface">Broadcasting to nearby rescue units</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">The first verified mechanic to accept is assigned. Usually under a minute.</span>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
                <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={`${tech.name} - ${tech.title}`} className="w-14 h-14 rounded-pill object-cover shadow-sm" src={tech.photo} />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
                        <Icon name="verified" fill className="text-[12px]" />
                    </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-title-md text-title-md text-on-surface truncate">{tech.name}</span>
                        <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full shrink-0">
                            <Icon name="star" fill className="text-[14px] text-secondary-container" />
                            <span className="font-code-sm text-code-sm font-semibold text-on-surface">{tech.rating.toFixed(1)}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">({tech.reviewCount})</span>
                        </div>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant truncate">
                        {tech.title} • {tech.provider}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="font-code-xs text-code-xs font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface">Van: {tech.vehiclePlate}</span>
                        <span className="font-code-xs text-code-xs text-on-surface-variant">• {tech.level}</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-space-sm pt-1">
                <a
                    className="min-h-[48px] px-3 py-2 rounded-xl bg-surface-container text-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    href={`tel:${tech.phone}`}
                >
                    <Icon name="call" className="text-[20px]" />
                    <span>Call Technician</span>
                </a>
                <a
                    className="min-h-[48px] px-3 py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
                    href={`https://wa.me/${tech.whatsapp}?text=${encodeURIComponent(`Hi ${tech.name.split(' ')[0]}, this is about rescue ${t.code}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon name="chat" className="text-[20px]" />
                    <span>WhatsApp Chat</span>
                </a>
            </div>
        </div>
    );
}

export function ReleaseCode({ code }: { code: string }) {
    return (
        <div className="w-full bg-surface-container-low rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div className="flex flex-col pr-2">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Release Passcode</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Provide only after engine starts &amp; diagnostic clears</span>
            </div>
            <div className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary shadow-sm flex items-center gap-1.5">
                <Icon name="key" className="text-[16px]" />
                <span className="font-headline-sm text-headline-sm font-bold tracking-widest">{code}</span>
            </div>
        </div>
    );
}

export function OrderDetails({ t, defaultOpen = false }: { t: RescueTracking; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden transition-all">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="w-full px-space-md py-3.5 flex items-center justify-between text-left active:bg-surface-container-low"
            >
                <div className="flex items-center gap-2">
                    <Icon name="receipt_long" className="text-primary text-[20px]" />
                    <span className="font-title-md text-title-md text-on-surface">Order &amp; Vehicle Specs</span>
                </div>
                <Icon name="expand_more" className={cn('text-on-surface-variant transition-transform duration-200', open && 'rotate-180')} />
            </button>
            {open && (
                <div className="px-space-md pb-space-md flex flex-col gap-space-sm">
                    <div className="w-full h-px bg-surface-container-high my-1" />
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md font-bold text-on-surface">{t.order.title}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{t.order.description}</span>
                        </div>
                        <span className="font-code-sm text-code-sm font-semibold text-on-surface whitespace-nowrap">{formatMoney(t.order.total)}</span>
                    </div>
                    <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon name="directions_car" className="text-[20px] text-on-surface-variant" />
                            <div className="flex flex-col">
                                <span className="font-label-md text-label-md font-bold text-on-surface">{t.vehicle.label}</span>
                                {t.vehicle.engine && <span className="font-code-xs text-code-xs text-on-surface-variant">{t.vehicle.engine}</span>}
                            </div>
                        </div>
                        <span className="font-code-xs text-code-xs px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">{t.vehicle.plate}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-on-surface-variant">
                        <Icon name="lock" className="text-primary text-[18px]" />
                        <span className="font-body-sm text-body-sm">
                            Payment of <strong className="text-on-surface font-semibold">{formatMoney(t.order.total)}</strong> held safely in escrow.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export function EmergencyButton({ number }: { number: string }) {
    return (
        <a
            className="min-h-[52px] w-full px-space-md py-3 rounded-xl bg-tertiary text-on-tertiary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
            href={`tel:${number}`}
        >
            <Icon name="crisis_alert" className="text-[20px] animate-pulse" />
            <span>Need Immediate Highway Police / Medical?</span>
        </a>
    );
}
