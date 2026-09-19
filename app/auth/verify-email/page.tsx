'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { StatusCard } from '@/components/auth/StatusCard';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/account';

function Verify() {
    const token = useSearchParams().get('token');
    const { data: session, status, update } = useSession();
    const [state, setState] = useState<'verifying' | 'verified' | 'invalid'>(token ? 'verifying' : 'invalid');
    const [resent, setResent] = useState(false);
    // Tokens are single use and React may run effects twice in development, so confirm exactly once.
    const started = useRef(false);
    // update() changes status/update's identity, which would otherwise re-trigger this effect forever.
    const refreshed = useRef(false);

    useEffect(() => {
        if (!token || started.current) return;
        started.current = true;
        authApi
            .confirmEmailVerification(token)
            .then(() => setState('verified'))
            .catch(() => setState('invalid'));
    }, [token]);

    useEffect(() => {
        if (state === 'verified' && status === 'authenticated' && !refreshed.current) {
            refreshed.current = true;
            void update({ refreshUser: true });
        }
    }, [state, status, update]);

    if (state === 'verifying') return <StatusCard tone="loading" title="Verifying your email…" />;

    if (state === 'verified') {
        return (
            <StatusCard
                tone="success"
                title="Email verified"
                action={<Button asChild className="w-full"><Link href={status === 'authenticated' ? '/' : '/auth/signin'}>Continue</Link></Button>}
            >
                You can now register your garage or join your team.
            </StatusCard>
        );
    }

    return (
        <StatusCard
            tone="warning"
            title="This link is invalid or has expired"
            action={
                status === 'authenticated' && session ? (
                    <Button
                        className="w-full"
                        disabled={resent}
                        onClick={() => authApi.resendVerification(session.user.accessToken).then(() => setResent(true))}
                    >
                        {resent ? 'Link sent — check your email' : 'Resend verification email'}
                    </Button>
                ) : (
                    <Button asChild className="w-full"><Link href="/auth/signin?callbackUrl=/auth/verify-email">Sign in to resend</Link></Button>
                )
            }
        >
            Verification links work for 24 hours and only once.
        </StatusCard>
    );
}

export default function VerifyEmailPage() {
    return (
        <AuthShell title="Verify your email" showSos={false}>
            <Suspense>
                <Verify />
            </Suspense>
        </AuthShell>
    );
}
