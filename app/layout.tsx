'use client'

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
                <body className={inter.className}>
                {children}
                <Toaster richColors expand={true} position="top-center" className="font-primary" />
                </body>
        </html>
    );
}
