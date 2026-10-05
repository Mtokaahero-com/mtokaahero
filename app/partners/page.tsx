import { Suspense } from 'react';
import { OnboardingPortal } from '@/components/partners/OnboardingPortal';
import { MobileHeader } from '@/components/site/MobileHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

export const metadata = { title: 'Partner Portal - MtokaaHero' };

export default function PartnersPage() {
    return (
        <>
            <SiteHeader className="hidden md:block" />
            <MobileHeader className="md:hidden" />
            <main className="w-full bg-surface min-h-screen px-gutter md:px-gutter-lg pt-20 md:pt-28">
                <Suspense>
                    <OnboardingPortal />
                </Suspense>
            </main>
            <SiteFooter showTrust={false} />
        </>
    );
}
