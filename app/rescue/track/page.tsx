'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { MobileHeader } from '@/components/site/MobileHeader';
import { MobileTabBar } from '@/components/site/MobileTabBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { lastTracking } from '@/lib/api/rescue';

/** "Tracking" tab: reopen the motorist's most recent rescue, or explain there is none on this device. */
export default function TrackingIndexPage() {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const token = lastTracking();
        if (token) router.replace(`/rescue/track/${token}`);
        else setChecked(true);
    }, [router]);

    return (
        <>
            <SiteHeader className="hidden md:block" />
            <MobileHeader className="md:hidden" />
            <main className="w-full pt-16 pb-24 md:pt-20 bg-surface min-h-screen">
                {checked && (
                    <div className="max-w-md mx-auto px-gutter py-space-xl flex flex-col items-center gap-space-sm text-center">
                        <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                            <Icon name="local_shipping" className="text-[32px]" />
                        </div>
                        <h1 className="font-headline-sm text-headline-sm text-on-surface">No active rescue on this device</h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Open the tracking link we texted you, or request a rescue and follow your mechanic live here.
                        </p>
                        <Link
                            href="/rescue"
                            className="mt-space-sm min-h-[48px] px-space-lg rounded-xl bg-tertiary-container text-on-tertiary font-label-lg text-label-lg font-bold flex items-center gap-2"
                        >
                            <Icon name="e911_emergency" className="text-[20px]" />
                            Request Rescue Now
                        </Link>
                    </div>
                )}
            </main>
            <MobileTabBar className="md:hidden" />
        </>
    );
}
