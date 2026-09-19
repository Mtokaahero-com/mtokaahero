import type { ApiUser, AuthResult } from '@/lib/api/account';
import type { AuthToken } from '@/lib/auth/tokens';

declare module 'next-auth' {
    interface Session {
        user: ApiUser & { accessToken: string };
        error?: 'RefreshFailed';
    }

    interface User {
        id: string;
        authResult: AuthResult;
    }
}

declare module 'next-auth/jwt' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface JWT extends AuthToken {}
}
