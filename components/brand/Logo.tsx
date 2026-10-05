import Link from 'next/link';
import { cn } from '@/lib/utils';

/** The emblem lockup from the Stitch "MtokaaHero Logo" screen. */
export function LogoMark({ className }: { className?: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="MtokaaHero Logo" src="/brand/logo.svg" className={cn('h-8 w-auto object-contain', className)} />;
}

/** Emblem plus the "MtokaaHero" word mark used in the desktop header. */
export function Logo({ href = '/', className }: { href?: string; className?: string }) {
    return (
        <Link href={href} className={cn('flex items-center gap-space-sm', className)}>
            <LogoMark />
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                Mtokaa<span className="text-secondary">Hero</span>
            </span>
        </Link>
    );
}
