import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// ─── Role enum aligned with the backend ──────────────────────────────────────
export type UserRole = 'GARAGE' | 'MECHANIC' | 'SHOP' | 'ADMIN' | 'USER';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phoneNumber: string;
            role: UserRole;
            accessToken: string;
            refreshToken: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        role: UserRole;
        accessToken: string;
        refreshToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        role: UserRole;
        accessToken: string;
        refreshToken: string;
    }
}
