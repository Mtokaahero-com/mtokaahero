import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

import { AuthProviders } from '@/providers/auth-provider';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <Toaster expand={true} position="top-left" />
                <AuthProviders>{children}</AuthProviders>
            </body>
        </html>
    );
}
