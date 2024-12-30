'use server';

import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { getUserByEmail } from '../db/users';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Missing email or password.');
                }

                const user = await getUserByEmail(credentials.email);
                if (!user) {
                    throw new Error('No user found with the provided email.');
                }

                const passwordMatches = await bcryptjs.compare(credentials.password, user.password);
                if (!passwordMatches) {
                    throw new Error('Invalid password.');
                }

                // Fetch role-specific information
                const garageOwner = await prisma.garageOwner.findFirst({ where: { userId: user.id } });
                const mechanic = await prisma.mechanic.findUnique({ where: { userId: user.id } });
                const shopOwner = await prisma.shopOwner.findFirst({ where: { userId: user.id } });

                return {
                    id: user.id,
                    email: user.email,
                    userName: user.userName,
                    phoneNumber: user.phoneNumber,
                    roleId: user.roleId,
                    role: user.Role,
                    garageOwner: garageOwner || undefined,
                    mechanic: mechanic || undefined,
                    shopOwner: shopOwner || undefined,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    userName: token.userName,
                    phoneNumber: token.phoneNumber,
                    role: token.role,
                    garageOwner: token.garageOwner,
                    mechanic: token.mechanic,
                    shopOwner: token.shopOwner,
                };
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.userName = user.userName;
                token.phoneNumber = user.phoneNumber;
                token.role = user.role;
                token.garageOwner = user.garageOwner;
                token.mechanic = user.mechanic;
                token.shopOwner = user.shopOwner;
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
};
