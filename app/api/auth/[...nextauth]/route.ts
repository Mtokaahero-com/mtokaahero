import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { backendUrl } from '@/lib/constants';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'youremail@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;
                const { email, password } = credentials;
                const res = await fetch(`${backendUrl}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                if (res.status === 401) {
                    console.log(res.statusText);
                    return null;
                }
                const user = await res.json();
                return user;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user };
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            session.backendTokens = token.backendTokens;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
