'use client';

import { Icon } from '@/components/brand/Icon';
import type { Offer } from '@/lib/api/marketplace';
import { formatMoney, formatRating } from '@/lib/format';
import { cn } from '@/lib/utils';
import { TEXT_TONE } from './tones';

const MODE_PILL: Record<string, string> = {
    rescue: 'bg-tertiary-container text-on-tertiary',
    primary: 'bg-primary-container text-on-primary',
    amber: 'bg-surface-container-lowest text-on-surface font-semibold',
    muted: 'bg-surface-container-highest text-on-surface font-semibold',
    success: 'bg-surface-container-lowest text-on-surface font-semibold',
};

const DARK_ICON: Record<string, string> = {
    amber: 'text-secondary',
    primary: 'text-primary-fixed',
    rescue: 'text-tertiary-fixed-dim',
    muted: 'text-surface-container-highest',
    success: 'text-emerald-300',
};

const LIGHT_DOT: Record<string, string> = {
    amber: 'bg-secondary',
    primary: 'bg-primary',
    rescue: 'bg-tertiary',
    muted: 'bg-outline',
    success: 'bg-emerald-500',
};

const PRICE_NOTE: Record<string, string> = {
    amber: 'text-secondary-container font-semibold',
    primary: 'text-primary font-semibold',
    rescue: 'text-tertiary font-semibold',
    muted: 'text-on-surface-variant',
    success: 'text-emerald-700 font-semibold',
};

