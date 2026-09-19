'use client';

import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/account';

export function LogoutButton({ className }: { className?: string }) {
    const { data: session } = useSession();

    const logout = async () => {
        // Revoke the server session first; sign out locally even if that call fails.
        if (session?.user.accessToken) await authApi.logout(session.user.accessToken).catch(() => undefined);
        await signOut({ callbackUrl: '/auth/signin' });
    };

    return (
        <Button variant="ghost" className={className ?? 'w-full justify-start'} onClick={logout}>
            <LogOut className="h-4 w-4" /> Log out
        </Button>
    );
}
