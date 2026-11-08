import { describe, expect, it } from 'vitest';
import { offerImage } from './offer-image';

describe('offerImage', () => {
    it('prefers the item photo, then the category photo, then the type photo', () => {
        expect(offerImage({ image: { url: '/x.jpg' }, categoryId: 'brakes', type: 'SERVICE' })).toBe('/x.jpg');
        expect(offerImage({ image: { url: null }, categoryId: 'brakes', type: 'SERVICE' })).toBe(
            '/images/market/brake-pads-workbench.jpg',
        );
        expect(offerImage({ image: { url: null }, categoryId: 'unknown', type: 'RESCUE_PACKAGE' })).toBe(
            '/images/market/rescue-van-thumb.jpg',
        );
    });
});
