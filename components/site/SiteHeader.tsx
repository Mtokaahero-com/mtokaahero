'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/providers/cart-provider';
import { AccountMenu } from './AccountMenu';
import { cn } from '@/lib/utils';

const NAV = [
    { href: '/', label: 'Browse Marketplace', match: (p: string) => p === '/' },
    { href: '/?categoryId=garages', label: 'Find Garages', match: () => false },
    { href: '/rescue', label: 'Emergency Rescue SOS', match: (p: string) => p.startsWith('/rescue') },
    { href: '/partners', label: 'Partner Garage Portal', match: (p: string) => p.startsWith('/partners') },
];

/** Fixed desktop header from the Stitch marketplace, checkout and dashboard screens (80px tall). */
export function SiteHeader({ className }: { className?: string }) {
    const pathname = usePathname() ?? '/';
    const router = useRouter();
    const cart = useCart();
    const [q, setQ] = useState('');

    return (
        <header
            className={cn(
                'fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]',
                className,
            )}
        >
            <div className="h-20 w-full px-gutter-lg flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-lg flex-shrink-0">
                    <Logo />
                    <form
                        role="search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : '/');
                        }}
                        className="hidden 2xl:flex items-center bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] w-80 min-[1680px]:w-96"
                    >
                        <Icon name="search" className="text-on-surface-variant text-[20px] mr-space-xs" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            aria-label="Search the marketplace"
                            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                            placeholder="Search spare parts, tires, garages or mechanics nearby..."
                            type="text"
                        />
                    </form>
                </div>
                <nav className="hidden xl:flex items-center gap-space-md">
                    {NAV.map((item) => {
                        const active = item.match(pathname);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'transition-colors whitespace-nowrap',
                                    active
                                        ? 'text-primary font-bold'
                                        : 'font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface',
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex items-center gap-space-md flex-shrink-0">
                    <Link
                        href="/rescue"
                        className="relative inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-tertiary-container text-on-tertiary font-label-lg text-label-lg shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)] hover:bg-tertiary transition-colors"
                    >
                        <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
                        <span>Request Rescue Hero 🚨</span>
                    </Link>
                    <Link
                        href="/rescue"
                        aria-label={`Cart, ${cart.count} items`}
                        className="relative p-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                    >
                        <Icon name="shopping_cart" className="text-[24px]" />
                        {cart.count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-on-secondary font-code-xs text-code-xs">
                                {cart.count}
                            </span>
                        )}
                    </Link>
                    <AccountMenu />
                </div>
            </div>
        </header>
    );
}
