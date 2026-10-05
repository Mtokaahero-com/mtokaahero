'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/brand/Icon';

type GpsState = { kind: 'idle' } | { kind: 'locating' } | { kind: 'locked'; lat: number; lng: number } | { kind: 'failed' };

/** Sticky "Stranded or Broken Down on the Road?" strip at the bottom of the desktop marketplace. */
export function SosStrip({ etaMin = 14, etaMax = 22 }: { etaMin?: number; etaMax?: number }) {
    const [gps, setGps] = useState<GpsState>({ kind: 'idle' });

    const detect = () => {
        if (!('geolocation' in navigator)) return setGps({ kind: 'failed' });
        setGps({ kind: 'locating' });
        navigator.geolocation.getCurrentPosition(
            (pos) => setGps({ kind: 'locked', lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setGps({ kind: 'failed' }),
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    const rescueHref = gps.kind === 'locked' ? `/rescue?lat=${gps.lat.toFixed(5)}&lng=${gps.lng.toFixed(5)}` : '/rescue';

    return (
        <aside className="sticky bottom-4 z-40 w-full px-gutter-lg pointer-events-none mt-space-lg mb-space-sm">
            <div className="max-w-[1400px] mx-auto pointer-events-auto bg-inverse-surface/95 backdrop-blur-xl text-inverse-on-surface rounded-2xl p-space-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary flex-shrink-0 shadow-lg">
                        <Icon name="fmd_good" className="text-[26px] animate-bounce" />
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary-fixed border-2 border-inverse-surface" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm font-bold text-inverse-on-surface">Stranded or Broken Down on the Road?</span>
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary-fixed font-code-xs text-code-xs uppercase font-bold">
                                24/7 Live Triage
                            </span>
                        </div>
                        <p className="font-body-md text-body-md text-surface-container-highest/80">
                            Tap below to transmit your exact GPS satellite coordinates. Certified nearest rescue vehicle arrives in ~{etaMin}-{etaMax} minutes.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-space-sm w-full md:w-auto flex-shrink-0">
                    <button
                        type="button"
                        onClick={detect}
                        disabled={gps.kind === 'locating'}
                        className="hidden lg:flex items-center gap-1.5 px-space-md py-3 rounded-xl bg-inverse-surface hover:bg-surface-container-lowest/10 text-inverse-on-surface font-label-lg text-label-lg transition-colors border-0"
                    >
                        {gps.kind === 'locating' ? (
                            <>
                                <Icon name="sync" className="text-[18px] animate-spin" /> Locating GPS...
                            </>
                        ) : gps.kind === 'locked' ? (
                            <>
                                <Icon name="check_circle" className="text-[18px] text-green-400" /> Locked: {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
                            </>
                        ) : (
                            <>
                                <Icon name="my_location" className="text-[20px] text-secondary-fixed" />
                                <span>{gps.kind === 'failed' ? 'GPS unavailable — retry' : 'Detect My GPS'}</span>
                            </>
                        )}
                    </button>
                    <Link
                        href={rescueHref}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-space-lg py-3.5 rounded-xl bg-tertiary-container text-on-tertiary font-label-lg text-label-lg tracking-wide uppercase font-bold shadow-lg hover:bg-tertiary transition-all active:scale-[0.98]"
                    >
                        <Icon name="e911_emergency" className="text-[22px]" />
                        <span>Request 1-Click Rescue</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