export function OfferCard({
    offer,
    onPrimary,
    onAddToCart,
}: {
    offer: Offer;
    onPrimary: (offer: Offer) => void;
    onAddToCart: (offer: Offer) => void;
}) {
    const rescue = offer.type === 'RESCUE_PACKAGE';
    const part = offer.type === 'PART';
    const mode = offer.modeLabel;
    const hl = offer.highlight;

    const primaryBtn = cn(
        'w-full py-2 rounded-lg font-label-md text-label-md shadow-sm transition-colors flex items-center justify-center gap-1',
        rescue ? 'bg-tertiary-container hover:bg-tertiary text-on-tertiary' : 'bg-primary-container hover:bg-primary text-on-primary',
    );
    const tonalBtn =
        'w-full py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors flex items-center justify-center gap-1';

    return (
        <article className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden relative group">
            <div className="relative w-full h-44 bg-surface-container overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={offer.image.alt}
                    src={offer.image.url}
                    loading="lazy"
                />
                <div
                    className={cn(
                        'absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full font-label-md text-label-md flex items-center gap-1 shadow-sm',
                        MODE_PILL[mode.tone ?? 'primary'],
                    )}
                >
                    {mode.icon ? (
                        <Icon name={mode.icon} className={cn('text-[14px]', mode.tone === 'amber' && 'text-secondary')} />
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
                    )}
                    <span>{mode.label}</span>
                </div>
                <div
                    className={cn(
                        'absolute bottom-2.5 left-2.5 backdrop-blur-md px-2 py-0.5 rounded font-code-xs text-code-xs flex items-center gap-1',
                        hl.style === 'dark' ? 'bg-on-surface/85 text-on-primary' : 'bg-surface-container-lowest/90 text-on-surface',
                    )}
                >
                    {hl.icon ? (
                        <Icon
                            name={hl.icon}
                            fill={hl.icon === 'star'}
                            className={cn('text-[14px]', hl.style === 'dark' ? DARK_ICON[hl.tone ?? 'amber'] : TEXT_TONE[hl.tone ?? 'amber'])}
                        />
                    ) : (
                        <span className={cn('w-1.5 h-1.5 rounded-full', LIGHT_DOT[hl.tone ?? 'primary'])} />
                    )}
                    <span className={cn(hl.style === 'light' && hl.tone !== 'primary' && 'font-bold')}>{hl.label}</span>
                </div>
            </div>
            <div className="p-space-md flex flex-col flex-grow justify-between gap-space-sm">
                <div>
                    <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-label-md text-label-md text-primary font-bold flex items-center gap-1 min-w-0">
                            <span className="truncate">{offer.provider.name}</span>
                            {offer.provider.verified && (
                                <span title="Verified Workshop" className="inline-flex">
                                    <Icon name="verified" className="text-[15px] text-primary" />
                                </span>
                            )}
                        </span>
                        <div className="flex items-center gap-1 text-secondary shrink-0">
                            <Icon name="star" fill className="text-[14px]" />
                            <span className="font-code-sm text-code-sm font-semibold text-on-surface">{formatRating(offer.provider.rating)}</span>
                            <span className="font-code-xs text-code-xs text-on-surface-variant">({offer.provider.reviewCount})</span>
                        </div>
                    </div>
                    <h4
                        className="font-title-md text-title-md text-on-surface hover:text-primary transition-colors cursor-pointer line-clamp-2"
                        onClick={() => onPrimary(offer)}
                    >
                        {offer.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">{offer.description}</p>
                </div>
                <div className="bg-surface-container-low p-space-xs px-space-sm rounded-lg flex items-center justify-between gap-2 text-on-surface">
                    <div className="flex items-center gap-1 min-w-0">
                        <Icon name={offer.spec.icon} className="text-[16px] text-primary" />
                        <span className="font-code-xs text-code-xs font-semibold truncate">{offer.spec.label}</span>
                    </div>
                    <span
                        className={cn(
                            'font-code-xs text-code-xs text-right',
                            TEXT_TONE[offer.spec.note.tone ?? 'muted'],
                            offer.spec.note.tone === 'rescue' ? 'font-bold' : 'font-semibold',
                        )}
                    >
                        {offer.spec.note.label}
                    </span>
                </div>
                <div className="pt-space-xs flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-2">
                        <div className="flex flex-col shrink-0">
                            <span className="font-code-xs text-code-xs text-on-surface-variant">{offer.price.label}</span>
                            <span className="font-headline-md text-headline-md text-on-surface font-bold leading-none whitespace-nowrap">{formatMoney(offer.price)}</span>
                        </div>
                        {offer.priceNote &&
                            (offer.priceNote.style === 'chip' ? (
                                <span className="font-code-xs text-code-xs bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-bold text-right">
                                    {offer.priceNote.label}
                                </span>
                            ) : (
                                <span className={cn('font-code-xs text-code-xs text-right', PRICE_NOTE[offer.priceNote.tone ?? 'muted'])}>
                                    {offer.priceNote.label}
                                </span>
                            ))}
                    </div>
                    <div className="grid grid-cols-2 gap-space-xs mt-1">
                        {part ? (
                            <>
                                <button type="button" className={tonalBtn} onClick={() => onPrimary(offer)}>
                                    <Icon name={offer.action.icon} className="text-[16px]" />
                                    {offer.action.label}
                                </button>
                                <button type="button" className={primaryBtn} onClick={() => onAddToCart(offer)}>
                                    <Icon name="add_shopping_cart" className="text-[16px]" />
                                    Add to Cart
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" className={primaryBtn} onClick={() => onPrimary(offer)}>
                                    <Icon name={offer.action.icon} className="text-[16px]" />
                                    {offer.action.label}
                                </button>
                                <button type="button" className={tonalBtn} onClick={() => onAddToCart(offer)}>
                                    <Icon name="shopping_cart" className="text-[16px]" />
                                    Add to Cart
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export function OfferCardSkeleton() {
    return (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden animate-pulse" aria-hidden="true">
            <div className="h-44 bg-surface-container" />
            <div className="p-space-md flex flex-col gap-space-sm">
                <div className="h-3 w-1/2 rounded bg-surface-container" />
                <div className="h-5 w-4/5 rounded bg-surface-container" />
                <div className="h-3 w-full rounded bg-surface-container-low" />
                <div className="h-8 w-full rounded-lg bg-surface-container-low" />
                <div className="h-6 w-1/3 rounded bg-surface-container" />
                <div className="grid grid-cols-2 gap-space-xs">
                    <div className="h-9 rounded-lg bg-surface-container" />
                    <div className="h-9 rounded-lg bg-surface-container-high" />
                </div>
            </div>
        </div>
    );
}
