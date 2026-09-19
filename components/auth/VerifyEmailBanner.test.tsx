import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useSession = vi.fn();
vi.mock('next-auth/react', () => ({ useSession: () => useSession() }));
const resendVerification = vi.fn().mockResolvedValue(undefined);
vi.mock('@/lib/api/account', () => ({ authApi: { resendVerification: (t: string) => resendVerification(t) } }));

import { VerifyEmailBanner } from './VerifyEmailBanner';

const session = (emailVerified: boolean) => ({
    status: 'authenticated',
    data: { user: { emailVerified, accessToken: 'at', email: 'jane@example.com' } },
});

describe('VerifyEmailBanner', () => {
    beforeEach(() => {
        sessionStorage.clear();
        resendVerification.mockClear();
    });

    it('renders nothing for verified or signed-out users', () => {
        useSession.mockReturnValue(session(true));
        const { container, rerender } = render(<VerifyEmailBanner />);
        expect(container).toBeEmptyDOMElement();
        useSession.mockReturnValue({ status: 'unauthenticated', data: null });
        rerender(<VerifyEmailBanner />);
        expect(container).toBeEmptyDOMElement();
    });

    it('resends and can be dismissed for the session', async () => {
        useSession.mockReturnValue(session(false));
        const { container } = render(<VerifyEmailBanner />);
        await userEvent.click(screen.getByRole('button', { name: 'Resend' }));
        expect(resendVerification).toHaveBeenCalledWith('at');
        expect(await screen.findByText('Link sent to jane@example.com')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
        expect(container).toBeEmptyDOMElement();
    });
});
