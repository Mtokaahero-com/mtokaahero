import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];
const AUTH_PAGES = ['/auth/signin', '/auth/garage', '/auth/mechanic', '/auth/shop'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

    // Unauthenticated user trying to access a protected route → redirect to sign-in
    if (isProtected && !token) {
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
    }

    // Already authenticated user visiting auth pages → redirect to their dashboard
    if (isAuthPage && token) {
        const roleRoutes: Record<string, string> = {
            GARAGE: '/dashboard/garage',
            MECHANIC: '/dashboard/mechanics',
            SHOP: '/dashboard/vendors',
        };
        const role = token.role as string;
        const redirect = roleRoutes[role] ?? '/dashboard';
        return NextResponse.redirect(new URL(redirect, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
};
