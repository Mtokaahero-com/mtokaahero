'use client';

import { LogOut } from 'lucide-react';
import { getSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/account';

export function LogoutButton({ className }: { className?: string }) {
    const logout = async () => {
        // Re-read the session so the jwt callback refreshes a stale access token before we
        // revoke it; sign out locally regardless of whether the API call succeeds.
        const fresh = await getSession().catch(() => null);
        if (fresh && !fresh.error) await authApi.logout(fresh.user.accessToken).catch(() => undefined);
        await signOut({ callbackUrl: '/auth/signin' });
    };

    return (
        <Button variant="ghost" className={className ?? 'w-full justify-start'} onClick={logout}>
            <LogOut className="h-4 w-4" /> Log out
        </Button>
    );
}
