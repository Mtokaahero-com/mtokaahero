import { describe, expect, it } from 'vitest';
import { normalizePhone } from './useCheckout';

describe('normalizePhone', () => {
    it.each([
        ['0712 345 678', '712345678'],
        ['+254 712 345 678', '712345678'],
        ['712345678', '712345678'],
        ['07123456789999', '712345678'],
    ])('normalizes %s', (raw, expected) => {
        expect(normalizePhone(raw)).toBe(expected);
    });
});
