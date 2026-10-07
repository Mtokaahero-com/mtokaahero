import { describe, expect, it } from 'vitest';
import { formatMoney, formatMoneyCompact } from './format';

describe('formatMoney', () => {
    it('formats whole shillings with grouping', () => {
        expect(formatMoney({ amount: 19175, currency: 'KES' })).toBe('KES 19,175');
    });

    it('compacts large KPI figures', () => {
        expect(formatMoneyCompact({ amount: 3230500, currency: 'KES' })).toBe('KES 3.23M');
        expect(formatMoneyCompact({ amount: 3000000, currency: 'KES' })).toBe('KES 3M');
        expect(formatMoneyCompact({ amount: 845000, currency: 'KES' })).toBe('KES 845K');
        expect(formatMoneyCompact({ amount: 4550, currency: 'KES' })).toBe('KES 4,550');
    });
});
