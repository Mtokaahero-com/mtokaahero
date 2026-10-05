'use client';

import { Suspense } from 'react';
import { CheckoutDesktop } from '@/components/rescue/CheckoutDesktop';
import { CheckoutMobile } from '@/components/rescue/CheckoutMobile';
import { useCheckout } from '@/components/rescue/useCheckout';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

function Checkout() {
    const checkout = useCheckout();
    return (
        <>
            <div className="hidden md:block">
                <SiteHeader />
                <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
                    <CheckoutDesktop checkout={checkout} />
                </main>
                <SiteFooter />
            </div>
            <div className="md:hidden bg-surface min-h-screen">
                <CheckoutMobile checkout={checkout} />
            </div>
        </>
    );
}

export default function RescueCheckoutPage() {
    return (
        <Suspense>
            <Checkout />
        </Suspense>
    );
}
