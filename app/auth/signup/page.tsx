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
import { IconField } from '@/components/auth/IconField';
import { PasswordField } from '@/components/auth/PasswordField';
import { Icon } from '@/components/brand/Icon';
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

    const field = (name: keyof Values, label: string, icon: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
        <IconField id={name} label={label} icon={icon} error={formState.errors[name]?.message} {...props} {...register(name)} />
    );

    return (
        <AuthShell title="Welcome to MtokaaHero">
            <AuthTabs active="signup" />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest p-5 rounded-xl shadow-md flex flex-col gap-4" noValidate>
                <FormError message={error} />
                <div className="grid grid-cols-2 gap-3">
                    {field('firstName', 'First name', 'badge', { autoComplete: 'given-name', placeholder: 'Jane' })}
                    {field('lastName', 'Last name', 'badge', { autoComplete: 'family-name', placeholder: 'Wanjiku' })}
                </div>
                {field('email', 'Email', 'mail', { type: 'email', autoComplete: 'email', placeholder: 'name@example.com' })}
                {field('phone', 'Phone (optional)', 'call', { type: 'tel', autoComplete: 'tel', placeholder: '0712 345 678' })}
                <div className="flex flex-col gap-1.5">
                    <PasswordField
                        id="password"
                        label="Password"
                        autoComplete="new-password"
                        placeholder="At least 10 characters"
                        error={formState.errors.password?.message}
                        {...register('password')}
                    />
                    <div className="flex gap-1" aria-hidden>
                        {[1, 2, 3, 4].map((i) => (
                            <span
                                key={i}
                                className={cn(
                                    'h-1 flex-1 rounded-pill',
                                    i <= strength ? (strength < 2 ? 'bg-error' : strength < 3 ? 'bg-secondary-container' : 'bg-primary-container') : 'bg-surface-container-high',
                                )}
                            />
                        ))}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{STRENGTH_LABEL[strength] || 'At least 10 characters'}</p>
                </div>
                <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="w-full py-3.5 mt-2 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-label-lg text-label-lg font-bold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <span>{formState.isSubmitting ? 'Creating account…' : 'Create account'}</span>
                    <Icon name="arrow_forward" className="text-[18px]" />
                </button>
                <p className="text-center font-body-sm text-body-sm text-on-surface-variant">We will email you a link to verify your address.</p>
            </form>
        </AuthShell>
    );
}
