import { cn } from '@/lib/utils';

/** A Material Symbols Outlined glyph, the icon set used throughout the Stitch designs. */
export function Icon({ name, fill = false, className }: { name: string; fill?: boolean; className?: string }) {
    return (
        <span aria-hidden="true" className={cn('icon-symbol', fill && 'icon-fill', className)}>
            {name}
        </span>
    );
}
