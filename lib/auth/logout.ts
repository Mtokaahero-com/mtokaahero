import { getSession, signOut } from 'next-auth/react';
import { authApi } from '@/lib/api/account';

/** Revoke the API session (refreshing a stale token first), then clear the NextAuth session either way. */
export async function logout(callbackUrl = '/auth/signin') {
    const fresh = await getSession().catch(() => null);
    if (fresh && !fresh.error) await authApi.logout(fresh.user.accessToken).catch(() => undefined);
    await signOut({ callbackUrl });
}
