'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { authErrorMessage } from '@/components/auth/authErrors';
import { FormError } from '@/components/auth/FormError';
import { IconField } from '@/components/auth/IconField';
import { PasswordField } from '@/components/auth/PasswordField';
import { Icon } from '@/components/brand/Icon';
import { safeCallbackPath } from '@/lib/auth/redirect';

const schema = z.object({
    identifier: z.string().trim().min(1, 'Enter your email or phone number'),
    password: z.string().min(1, 'Enter your password'),
});
type Values = z.infer<typeof schema>;

function SignInForm() {
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get('callbackUrl') ?? '/';
    const notice = params.get('reset') === '1' ? 'Password updated. Sign in with your new password.' : null;
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: Values) => {
        setError(null);
        const res = await signIn('credentials', { ...values, redirect: false });
        if (!res || res.error) {
            setError(authErrorMessage(res?.error ?? 'HTTP_ERROR'));
            return;
        }
        router.replace(safeCallbackPath(callbackUrl, window.location.origin));
        router.refresh();
    };

    return (
        <>
            <AuthTabs active="signin" />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest p-5 rounded-xl shadow-md flex flex-col gap-4" noValidate>
                {notice && (
                    <p role="status" className="rounded-xl bg-success-subtle px-3 py-2.5 font-body-sm text-body-sm text-success">
                        {notice}
                    </p>
                )}
                <FormError message={error} />
                <IconField
                    id="identifier"
                    label="Email or phone"
                    icon="person"
                    autoComplete="username"
                    placeholder="name@example.com or +254..."
                    error={formState.errors.identifier?.message}
                    {...register('identifier')}
                />
                <PasswordField
                    id="password"
                    label="Password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    error={formState.errors.password?.message}
                    labelAction={
                        <Link href="/auth/forgot-password" className="font-label-md text-label-md text-primary font-semibold hover:underline">
                            Forgot password?
                        </Link>
                    }
                    {...register('password')}
                />
                <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="w-full py-3.5 mt-2 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-label-lg text-label-lg font-bold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <span>{formState.isSubmitting ? 'Signing in…' : 'Sign in'}</span>
                    <Icon name="arrow_forward" className="text-[18px]" />
                </button>
            </form>
        </>
    );
}

export default function SignInPage() {
    return (
        <AuthShell title="Welcome to MtokaaHero">
            <Suspense>
                <SignInForm />
            </Suspense>
        </AuthShell>
    );
}
