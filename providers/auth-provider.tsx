'use client';

import { SessionProvider, signOut, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

function SessionGuard({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    useEffect(() => {
        if (session?.error === 'RefreshFailed') void signOut({ callbackUrl: '/auth/signin' });
    }, [session?.error]);
    return <>{children}</>;
}

export const AuthProviders = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>
        <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
);
