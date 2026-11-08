import { parseProblem } from './problem';

/** mtokaa-api base URL. All API queries go here. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

type Query = Record<string, string | number | boolean | string[] | undefined | null>;

export interface FetchInit {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Query;
    body?: unknown;
    token?: string;
    headers?: Record<string, string>;
}

export function toQueryString(query: Query = {}): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') continue;
        if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
        else params.set(key, String(value));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

async function request<T>(base: string, path: string, init: FetchInit): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', ...init.headers };
    if (init.body !== undefined) headers['Content-Type'] = 'application/json';
    if (init.token) headers.Authorization = `Bearer ${init.token}`;
    const res = await fetch(`${base}${path}${toQueryString(init.query)}`, {
        method: init.method ?? 'GET',
        headers,
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        cache: 'no-store',
    });
    if (!res.ok) throw await parseProblem(res);
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

export const apiFetch = <T>(path: string, init: FetchInit = {}): Promise<T> => request<T>(API_URL, path, init);
