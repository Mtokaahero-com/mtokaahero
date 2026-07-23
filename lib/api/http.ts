const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export async function apiFetch<T>(
    path: string,
    opts: { method?: string; body?: unknown; token: string },
): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        method: opts.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${opts.token}`,
        },
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error((data as any)?.message ?? `Request failed (${res.status})`);
    }
    return data as T;
}
