'use client';

import { forwardRef, useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { cn } from '@/lib/utils';
import { IconField } from './IconField';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    error?: string;
    labelAction?: React.ReactNode;
    /** "filled" matches the sign-in card; "outlined" matches the reset-password card. */
    variant?: 'filled' | 'outlined';
    /** Extra trailing content shown before the visibility toggle (e.g. a match check). */
    status?: React.ReactNode;
    tone?: 'default' | 'success';
};

export const PasswordField = forwardRef<HTMLInputElement, Props>(
    ({ label, error, id, labelAction, variant = 'filled', status, tone = 'default', ...props }, ref) => {
        const [visible, setVisible] = useState(false);
        const toggle = (
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                className={cn(
                    'text-on-surface-variant hover:text-on-surface focus:outline-none flex items-center justify-center p-1 rounded',
                    variant === 'filled' && 'absolute right-3',
                )}
            >
                <Icon name={visible ? 'visibility_off' : 'visibility'} className="text-[20px]" />
            </button>
        );

        if (variant === 'filled') {
            return (
                <IconField
                    ref={ref}
                    id={id}
                    label={label}
                    icon="lock"
                    error={error}
                    labelAction={labelAction}
                    type={visible ? 'text' : 'password'}
                    trailing={toggle}
                    {...props}
                />
            );
        }

        return (
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 font-heading" htmlFor={id}>
                    {label}
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Icon name={tone === 'success' ? 'lock_reset' : 'lock'} className="text-[20px]" />
                    </span>
                    <input
                        ref={ref}
                        id={id}
                        type={visible ? 'text' : 'password'}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={cn(
                            'w-full pl-10 pr-20 py-3 text-sm font-medium text-slate-900 bg-white border rounded-[12px] focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 shadow-sm tracking-wide',
                            error
                                ? 'border-red-400 focus:ring-red-500/20'
                                : tone === 'success'
                                  ? 'border-emerald-400 bg-emerald-50/30 focus:ring-emerald-500/20'
                                  : 'border-slate-300 focus:ring-blue-600/20 focus:border-blue-600',
                        )}
                        {...props}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2.5">
                        {status}
                        {toggle}
                    </span>
                </div>
                {error && (
                    <p id={`${id}-error`} className="text-xs text-red-600 mt-1.5">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);
PasswordField.displayName = 'PasswordField';
