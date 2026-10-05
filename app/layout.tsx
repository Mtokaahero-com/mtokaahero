import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

import { body, heading, mono } from './fonts';
import { VerifyEmailBanner } from '@/components/auth/VerifyEmailBanner';
import { AuthProviders } from '@/providers/auth-provider';
import { CartProvider } from '@/providers/cart-provider';

export const metadata: Metadata = {
    title: 'MtokaaHero - Garage & Rescue Network',
    description: 'Find top garages, genuine parts and mobile rescue mechanics near you.',
    icons: { icon: '/brand/logo.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
            <head>
                {/* Material Symbols is the icon set used across the Stitch screens. */}
                {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
                />
            </head>
            <body>
                <Toaster expand={true} position="top-left" />
                <AuthProviders>
                    <CartProvider>
                        <VerifyEmailBanner />
                        {children}
                    </CartProvider>
                </AuthProviders>
            </body>
        </html>
    );
}
