import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { Role: true },
                });

                if (!user) {
                    throw new Error('User not found.');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error('Invalid password.');
                }

                const mechanic = await prisma.mechanic.findUnique({ where: { userId: user.id } });
                const shopOwner = await prisma.shopOwner.findFirst({ where: { userId: user.id } });

                return {
                    id: user.id,
                    email: user.email,
                    userName: user.userName,
                    phoneNumber: user.phoneNumber,
                    roleId: user.roleId,
                    role: user.Role,
                    mechanic: mechanic || undefined,
                    shopOwner: shopOwner
                        ? {
                              ...shopOwner,
                              profilePicture: shopOwner.profilePicture || undefined,
                          }
                        : undefined,
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
