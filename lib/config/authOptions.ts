import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';


export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Missing email or password.');
                }



                let user = {
                    id: '1',
                    email: 'user@example.com',
                    password: '$2a$10$hashOfPassword',
                    userName: 'user',
                    phoneNumber: '1234567890',
                    roleId: '1',
                    Role: {
                        id: '1',
                        name: 'User',
                    },
                    
                };
                if (!user) {
                    throw new Error('User not found.');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error('Invalid password.');
                }

               

                return {
                    id: user.id,
                    email: user.email,
                    userName: user.userName,
                    phoneNumber: user.phoneNumber,
                    roleId: user.roleId,
                    role: user.Role,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
                userName: token.userName,
                phoneNumber: token.phoneNumber,
                role: token.role,
                mechanic: token.mechanic,
                shopOwner: token.shopOwner,
            };
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token = { ...token, ...user };
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
};
