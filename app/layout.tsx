import { Toaster } from 'sonner';
import './globals.css';

import { body, heading, mono } from './fonts';
import { AuthProviders } from '@/providers/auth-provider';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
            <body>
                <Toaster expand={true} position="top-left" />
                <AuthProviders>{children}</AuthProviders>
            </body>
        </html>
    );
}
