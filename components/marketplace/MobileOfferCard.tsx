'use client';

import { Icon } from '@/components/brand/Icon';
import type { Offer } from '@/lib/api/marketplace';
import { formatMoney, formatRating } from '@/lib/format';
import { cn } from '@/lib/utils';
import { TEXT_TONE } from './tones';

const PILL: Record<string, string> = {
    rescue: 'bg-tertiary text-on-tertiary',
    primary: 'bg-primary text-on-primary',
    amber: 'bg-surface-container-highest text-on-surface',
    muted: 'bg-surface-container-highest text-on-surface',
    success: 'bg-surface-container-highest text-on-surface',
};

const TAG: Record<string, string> = {
    primary: 'bg-primary text-on-primary font-bold',
    amber: 'bg-secondary text-on-secondary font-bold',
    rescue: 'bg-surface-container-highest text-on-surface font-semibold',
    muted: 'bg-surface-container-highest text-on-surface font-semibold',
    success: 'bg-surface-container-highest text-on-surface font-semibold',
};

/** Compact marketplace card from the Stitch mobile marketplace. */
export function MobileOfferCard({ offer, onPrimary }: { offer: Offer; onPrimary: (offer: Offer) => void }) {
    const filled = offer.type === 'RESCUE_PACKAGE';
    const meta = offer.distanceLabel;
    return (
        <article className="w-full bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="relative h-40 w-full bg-surface-container-high overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover" alt={offer.image.alt} src={offer.image.url} loading="lazy" />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap gap-1.5">
                    <span
                        className={cn(
                            'px-2 py-0.5 rounded font-label-md text-label-md font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm',
                            PILL[offer.modeLabel.tone ?? 'muted'],
                        )}
                    >
                        <Icon
                            name={offer.modeLabel.icon ?? (offer.modeLabel.tone === 'rescue' ? 'shield' : 'local_shipping')}
                            className="text-[14px]"
                        />
                        {offer.modeLabel.label}
                    </span>
                    <span className={cn('px-2 py-0.5 rounded font-code-xs text-code-xs', offer.highlight.style === 'dark' ? 'bg-surface-container-highest text-on-surface font-semibold' : TAG[offer.highlight.tone ?? 'muted'])}>
                        {offer.highlight.label}
                    </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-inverse-surface/85 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Icon name="star" fill className="text-[14px] text-secondary" />
                    <span className="font-code-xs text-code-xs text-inverse-on-surface font-semibold">{formatRating(offer.provider.rating)}</span>
                    <span className="font-code-xs text-code-xs text-inverse-on-surface/70">({offer.provider.reviewCount})</span>
                </div>
            </div>
            <div className="p-space-md flex flex-col gap-2">
                <div className="flex items-start justify-between gap-space-sm">
                    <div className="min-w-0">
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">{offer.provider.name}</span>
                        <h3 className="font-title-lg text-title-lg font-bold text-on-surface truncate">{offer.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">{formatMoney(offer.price)}</span>
                    </div>
                </div>
                {offer.nextSlot ? (
                    <div className="bg-surface-container-low rounded-lg p-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Icon name="schedule" className="text-[18px] text-primary" />
                            <span className="font-body-sm text-body-sm font-semibold text-on-surface">Next Open Hoist Slot:</span>
                        </div>
                        <span className="font-code-xs text-code-xs bg-primary-fixed text-on-primary-fixed font-bold px-2 py-0.5 rounded">{offer.nextSlot}</span>
                    </div>
                ) : offer.chips?.length ? (
                    <div className="flex items-center gap-2 flex-wrap text-on-surface-variant">
                        {offer.chips.map((c) => (
                            <span key={c} className="font-code-xs text-code-xs bg-surface-container px-2 py-0.5 rounded">
                                {c}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{offer.description}</p>
                )}
                <div className="pt-space-xs flex items-center justify-between gap-space-sm">
                    {meta ? (
                        <div className={cn('flex items-center gap-1 min-w-0', meta.tone === 'muted' ? 'text-on-surface-variant' : TEXT_TONE[meta.tone ?? 'primary'])}>
                            {meta.icon && <Icon name={meta.icon} className={cn('text-[16px]', meta.icon === 'inventory_2' && 'text-primary')} />}
                            <span className={cn('font-code-xs text-code-xs truncate', meta.tone === 'amber' ? 'font-bold' : 'font-semibold')}>{meta.label}</span>
                        </div>
                    ) : (
                        <span />
                    )}
                    <button
                        type="button"
                        onClick={() => onPrimary(offer)}
                        className={cn(
                            'min-h-[44px] px-space-md font-label-lg text-label-lg font-bold rounded-lg active:scale-95 transition-transform flex items-center gap-1.5 shrink-0',
                            filled
                                ? 'bg-primary hover:bg-primary-container text-on-primary shadow-sm'
                                : 'bg-surface-container-high hover:bg-surface-container-highest text-primary',
                        )}
                    >
                        <Icon name={offer.action.icon} className="text-[18px]" />
                        <span>{offer.action.label}</span>
                    </button>
                </div>
            </div>
        </article>
    );
}
