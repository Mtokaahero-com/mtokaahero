'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { authErrorMessage, passwordStrength } from '@/components/auth/authErrors';
import { FormError } from '@/components/auth/FormError';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';
import { cn } from '@/lib/utils';

const schema = z.object({
    firstName: z.string().trim().min(1, 'Required').max(100),
    lastName: z.string().trim().min(1, 'Required').max(100),
    email: z.string().trim().email('Enter a valid email'),
    phone: z.string().trim().max(20).optional().or(z.literal('')),
    password: z.string().min(10, 'Use at least 10 characters').max(128),
});
type Values = z.infer<typeof schema>;

const STRENGTH_LABEL = ['', 'Too short', 'Okay', 'Good', 'Strong'] as const;

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, control, setError: setFieldError, formState } = useForm<Values>({
        resolver: zodResolver(schema),
    });
    const strength = passwordStrength(useWatch({ control, name: 'password' }) ?? '');

    const onSubmit = async (values: Values) => {
        setError(null);
        try {
            await authApi.register({ ...values, phone: values.phone || undefined });
        } catch (err) {
            if (err instanceof ApiError) {
                for (const fe of err.fieldErrors) setFieldError(fe.field as keyof Values, { message: fe.message });
                setError(authErrorMessage(err.code));
            } else {
                setError(authErrorMessage('HTTP_ERROR'));
            }
            return;
        }
        const res = await signIn('credentials', { identifier: values.email, password: values.password, redirect: false });
        if (res?.error) {
            router.replace('/auth/signin');
            return;
        }
        router.replace('/?welcome=1');
        router.refresh();
    };

    const field = (name: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
        <div className="space-y-1.5">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} aria-invalid={Boolean(formState.errors[name])} {...props} {...register(name)} />
            {formState.errors[name] && <p className="text-xs text-rescue">{formState.errors[name]?.message}</p>}
        </div>
    );

    return (
        <AuthShell title="Create your account" subtitle="Book garages, reserve parts and track rescues.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <AuthTabs active="signup" />
                <FormError message={error} />
                <div className="grid grid-cols-2 gap-3">
                    {field('firstName', 'First name', { autoComplete: 'given-name' })}
                    {field('lastName', 'Last name', { autoComplete: 'family-name' })}
                </div>
                {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
                {field('phone', 'Phone (optional)', { type: 'tel', autoComplete: 'tel', placeholder: '0712 345 678' })}
                <div className="space-y-1.5">
                    <PasswordField id="password" label="Password" autoComplete="new-password" error={formState.errors.password?.message} {...register('password')} />
                    <div className="flex gap-1" aria-hidden>
                        {[1, 2, 3, 4].map((i) => (
                            <span key={i} className={cn('h-1 flex-1 rounded-full', i <= strength ? (strength < 2 ? 'bg-rescue' : strength < 3 ? 'bg-warning' : 'bg-success') : 'bg-border')} />
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{STRENGTH_LABEL[strength] || 'At least 10 characters'}</p>
                </div>
                <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
                    {formState.isSubmitting ? 'Creating account…' : 'Create account'}
                </Button>
                <p className="text-center text-xs text-muted-foreground">We will email you a link to verify your address.</p>
            </form>
        </AuthShell>
    );
}
