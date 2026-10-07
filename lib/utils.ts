import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The Stitch type scale adds named font sizes (text-headline-sm, text-code-xs, ...). Without registering them,
// tailwind-merge reads them as text colours and drops whichever of the two comes first.
const STITCH_FONT_SIZES = [
    'headline-xl',
    'headline-xl-mobile',
    'headline-lg',
    'headline-lg-mobile',
    'headline-md',
    'headline-sm',
    'title-lg',
    'title-md',
    'body-lg',
    'body-md',
    'body-sm',
    'label-lg',
    'label-md',
    'code-sm',
    'code-xs',
];

const twMerge = extendTailwindMerge({
    extend: { classGroups: { 'font-size': [{ text: STITCH_FONT_SIZES }] } },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
