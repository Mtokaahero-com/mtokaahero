'use client';

import { forwardRef } from 'react';
import { Icon } from '@/components/brand/Icon';
import { cn } from '@/lib/utils';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    icon: string;
    error?: string;
    /** Rendered at the right end of the label row, e.g. "Forgot password?". */
    labelAction?: React.ReactNode;
    /** Rendered inside the field, after the input (e.g. a visibility toggle). */
    trailing?: React.ReactNode;
};

/** Filled field with a leading icon, as on the Stitch sign-in card. */
export const IconField = forwardRef<HTMLInputElement, Props>(({ id, label, icon, error, labelAction, trailing, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface-variant font-semibold" htmlFor={id}>
                {label}
            </label>
            {labelAction}
        </div>
        <div
            className={cn(
                'relative flex items-center bg-surface-container-low px-3 py-2.5 rounded-xl border transition-all focus-within:border-primary',
                error ? 'border-error' : 'border-transparent',
            )}
        >
            <Icon name={icon} className="text-[18px] text-on-surface-variant mr-2" />
            <input
                ref={ref}
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn('w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none', trailing && 'pr-8', className)}
                {...props}
            />
            {trailing}
        </div>
        {error && (
            <p id={`${id}-error`} className="font-body-sm text-body-sm text-error">
                {error}
            </p>
        )}
    </div>
));
IconField.displayName = 'IconField';
