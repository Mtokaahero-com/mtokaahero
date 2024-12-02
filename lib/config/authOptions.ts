import { type NextAuthOptions } from 'next-auth';
import  CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { fetchUsers } from './FetchUsers';



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
                try {
                    if (!credentials?.email || !credentials.password) {
                        throw new Error("missing email or password")
                    }

                    const user = await fetchUsers(credentials.email);

                    if (!user) {
                        throw new Error("No user was found with provided credentials");
                    }

                    const passwordMatches = await bcryptjs.compare(credentials.password, user.password)

                    if (!passwordMatches) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    }

                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        })
    ], 
    callbacks: {
        async session({ session, token, user }) {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    role: token.role,
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
}