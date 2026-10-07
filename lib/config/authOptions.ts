import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';
import { refreshIfNeeded, tokenFromAuthResult } from '@/lib/auth/tokens';

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email or phone', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const identifier = credentials?.identifier?.trim() ?? '';
                const password = credentials?.password ?? '';
                if (!identifier || !password) throw new Error('Enter your email or phone and your password.');
                try {
                    const authResult = await authApi.login(
                        identifier.includes('@') ? { email: identifier, password } : { phone: identifier, password },
                    );
                    return { id: authResult.user.id, authResult };
                } catch (err) {
                    throw new Error(err instanceof ApiError ? err.code : 'SIGN_IN_FAILED');
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) return { ...token, ...tokenFromAuthResult(user.authResult) };
            let current = await refreshIfNeeded(token, Date.now(), authApi.refresh);
            if (trigger === 'update' && session?.refreshUser && !current.error) {
                const me = await authApi.me(current.accessToken).catch(() => null);
                if (me) current = { ...current, user: { ...current.user, ...me.user } };
            }
            return { ...token, ...current };
        },

        async session({ session, token }) {
            session.user = { ...token.user, accessToken: token.accessToken };
            session.error = token.error;
            return session;
        },
    },

    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
    },
};
