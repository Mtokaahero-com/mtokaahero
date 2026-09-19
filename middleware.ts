import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { safeCallbackPath } from '@/lib/auth/redirect';

const PROTECTED_PREFIXES = ['/dashboard', '/account'];
const SIGNED_OUT_ONLY = ['/auth/signin', '/auth/signup'];

export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const signedIn = Boolean(token) && !token?.error;

    if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !signedIn) {
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (SIGNED_OUT_ONLY.some((page) => pathname.startsWith(page)) && signedIn) {
        const target = safeCallbackPath(searchParams.get('callbackUrl'), req.nextUrl.origin);
        return NextResponse.redirect(new URL(target, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/account/:path*', '/auth/signin', '/auth/signup'],
};
