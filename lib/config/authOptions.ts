import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/lib/api/auth';

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                phone: { label: 'Phone', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.password) {
                    throw new Error('Password is required.');
                }
                if (!credentials.email && !credentials.phone) {
                    throw new Error('Email or phone number is required.');
                }

                try {
                    const response = await authApi.login({
                        email: credentials.email || undefined,
                        phone: credentials.phone || undefined,
                        password: credentials.password,
                    });

                    return {
                        id: response.user.id,
                        email: response.user.email,
                        firstName: response.user.firstName,
                        lastName: response.user.lastName,
                        phoneNumber: response.user.phoneNumber,
                        role: response.user.role,
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                    };
                } catch (err: any) {
                    throw new Error(err.message ?? 'Authentication failed.');
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            // On initial sign-in, user object is present — persist everything to the token
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.phoneNumber = user.phoneNumber;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
                firstName: token.firstName,
                lastName: token.lastName,
                phoneNumber: token.phoneNumber,
                role: token.role,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            };
            return session;
        },
    },

    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
    },
};
