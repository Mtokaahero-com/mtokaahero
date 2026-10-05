import { parseProblem } from './problem';

/**
 * Base URL for the marketplace, rescue and garage-operations endpoints.
 *
 * These endpoints are specified in docs/superpowers/specs/2026-10-05-stitch-ui-api-contract.md but not yet served by
 * mtokaa-api, so the default points at the in-app mock (app/api/mock/v1). Point it at the real API
 * (e.g. http://localhost:8080/api/v1) once the endpoints exist.
 */
export const MARKETPLACE_API_URL = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ?? '/api/mock/v1';

type Query = Record<string, string | number | boolean | string[] | undefined | null>;

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

export async function marketplaceFetch<T>(
    path: string,
    init: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; query?: Query; body?: unknown; token?: string; headers?: Record<string, string> } = {},
): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', ...init.headers };
    if (init.body !== undefined) headers['Content-Type'] = 'application/json';
    if (init.token) headers.Authorization = `Bearer ${init.token}`;
    const res = await fetch(`${MARKETPLACE_API_URL}${path}${toQueryString(init.query)}`, {
        method: init.method ?? 'GET',
        headers,
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        cache: 'no-store',
    });
    if (!res.ok) throw await parseProblem(res);
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}
