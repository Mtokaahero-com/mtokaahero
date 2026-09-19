'use client';

import { MailWarning, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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
        try {
            await authApi.resendVerification(session.user.accessToken);
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
        <div role="status" className="flex items-center gap-3 border-b border-warning/30 bg-warning-subtle px-4 py-2 text-sm text-[#B45309]">
            <MailWarning className="h-4 w-4 shrink-0" />
            <p className="flex-1">
                {state === 'sent'
                    ? `Link sent to ${session.user.email}`
                    : state === 'failed'
                      ? 'Could not send the link. Try again in a minute.'
                      : 'Verify your email to register a business or join a team.'}
            </p>
            {state !== 'sent' && (
                <button type="button" onClick={resend} disabled={state === 'sending'} className="font-semibold underline underline-offset-4">
                    Resend
                </button>
            )}
            <button type="button" onClick={dismiss} aria-label="Dismiss" className="p-1">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
