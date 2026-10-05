'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { AccountMenu } from '@/components/site/AccountMenu';
import { cn } from '@/lib/utils';
import { useCart } from '@/providers/cart-provider';

export type DashboardSection = 'overview' | 'bays' | 'dispatch' | 'parts';

const NAV: { id: DashboardSection; label: string; icon: string; href: string }[] = [
    { id: 'overview', label: 'Shop Overview', icon: 'grid_view', href: '/dashboard/garage' },
    { id: 'bays', label: 'Bay Management', icon: 'garage', href: '/dashboard/garage?view=SERVICE#inventory' },
    { id: 'dispatch', label: 'Rescue Dispatch', icon: 'emergency', href: '/dashboard/garage#dispatch' },
    { id: 'parts', label: 'B2B Parts Hub', icon: 'inventory_2', href: '/dashboard/garage?view=PART#inventory' },
];

/** Fixed 256px sidebar + 80px header from the Stitch "Tenant Garage & Mechanic Command Dashboard". */
export function DashboardShell({
    active,
    statusLine,
    children,
}: {
    active: DashboardSection;
    statusLine?: string;
    children: React.ReactNode;
}) {
    const cart = useCart();
    const router = useRouter();
    const [q, setQ] = useState('');

    return (
        <div className="min-h-screen bg-surface">
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex-col pt-space-md pb-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <div className="px-space-lg mb-space-lg">
                    <Logo />
                </div>
                <nav className="flex-1 px-space-sm space-y-space-xs" aria-label="Dashboard">
                    {NAV.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            aria-current={active === item.id ? 'page' : undefined}
                            className={cn(
                                'flex items-center gap-space-sm px-space-md py-space-sm rounded-xl transition-all',
                                active === item.id
                                    ? 'bg-primary-container text-on-primary font-semibold'
                                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
                            )}
                        >
                            <Icon name={item.icon} className="text-[20px]" />
                            <span className="font-label-lg text-label-lg">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                {statusLine && (
                    <div className="px-space-md pt-space-md">
                        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
                            <span className="font-code-xs text-code-xs uppercase text-primary font-bold block mb-space-xs">Status: Active</span>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{statusLine}</p>
                        </div>
                    </div>
                )}
            </aside>

            <div className="lg:pl-64">
                <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 lg:h-20 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between gap-space-md px-gutter lg:px-gutter-lg">
                    <Link href="/" className="lg:hidden" aria-label="MtokaaHero home">
                        <LogoMark className="h-7" />
                    </Link>
                    <form
                        role="search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : '/');
                        }}
                        className="hidden md:flex items-center bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] w-96 max-w-full"
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
                    <div className="flex items-center gap-space-sm md:gap-space-md">
                        <Link
                            href="/rescue"
                            className="relative hidden sm:inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-tertiary-container text-on-tertiary font-label-lg text-label-lg shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)] hover:bg-tertiary transition-colors"
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
                </header>

                <nav
                    className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-surface-container-low px-gutter py-2 flex gap-2 overflow-x-auto no-scrollbar"
                    aria-label="Dashboard sections"
                >
                    {NAV.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            aria-current={active === item.id ? 'page' : undefined}
                            className={cn(
                                'shrink-0 flex items-center gap-1.5 px-space-md py-1.5 rounded-xl font-label-md text-label-md',
                                active === item.id ? 'bg-primary-container text-on-primary font-semibold' : 'text-on-surface-variant bg-surface-container-lowest',
                            )}
                        >
                            <Icon name={item.icon} className="text-[16px]" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <main className="w-full pt-28 lg:pt-20 bg-surface min-h-[calc(100vh-80px)] px-gutter lg:px-gutter-lg pb-space-lg">
                    <div className="pt-space-lg">{children}</div>
                </main>
            </div>
        </div>
    );
}
