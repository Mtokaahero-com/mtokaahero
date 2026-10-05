'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AuthFlowShell } from '@/components/auth/AuthShell';
import { StatusCard } from '@/components/auth/StatusCard';
import { Icon } from '@/components/brand/Icon';
import { authApi } from '@/lib/api/account';

const primaryBtn =
    'w-full py-3 px-4 bg-[#1d4ed8] hover:bg-blue-800 text-white font-heading font-semibold text-sm rounded-[12px] shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70';
const amberBtn =
    'w-full py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-heading font-semibold text-sm rounded-[12px] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70';

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

    if (state === 'verifying') {
        return (
            <StatusCard tone="loading" title="Verifying your email…" meta="Step 01/02">
                Validating your secure authentication token. This usually takes just a few seconds.
            </StatusCard>
        );
    }

    if (state === 'verified') {
        return (
            <StatusCard
                tone="success"
                title="Email verified"
                meta="Success"
                action={
                    <Link href={status === 'authenticated' ? '/' : '/auth/signin'} className={primaryBtn}>
                        Continue
                        <Icon name="arrow_forward" className="text-[18px]" />
                    </Link>
                }
            >
                <p>You can now register your garage or join your team.</p>
                {session?.user.email && (
                    <span className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700">
                        <Icon name="verified_user" className="text-[15px] text-emerald-600" />
                        {session.user.email}
                    </span>
                )}
            </StatusCard>
        );
    }

    return (
        <StatusCard
            tone="warning"
            badge="Token expired"
            meta="Attention"
            title="This link is invalid or has expired"
            action={
                status === 'authenticated' && session ? (
                    <button
                        type="button"
                        className={amberBtn}
                        disabled={resent}
                        onClick={() => authApi.resendVerification(session.user.accessToken).then(() => setResent(true))}
                    >
                        <Icon name="mail" className="text-[18px]" />
                        {resent ? 'Link sent — check your email' : 'Resend verification email'}
                    </button>
                ) : (
                    <Link href="/auth/signin?callbackUrl=/auth/verify-email" className={amberBtn}>
                        <Icon name="login" className="text-[18px]" />
                        Sign in to resend
                    </Link>
                )
            }
        >
            Verification links are single-use and expire after 24 hours for security reasons.
        </StatusCard>
    );
}

export default function VerifyEmailPage() {
    return (
        <AuthFlowShell backHref="/" backLabel="Back to home">
            <div className="mb-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#1d4ed8] border border-blue-100 px-2.5 py-0.5 rounded-pill mb-2">
                    <span className="w-1.5 h-1.5 rounded-pill bg-[#1d4ed8]" />
                    Security verification
                </span>
                <h1 className="text-xl font-bold font-heading text-slate-900 tracking-tight leading-tight">Email Verification</h1>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">Confirming your address keeps workshop accounts and rescue payouts secure.</p>
            </div>
            <Suspense>
                <Verify />
            </Suspense>
        </AuthFlowShell>
    );
}
