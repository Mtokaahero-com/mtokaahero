import { describe, expect, it } from 'vitest';
import { queryOffers } from './marketplace';
import { buildQuote, createRequest, tracking } from './rescue';

describe('mock marketplace', () => {
    it('pads the unfiltered catalogue to the designed 48 listings', () => {
        const page = queryOffers(new URLSearchParams('page=1&pageSize=6&makeId=toyota&modelId=rav4&year=2021'));
        expect(page.total).toBe(48);
        expect(page.items).toHaveLength(6);
        expect(page.fitment?.label).toBe('Toyota RAV4 2021');
    });

    it('filters by category and price', () => {
        const rescue = queryOffers(new URLSearchParams('categoryId=rescue'));
        expect(rescue.items.every((o) => o.type === 'RESCUE_PACKAGE')).toBe(true);
        const cheap = queryOffers(new URLSearchParams('maxPrice=5000'));
        expect(cheap.items.every((o) => o.price.amount <= 5000)).toBe(true);
    });
});

describe('mock rescue', () => {
    it('drops the travel fee for in-shop bookings', () => {
        const roadside = buildQuote({ offerIds: [], mode: 'ROADSIDE' });
        const shop = buildQuote({ offerIds: [], mode: 'IN_SHOP' });
        expect(roadside.total.amount - shop.total.amount).toBe(650);
        expect(roadside.total.amount).toBe(19175);
    });

    it('keeps one provider per quote', () => {
        const quote = buildQuote({ offerIds: ['off_flattyre', 'off_brembo'] });
        expect(quote.lines).toHaveLength(1);
        expect(quote.provider.name).toBe('Roadside Ranger Mechanics');
    });

    it('issues an unguessable tracking token that resolves', () => {
        const created = createRequest({
            quoteId: 'q',
            offerIds: [],
            mode: 'ROADSIDE',
            contact: { fullName: 'Jane', phone: '712345678', email: 'j@x.co' },
            vehicle: { make: 'Toyota', model: 'Prado', year: 2019, plate: 'kda 482b' },
            location: { lat: -1.29, lng: 36.83, label: 'Waiyaki Way' },
            notes: '',
            paymentMethod: 'MPESA',
        });
        expect(created.trackingToken).toMatch(/^trk_[0-9a-f]{32}$/);
        const view = tracking(created.trackingToken);
        expect(view?.status).toBe('RECEIVED');
        expect(view?.vehicle.plate).toBe('KDA 482B');
        expect(tracking('trk_nope')).toBeNull();
    });
});
