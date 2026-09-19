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
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        router.replace(callbackUrl.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/');
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <AuthTabs active="signin" />
            {notice && <p className="rounded-md bg-success-subtle px-3 py-2 text-sm text-success">{notice}</p>}
            <FormError message={error} />
            <div className="space-y-1.5">
                <Label htmlFor="identifier">Email or phone</Label>
                <Input id="identifier" autoComplete="username" placeholder="jane@example.com or 0712 345 678" {...register('identifier')} />
                {formState.errors.identifier && <p className="text-xs text-rescue">{formState.errors.identifier.message}</p>}
            </div>
            <PasswordField id="password" label="Password" autoComplete="current-password" error={formState.errors.password?.message} {...register('password')} />
            <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                    Forgot password?
                </Link>
            </div>
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
        </form>
    );
}

export default function SignInPage() {
    return (
        <AuthShell
            title="Welcome to MtokaaHero"
            subtitle="Roadside rescue, trusted garages and genuine parts."
            footer={
                <span>
                    <Link href="/terms" className="hover:underline">Terms</Link> · <Link href="/privacy" className="hover:underline">Privacy</Link>
                </span>
            }
        >
            <Suspense>
                <SignInForm />
            </Suspense>
        </AuthShell>
    );
}
