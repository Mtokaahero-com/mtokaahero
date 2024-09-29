'use client'

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import { store } from '@/app/store';
import { Provider } from 'react-redux';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Provider store={store}>
                <body className={inter.className}>
                {children}
                <Toaster richColors expand={true} position="top-center" className="font-primary" />
                </body>
            </Provider>
        </html>
    );
}
