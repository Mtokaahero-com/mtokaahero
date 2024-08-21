import NextAuth from 'next-auth';

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
     */
    interface Session {
        user: {
            name: string;
            email: string;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
        };
    }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
    interface JWT {
        user: {
            name: string;
            email: string;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
        };
    }
}
