'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { toast } from 'sonner';
import { DesktopMarketplace } from '@/components/marketplace/DesktopMarketplace';
import { MobileMarketplace } from '@/components/marketplace/MobileMarketplace';
import { useMarketplace } from '@/components/marketplace/useMarketplace';
import { MobileHeader } from '@/components/site/MobileHeader';
import { MobileTabBar } from '@/components/site/MobileTabBar';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import type { Offer } from '@/lib/api/marketplace';
import { useCart } from '@/providers/cart-provider';

function Marketplace() {
    const params = useSearchParams();
    const router = useRouter();
    const cart = useCart();
    const market = useMarketplace({ q: params.get('q') ?? undefined, categoryId: params.get('categoryId') ?? undefined });

    const addToCart = (offer: Offer) => {
        const { replaced } = cart.add(offer);
        toast.success(replaced ? `Cart restarted with ${offer.provider.name}` : 'Added to cart', {
            description: replaced ? 'An order is fulfilled by one provider, so the previous items were removed.' : offer.title,
        });
    };

    // Every primary action leads into checkout with the offer preselected; checkout picks rescue vs. bay booking from it.
    const startCheckout = (offer: Offer) => {
        cart.add(offer);
        router.push(`/rescue?offerId=${encodeURIComponent(offer.id)}${offer.fulfilment === 'IN_SHOP' ? '&mode=IN_SHOP' : ''}`);
    };

    return (
        <>
            <div className="hidden md:block">
                <DesktopMarketplace market={market} onPrimary={startCheckout} onAddToCart={addToCart} />
            </div>
            <div className="md:hidden">
                <MobileMarketplace market={market} onPrimary={startCheckout} />
            </div>
        </>
    );
}

export default function HomePage() {
    return (
        <>
            <SiteHeader className="hidden md:block" />
            <MobileHeader className="md:hidden" />
            <main className="w-full pt-16 pb-20 md:pt-20 md:pb-0 bg-surface min-h-[calc(100vh-80px)]">
                <Suspense>
                    <Marketplace />
                </Suspense>
            </main>
            <SiteFooter className="hidden md:block" />
            <MobileTabBar className="md:hidden" />
        </>
    );
}
