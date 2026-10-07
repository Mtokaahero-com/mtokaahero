'use client';

import Link from 'next/link';
import { use, useEffect } from 'react';
import { Icon } from '@/components/brand/Icon';
import { EmergencyButton, OrderDetails, ReleaseCode, StatusCard, TechnicianCard, TrackingMap } from '@/components/rescue/Tracking';
import { MobileHeader } from '@/components/site/MobileHeader';
import { MobileTabBar } from '@/components/site/MobileTabBar';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { useApi } from '@/hooks/use-api';
import { rememberTracking, rescueApi } from '@/lib/api/rescue';

// Live location is pushed roughly every 10 s while a job is active (roadmap P4); polling stands in until the WebSocket gateway exists.
const POLL_MS = 10_000;

export default function RescueTrackingPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const tracking = useApi(`track:${token}`, () => rescueApi.track(token));
    const t = tracking.data;
    const live = t && t.status !== 'COMPLETED' && t.status !== 'CANCELLED';

    useEffect(() => {
        if (!live) return;
        const id = setInterval(tracking.reload, POLL_MS);
        return () => clearInterval(id);
    }, [live, tracking.reload]);

    useEffect(() => {
        if (t) rememberTracking(t.trackingToken);
    }, [t]);

    const missing = !t && tracking.error;

    return (
        <>
            <SiteHeader className="hidden md:block" />
            <MobileHeader className="md:hidden" />
            <main className="flex flex-col relative w-full pt-16 pb-20 md:pt-20 md:pb-0 bg-surface min-h-screen">
                {missing ? (
                    <div className="max-w-md mx-auto px-gutter py-space-xl flex flex-col items-center gap-space-sm text-center">
                        <Icon name="link_off" className="text-[40px] text-on-surface-variant" />
                        <h1 className="font-headline-sm text-headline-sm text-on-surface">We can&apos;t find this rescue</h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">{tracking.error?.message}</p>
                        <Link href="/rescue" className="mt-space-sm px-space-lg py-3 rounded-xl bg-tertiary-container text-on-tertiary font-label-lg text-label-lg font-bold">
                            Request a new rescue
                        </Link>
                    </div>
                ) : !t ? (
                    <div className="flex flex-col w-full animate-pulse">
                        <div className="w-full h-[360px] bg-surface-container-high" />
                        <div className="px-gutter -mt-5 flex flex-col gap-space-md">
                            <div className="h-40 rounded-xl bg-surface-container-lowest shadow-md" />
                            <div className="h-36 rounded-xl bg-surface-container-lowest shadow-md" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Mobile: the Stitch "Live Rescue Order Tracking" layout. */}
                        <div className="md:hidden flex flex-col w-full pb-6">
                            <TrackingMap t={t} className="h-[360px]" />
                            <div className="px-gutter -mt-5 z-20 w-full flex flex-col gap-space-md">
                                <StatusCard t={t} />
                                <TechnicianCard t={t} />
                                <ReleaseCode code={t.releaseCode} />
                                <OrderDetails t={t} />
                                <EmergencyButton number={t.emergencyNumber} />
                            </div>
                        </div>
                        {/* Desktop: same modules, map beside the job cards. */}
                        <div className="hidden md:block max-w-7xl mx-auto w-full px-gutter-lg py-space-xl">
                            <div className="grid grid-cols-12 gap-space-xl items-start">
                                <div className="col-span-7 rounded-xl overflow-hidden shadow-md lg:sticky lg:top-24">
                                    <TrackingMap t={t} className="h-[560px]" />
                                </div>
                                <div className="col-span-5 flex flex-col gap-space-md">
                                    <StatusCard t={t} />
                                    <TechnicianCard t={t} />
                                    <ReleaseCode code={t.releaseCode} />
                                    <OrderDetails t={t} defaultOpen />
                                    <EmergencyButton number={t.emergencyNumber} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <SiteFooter className="hidden md:block" showTrust={false} />
            <MobileTabBar className="md:hidden" />
        </>
    );
}
