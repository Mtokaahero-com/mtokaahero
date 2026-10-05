import type { LabelTone } from '@/lib/api/marketplace';

/** Text colour for a provider label tone, as used in the Stitch cards' mono metadata. */
export const TEXT_TONE: Record<LabelTone, string> = {
    rescue: 'text-tertiary',
    primary: 'text-primary',
    amber: 'text-secondary',
    muted: 'text-on-surface-variant',
    success: 'text-emerald-700',
};
