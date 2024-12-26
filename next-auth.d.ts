// Type Declarations for NextAuth and JWT
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            role: {
                id: string;
                name: string;
            };
            mobileNumber?: string;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        roleId: string;
        mobileNumber?: string;
        role: {
            id: string;
            name: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        roleId: string;
        mobileNumber?: string;
        role: {
            id: string;
            name: string;
        };
    }
}
