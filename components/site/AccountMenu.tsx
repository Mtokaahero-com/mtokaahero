'use client';

import Link from 'next/link';
import { Icon } from '@/components/brand/Icon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccount } from '@/hooks/use-account';
import { logout } from '@/lib/auth/logout';
import { cn } from '@/lib/utils';

/** Avatar chip from the Stitch header: square avatar, name, mono role line, caret. */
export function AccountMenu({ compact = false }: { compact?: boolean }) {
    const account = useAccount();

    const avatar = (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Icon name="person" className="text-on-primary text-[18px]" />
        </div>
    );

    if (account.status !== 'authenticated') {
        return (
            <Link href="/auth/signin" className="flex items-center gap-space-xs pl-space-sm" aria-label="Sign in">
                {avatar}
                {!compact && (
                    <div className="hidden md:flex flex-col text-left">
                        <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Sign in</span>
                        <span className="font-code-xs text-code-xs text-on-surface-variant">{account.roleLabel}</span>
                    </div>
                )}
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-space-xs pl-space-sm outline-none" aria-label="Account menu">
                {avatar}
                {!compact && (
                    <>
                        <div className="hidden md:flex flex-col text-left">
                            <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">{account.displayName}</span>
                            <span className="font-code-xs text-code-xs text-on-surface-variant">{account.roleLabel}</span>
                        </div>
                        <Icon name="expand_more" className="text-on-surface-variant text-[18px]" />
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {account.activeMembership && (
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/garage" className={cn('flex items-center gap-2')}>
                            <Icon name="dashboard" className="text-[18px] text-primary" /> Shop dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/rescue/track" className="flex items-center gap-2">
                        <Icon name="local_shipping" className="text-[18px] text-primary" /> Track my rescue
                    </Link>
                </DropdownMenuItem>
                {!account.activeMembership && (
                    <DropdownMenuItem asChild>
                        <Link href="/partners" className="flex items-center gap-2">
                            <Icon name="storefront" className="text-[18px] text-primary" /> Register a garage
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void logout()} className="flex items-center gap-2 text-tertiary">
                    <Icon name="logout" className="text-[18px]" /> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
