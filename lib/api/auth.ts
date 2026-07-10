const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

// ─── Shared helpers ───────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message ?? `Request failed with status ${res.status}`);
    }

    return data as T;
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface BackendUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'GARAGE' | 'MECHANIC' | 'SHOP' | 'ADMIN' | 'USER';
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: BackendUser;
}

export interface RegisterGarageDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phoneNumber: string;
    password: string;
    garageName: string;
    address: string;
    location: string;
    logo?: string;
}

export interface RegisterMechanicDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phoneNumber: string;
    password: string;
    specialization: string;
    experienceYears: number;
    address: string;
    location: string;
    profilePicture?: string;
    garageId?: string;
}

export interface RegisterShopDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    profilePicture?: string;
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export const authApi = {
    login: (payload: { email?: string; phone?: string; password: string }) =>
        post<LoginResponse>('/auth/login', payload),

    refresh: (refreshToken: string) =>
        post<LoginResponse>('/auth/refresh', {}, refreshToken),

    registerGarage: (dto: RegisterGarageDto) =>
        post('/garage/auth/register', dto),

    registerMechanic: (dto: RegisterMechanicDto) =>
        post('/mechanic/auth/register', dto),

    registerShop: (dto: RegisterShopDto) =>
        post('/shop/auth/register', dto),
};
