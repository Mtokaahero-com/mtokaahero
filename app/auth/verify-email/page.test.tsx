import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const updateCalls: unknown[] = [];
// A fresh session object (including a fresh `update` function reference) is returned on every
// render, the way next-auth's real useSession does after update() resolves. This is what would
// re-trigger the verify-email effect forever without the one-shot `refreshed` ref guard.
const useSession = vi.fn(() => ({
    status: 'authenticated',
    data: { user: { emailVerified: true, accessToken: 'at', email: 'jane@example.com' } },
    update: vi.fn((args: unknown) => {
        updateCalls.push(args);
        return Promise.resolve(undefined);
    }),
}));
vi.mock('next-auth/react', () => ({ useSession: () => useSession() }));

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams('token=tok123') }));

const confirmEmailVerification = vi.fn().mockResolvedValue(undefined);
const resendVerification = vi.fn().mockResolvedValue(undefined);
vi.mock('@/lib/api/account', () => ({
    authApi: {
        confirmEmailVerification: (t: string) => confirmEmailVerification(t),
        resendVerification: (t: string) => resendVerification(t),
    },
}));

import VerifyEmailPage from './page';

describe('VerifyEmailPage', () => {
    it('refreshes the session exactly once after verification, even across re-renders', async () => {
        const { rerender } = render(<VerifyEmailPage />);

        expect(await screen.findByText('Email verified')).toBeInTheDocument();
        await waitFor(() => expect(updateCalls).toHaveLength(1));

        // Force a couple more re-renders (as would happen when update() resolves and hands back a
        // new session/status from useSession) and confirm the effect does not fire again.
        rerender(<VerifyEmailPage />);
        rerender(<VerifyEmailPage />);

        await waitFor(() => expect(updateCalls).toHaveLength(1));
        expect(updateCalls[0]).toEqual({ refreshUser: true });
    });
});
