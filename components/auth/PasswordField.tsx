'use client';

import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = InputProps & { label: string; error?: string };

export const PasswordField = forwardRef<HTMLInputElement, Props>(({ label, error, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    ref={ref}
                    id={id}
                    type={visible ? 'text' : 'password'}
                    className="pr-11"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && (
                <p id={`${id}-error`} className="text-xs text-rescue">
                    {error}
                </p>
            )}
        </div>
    );
});
PasswordField.displayName = 'PasswordField';
