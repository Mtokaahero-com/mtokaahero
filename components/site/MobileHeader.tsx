'use client';

import Link from 'next/link';
import { Icon } from '@/components/brand/Icon';
import { LogoMark } from '@/components/brand/Logo';
import { AccountMenu } from './AccountMenu';
import { cn } from '@/lib/utils';

/** 64px mobile app bar from the Stitch mobile marketplace and tracking screens. */
export function MobileHeader({ locationLabel = 'Nairobi CBD • GPS', className }: { locationLabel?: string; className?: string }) {
    return (
        <header className={cn('fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe', className)}>
            <div className="h-16 px-gutter flex items-center justify-between gap-space-sm">
                <Link href="/" className="flex items-center gap-space-sm min-w-0">
                    <LogoMark className="h-6 max-[370px]:hidden" />
                    <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary leading-none tracking-tight">MtokaaHero</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Icon name="location_on" className="text-[14px] text-secondary" />
                            <span className="font-code-xs text-code-xs text-on-surface-variant truncate max-w-[110px]">{locationLabel}</span>
                        </div>
                    </div>
                </Link>
                <div className="flex items-center gap-space-sm">
                    <Link
                        href="/rescue"
                        className="min-h-[44px] min-w-[44px] px-space-sm py-1 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
                    >
                        <Icon name="e911_emergency" className="text-[18px] animate-pulse" />
                        <span className="font-label-md text-label-md uppercase tracking-wider font-bold pr-1">SOS</span>
                    </Link>
                    <AccountMenu compact />
                </div>
            </div>
        </header>
    );
}
