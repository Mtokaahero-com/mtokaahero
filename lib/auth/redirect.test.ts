import { describe, expect, it } from 'vitest';
import { safeCallbackPath } from './redirect';

const ORIGIN = 'https://app.mtokaahero.com';

describe('safeCallbackPath', () => {
    it('keeps a same-origin relative path with query', () => {
        expect(safeCallbackPath('/dashboard?x=1', ORIGIN)).toBe('/dashboard?x=1');
    });

    it('rejects a protocol-relative URL', () => {
        expect(safeCallbackPath('//evil.com', ORIGIN)).toBe('/');
    });

    it('rejects a backslash trick that normalizes to another origin', () => {
        expect(safeCallbackPath('/\\evil.com', ORIGIN)).toBe('/');
    });

    it('rejects a tab-smuggled protocol-relative URL', () => {
        expect(safeCallbackPath('/\t/evil.com', ORIGIN)).toBe('/');
    });

    it('rejects an absolute URL on a different origin', () => {
        expect(safeCallbackPath('https://evil.com/x', ORIGIN)).toBe('/');
    });

    it('rejects a javascript: URI', () => {
        expect(safeCallbackPath('javascript:alert(1)', ORIGIN)).toBe('/');
    });

    it('falls back to / for an empty string', () => {
        expect(safeCallbackPath('', ORIGIN)).toBe('/');
    });

    it('falls back to / for null', () => {
        expect(safeCallbackPath(null, ORIGIN)).toBe('/');
    });

    it('keeps an absolute URL on the same origin, reduced to its path', () => {
        expect(safeCallbackPath(`${ORIGIN}/account`, ORIGIN)).toBe('/account');
    });
});
