import { describe, expect, it } from 'vitest';
import { pageItems } from './Pagination';

describe('pageItems', () => {
    it('shows the first pages, a gap and the last page', () => {
        expect(pageItems(1, 8)).toEqual([1, 2, 3, 'gap', 8]);
    });

    it('windows around a middle page', () => {
        expect(pageItems(5, 8)).toEqual([1, 'gap', 4, 5, 6, 'gap', 8]);
    });

    it('lists every page when there are few', () => {
        expect(pageItems(2, 3)).toEqual([1, 2, 3]);
    });
});
