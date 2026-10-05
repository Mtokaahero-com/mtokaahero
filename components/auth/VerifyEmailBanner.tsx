'use client';

import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { authApi } from '@/lib/api/account';

const DISMISS_KEY = 'mtokaa.verify-banner.dismissed';

function readDismissed(): boolean {
    try {
        return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
        return false;
    }
}

export function VerifyEmailBanner() {
    const { data: session, status } = useSession();
    const [dismissed, setDismissed] = useState(false);
    const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

    useEffect(() => setDismissed(readDismissed()), []);

    if (status !== 'authenticated' || !session || session.user.emailVerified || dismissed) return null;

    const resend = async () => {
        setState('sending');
        // Re-read the session so the jwt callback refreshes a stale access token before we send it; skip the
        // call and show the failed state rather than sending a token we know is stale or invalid.
        const fresh = await getSession().catch(() => null);
        if (!fresh?.user.accessToken || fresh.error) {
            setState('failed');
            return;
        }
        try {
            await authApi.resendVerification(fresh.user.accessToken);
            setState('sent');
        } catch {
            setState('failed');
        }
    };

    const dismiss = () => {
        try {
            sessionStorage.setItem(DISMISS_KEY, '1');
        } catch {
            // Storage can be unavailable (private mode); dismissing for this render is enough.
        }
        setDismissed(true);
    };

    return (
        <div role="status" className="relative z-[60] flex items-center gap-2 bg-amber-500 text-amber-950 px-3.5 py-2 text-xs font-medium shadow-sm">
            <Icon name="warning" className="text-[16px] shrink-0" />
            <p className="leading-tight">
                {state === 'sent'
                    ? `Link sent to ${session.user.email}`
                    : state === 'failed'
                      ? 'Could not send the link. Try again in a minute.'
                      : 'Verify your email to register a business.'}
            </p>
            {state !== 'sent' && (
                <button type="button" onClick={resend} disabled={state === 'sending'} className="font-bold underline ml-1 hover:text-amber-900">
                    Resend
                </button>
            )}
            <button type="button" onClick={dismiss} aria-label="Dismiss" className="ml-auto p-1 text-amber-950/80 hover:text-amber-950 rounded">
                <Icon name="close" className="text-[16px]" />
            </button>
        </div>
    );
}
