'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { authErrorMessage } from '@/components/auth/authErrors';
import { FormError } from '@/components/auth/FormError';
import { PasswordField } from '@/components/auth/PasswordField';
import { StatusCard } from '@/components/auth/StatusCard';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';

const schema = z
    .object({
        password: z.string().min(10, 'Use at least 10 characters').max(128),
        confirm: z.string(),
    })
    .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });
type Values = z.infer<typeof schema>;

function ResetForm() {
    const router = useRouter();
    const token = useSearchParams().get('token');
    const [expired, setExpired] = useState(!token);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });

    if (expired) {
        return (
            <StatusCard
                tone="warning"
                title="This link has expired"
                action={<Button asChild className="w-full"><Link href="/auth/forgot-password">Send a new link</Link></Button>}
            >
                Reset links work for 30 minutes and only once.
            </StatusCard>
        );
    }

    const onSubmit = async (values: Values) => {
        setError(null);
        try {
            await authApi.confirmPasswordReset(token!, values.password);
            router.replace('/auth/signin?reset=1');
        } catch (err) {
            if (err instanceof ApiError && err.code === 'TOKEN_INVALID') setExpired(true);
            else setError(authErrorMessage(err instanceof ApiError ? err.code : 'HTTP_ERROR'));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormError message={error} />
            <PasswordField id="password" label="New password" autoComplete="new-password" error={formState.errors.password?.message} {...register('password')} />
            <PasswordField id="confirm" label="Confirm password" autoComplete="new-password" error={formState.errors.confirm?.message} {...register('confirm')} />
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Updating…' : 'Update password'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">You will be signed out on all devices.</p>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthShell title="Choose a new password" showSos={false}>
            <Suspense>
                <ResetForm />
            </Suspense>
        </AuthShell>
    );
}
