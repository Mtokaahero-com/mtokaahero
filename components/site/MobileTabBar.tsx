'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/brand/Icon';
import { useAccount } from '@/hooks/use-account';
import { cn } from '@/lib/utils';

/** Bottom navigation from the Stitch mobile screens: Explore, Tracking, raised Rescue SOS, Account. */
export function MobileTabBar({ className }: { className?: string }) {
    const pathname = usePathname() ?? '/';
    const account = useAccount();
    const tabs = [
        { href: '/', label: 'Explore', icon: 'storefront', active: pathname === '/' },
        { href: '/rescue/track', label: 'Tracking', icon: 'local_shipping', active: pathname.startsWith('/rescue/track') },
    ];
    const accountHref = account.status === 'authenticated' ? (account.activeMembership ? '/dashboard/garage' : '/rescue/track') : '/auth/signin';

    const tabClass = (active: boolean) =>
        cn(
            'flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-2 transition-colors',
            active ? 'text-primary font-label-lg' : 'text-on-surface-variant hover:text-on-surface',
        );

    return (
        <nav className={cn('fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)]', className)}>
            <div className="flex justify-around items-center h-20 px-space-xs">
                {tabs.map((tab) => (
                    <Link key={tab.label} href={tab.href} aria-current={tab.active ? 'page' : undefined} className={tabClass(tab.active)}>
                        <Icon name={tab.icon} className="text-[24px]" />
                        <span className="font-label-md text-label-md mt-1">{tab.label}</span>
                    </Link>
                ))}
                <Link
                    href="/rescue"
                    className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-2 text-tertiary transition-colors hover:text-tertiary-container"
                >
                    <div className="w-10 h-10 -mt-5 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md active:scale-95 transition-transform">
                        <Icon name="sos" className="text-[22px]" />
                    </div>
                    <span className="font-label-md text-label-md mt-0.5 text-tertiary font-bold">Rescue SOS</span>
                </Link>
                <Link href={accountHref} className={tabClass(pathname.startsWith('/dashboard') || pathname.startsWith('/auth'))}>
                    <Icon name="account_circle" className="text-[24px]" />
                    <span className="font-label-md text-label-md mt-1">Account</span>
                </Link>
            </div>
        </nav>
    );
}
