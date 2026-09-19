'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { authErrorMessage } from '@/components/auth/authErrors';
import { FormError } from '@/components/auth/FormError';
import { StatusCard } from '@/components/auth/StatusCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';

const schema = z.object({ email: z.string().trim().email('Enter a valid email') });
type Values = z.infer<typeof schema>;
const COOLDOWN_S = 60;

export default function ForgotPasswordPage() {
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    const send = async (email: string) => {
        setError(null);
        try {
            await authApi.requestPasswordReset(email);
            setSentTo(email);
            setCooldown(COOLDOWN_S);
        } catch (err) {
            setError(authErrorMessage(err instanceof ApiError ? err.code : 'HTTP_ERROR'));
        }
    };

    return (
        <AuthShell title="Reset your password" showSos={false} footer={<Link href="/auth/signin" className="font-semibold text-primary hover:underline">Back to sign in</Link>}>
            {sentTo ? (
                <StatusCard
                    tone="success"
                    title="Check your email"
                    action={
                        <Button variant="secondary" className="w-full" disabled={cooldown > 0} onClick={() => send(sentTo)}>
                            {cooldown > 0 ? `Resend in 0:${String(cooldown).padStart(2, '0')}` : 'Resend link'}
                        </Button>
                    }
                >
                    If an account exists for <strong className="text-foreground">{sentTo}</strong>, a reset link is on its way. It expires in 30 minutes.
                </StatusCard>
            ) : (
                <form onSubmit={handleSubmit((v) => send(v.email))} className="space-y-4" noValidate>
                    <p className="text-sm text-muted-foreground">Enter the email you signed up with and we&apos;ll send you a link to set a new password.</p>
                    <FormError message={error} />
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            aria-invalid={Boolean(formState.errors.email)}
                            aria-describedby={formState.errors.email ? 'email-error' : undefined}
                            {...register('email')}
                        />
                        {formState.errors.email && (
                            <p id="email-error" className="text-xs text-rescue">
                                {formState.errors.email.message}
                            </p>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
                        {formState.isSubmitting ? 'Sending…' : 'Send reset link'}
                    </Button>
                </form>
            )}
        </AuthShell>
    );
}
