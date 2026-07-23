const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

const ROLE_PATH: Record<'GARAGE' | 'MECHANIC' | 'SHOP', string> = {
    GARAGE: '/garage/profile/me',
    MECHANIC: '/mechanic/profile/me',
    SHOP: '/shop/profile/me',
};

export interface MyProfile {
    id: string;
    [key: string]: unknown;
}

export async function getMyProfile(
    role: 'GARAGE' | 'MECHANIC' | 'SHOP',
    accessToken: string,
): Promise<MyProfile> {
    const path = ROLE_PATH[role];
    const res = await fetch(`${API_URL}${path}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error(`Profile lookup failed (${res.status})`);
    }
    return (await res.json()) as MyProfile;
}
