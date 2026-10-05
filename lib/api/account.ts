import { parseProblem } from './problem';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export interface ApiUser {
    id: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string;
    platformRole: 'USER' | 'PLATFORM_ADMIN';
    emailVerified: boolean;
}

export type OrganizationType = 'GARAGE' | 'PARTS_SHOP' | 'MOBILE_MECHANIC';
export type MembershipRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface Membership {
    organizationId: string;
    name: string;
    slug: string;
    type: OrganizationType;
    organizationStatus: 'ACTIVE' | 'SUSPENDED';
    role: MembershipRole;
}

export interface MeView {
    user: ApiUser;
    memberships: Membership[];
}

export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: ApiUser;
}

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
}

async function call<T>(path: string, init: { method?: 'GET' | 'POST'; body?: unknown; token?: string } = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (init.body !== undefined) headers['Content-Type'] = 'application/json';
    if (init.token) headers.Authorization = `Bearer ${init.token}`;
    const res = await fetch(`${API_URL}${path}`, {
        method: init.method ?? 'POST',
        headers,
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        cache: 'no-store',
    });
    if (!res.ok) throw await parseProblem(res);
    if (res.status === 202 || res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

export const authApi = {
    login: (input: { email?: string; phone?: string; password: string }) => call<AuthResult>('/auth/login', { body: input }),
    register: (input: RegisterInput) => call<AuthResult>('/auth/register', { body: input }),
    refresh: (refreshToken: string) => call<AuthResult>('/auth/refresh', { body: { refreshToken } }),
    logout: (accessToken: string) => call<void>('/auth/logout', { token: accessToken }),
    me: (accessToken: string) => call<MeView>('/me', { method: 'GET', token: accessToken }),
    resendVerification: (accessToken: string) => call<void>('/auth/email-verification/resend', { token: accessToken }),
    confirmEmailVerification: (token: string) => call<void>('/auth/email-verification/confirm', { body: { token } }),
    requestPasswordReset: (email: string) => call<void>('/auth/password-reset/request', { body: { email } }),
    confirmPasswordReset: (token: string, newPassword: string) =>
        call<void>('/auth/password-reset/confirm', { body: { token, newPassword } }),
};
