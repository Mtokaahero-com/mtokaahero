import { describe, expect, it, vi } from 'vitest';
import type { AuthResult } from '@/lib/api/account';
import { accessTokenExpiresAt, REFRESH_MARGIN_MS, refreshIfNeeded, tokenFromAuthResult } from './tokens';

const jwtWithExp = (exp: number) =>
    `x.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.y`;

const result = (exp: number, refreshToken = 'r1'): AuthResult => ({
    accessToken: jwtWithExp(exp),
    refreshToken,
    user: {
        id: 'u1',
        email: 'jane@example.com',
        phone: null,
        firstName: 'Jane',
        lastName: 'Doe',
        platformRole: 'USER',
        emailVerified: false,
    },
});

describe('tokens', () => {
    it('reads the access token expiry in milliseconds', () => {
        expect(accessTokenExpiresAt(jwtWithExp(1_000))).toBe(1_000_000);
    });

    it('keeps a token that is not close to expiry', async () => {
        const token = tokenFromAuthResult(result(2_000));
        const refresh = vi.fn();
        await expect(refreshIfNeeded(token, 2_000_000 - REFRESH_MARGIN_MS - 1, refresh)).resolves.toBe(token);
        expect(refresh).not.toHaveBeenCalled();
    });

    it('refreshes inside the margin and stores the new tokens', async () => {
        const token = tokenFromAuthResult(result(2_000));
        const refresh = vi.fn().mockResolvedValue(result(3_000, 'r2'));
        const next = await refreshIfNeeded(token, 2_000_000 - 1_000, refresh);
        expect(refresh).toHaveBeenCalledWith('r1');
        expect(next).toMatchObject({ refreshToken: 'r2', accessTokenExpiresAt: 3_000_000 });
        expect(next.error).toBeUndefined();
    });

    it('marks the token as failed when refresh throws, and does not retry after that', async () => {
        const token = tokenFromAuthResult(result(2_000));
        const failing = vi.fn().mockRejectedValue(new Error('401'));
        const failed = await refreshIfNeeded(token, 2_000_000, failing);
        expect(failed.error).toBe('RefreshFailed');
        const again = vi.fn();
        await refreshIfNeeded(failed, 2_000_000, again);
        expect(again).not.toHaveBeenCalled();
    });
});
