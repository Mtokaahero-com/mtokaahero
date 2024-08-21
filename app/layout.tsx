'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './context/context'

const inter = Inter({ subsets: ['latin'] })
import { Toaster } from 'sonner'

import { store } from './store/store'
import { Provider } from 'react-redux'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <AuthProvider>
            <Provider store={store}>
                <html lang="en">
                    <body className={inter.className}>
                        {children}
                        <Toaster richColors expand={true} position="top-center" className="font-primary" />
                    </body>
                </html>
            </Provider>
        </AuthProvider>
    )
}
