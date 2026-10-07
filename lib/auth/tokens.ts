import { jwtDecode } from 'jwt-decode';
import type { ApiUser, AuthResult } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';

export const REFRESH_MARGIN_MS = 60_000;

export interface AuthToken {
    user: ApiUser;
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    error?: 'RefreshFailed';
}

export function accessTokenExpiresAt(accessToken: string): number {
    return jwtDecode<{ exp: number }>(accessToken).exp * 1000;
}

export function tokenFromAuthResult(result: AuthResult): AuthToken {
    return {
        user: result.user,
        accessToken: result.accessToken,
        accessTokenExpiresAt: accessTokenExpiresAt(result.accessToken),
        refreshToken: result.refreshToken,
    };
}

/** Refreshes when fewer than REFRESH_MARGIN_MS remain. A failure is sticky so the client can sign out once. */
export async function refreshIfNeeded(
    token: AuthToken,
    now: number,
    refresh: (refreshToken: string) => Promise<AuthResult>,
): Promise<AuthToken> {
    if (token.error) return token;
    if (now < token.accessTokenExpiresAt - REFRESH_MARGIN_MS) return token;
    try {
        return tokenFromAuthResult(await refresh(token.refreshToken));
    } catch (err) {
        // Only a rejected refresh (the token itself invalid/expired) is sticky. Any other failure — a transient
        // 5xx, a network error — leaves the token as-is so the next request simply retries the refresh.
        if (err instanceof ApiError && err.status === 401) return { ...token, error: 'RefreshFailed' };
        return token;
    }
}
