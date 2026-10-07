import { describe, expect, it, vi } from 'vitest';
import type { AuthResult } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';
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

    it('marks the token as failed when refresh rejects with a 401 ApiError, and does not retry after that', async () => {
        const token = tokenFromAuthResult(result(2_000));
        const failing = vi.fn().mockRejectedValue(new ApiError(401, 'TOKEN_INVALID', 'Invalid or expired refresh token'));
        const failed = await refreshIfNeeded(token, 2_000_000, failing);
        expect(failed.error).toBe('RefreshFailed');
        const again = vi.fn();
        await refreshIfNeeded(failed, 2_000_000, again);
        expect(again).not.toHaveBeenCalled();
    });

    it('returns the token unchanged when refresh rejects with a non-401 ApiError (e.g. a transient 503)', async () => {
        const token = tokenFromAuthResult(result(2_000));
        const failing = vi.fn().mockRejectedValue(new ApiError(503, 'SERVICE_UNAVAILABLE', 'Try again later'));
        const result_ = await refreshIfNeeded(token, 2_000_000, failing);
        expect(result_).toBe(token);
        expect(result_.error).toBeUndefined();
    });

    it('returns the token unchanged when refresh rejects with a non-ApiError (e.g. a network failure)', async () => {
        const token = tokenFromAuthResult(result(2_000));
        const failing = vi.fn().mockRejectedValue(new Error('network down'));
        const result_ = await refreshIfNeeded(token, 2_000_000, failing);
        expect(result_).toBe(token);
        expect(result_.error).toBeUndefined();
    });
});
