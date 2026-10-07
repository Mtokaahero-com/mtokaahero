/**
 * Resolves a callback URL against the app's own origin and only returns it when it stays
 * on that origin. Guards against open redirects: `//evil.com`, backslash tricks like
 * `/\evil.com` (which `new URL` normalizes to `https://evil.com`), `javascript:` URIs, etc.
 */
export function safeCallbackPath(callbackUrl: string | null | undefined, origin: string): string {
    if (!callbackUrl) return '/';
    try {
        const url = new URL(callbackUrl, origin);
        if (url.origin !== new URL(origin).origin) return '/';
        return url.pathname + url.search + url.hash;
    } catch {
        return '/';
    }
}
