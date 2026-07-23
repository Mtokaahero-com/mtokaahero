'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LogoutButton({ className }: { className?: string }) {
    return (
        <Button
            variant="ghost"
            className={className ?? 'w-full justify-start'}
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        >
            <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
    );
}
