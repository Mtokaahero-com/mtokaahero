import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_URL } from './client';
import { garageApi } from './garage';
import { rescueApi } from './rescue';
import { supportApi } from './support';

describe('backend query clients (rescueApi, garageApi, supportApi)', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('routes rescueApi and geo queries to mtokaa-api', async () => {
        const fetchMock = vi.fn().mockImplementation(() =>
            Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 })),
        );
        vi.stubGlobal('fetch', fetchMock);

        await rescueApi.reverseGeocode({ lat: -1.2642, lng: 36.8044 });
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/geo/reverse?lat=-1.2642&lng=36.8044`,
            expect.objectContaining({ method: 'GET' }),
        );

        await rescueApi.quote({ offerIds: ['id-1'], mode: 'ROADSIDE' });
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/rescue/quotes`,
            expect.objectContaining({ method: 'POST' }),
        );

        await rescueApi.create(
            {
                quoteId: 'q1',
                offerIds: [],
                mode: 'ROADSIDE',
                contact: { fullName: 'Wanjiku', phone: '712345678', email: 'w@example.com' },
                vehicle: { make: 'Toyota', model: 'Fielder', year: 2018, plate: 'KDA 123A' },
                location: { lat: -1.26, lng: 36.8, label: 'Westlands' },
                notes: '',
                paymentMethod: 'MPESA',
            },
            'tok-1',
        );
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/rescue/requests`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({ Authorization: 'Bearer tok-1' }),
            }),
        );

        await rescueApi.track('trk_123');
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/rescue/track/trk_123`,
            expect.objectContaining({ method: 'GET' }),
        );
    });

    it('routes garageApi dashboard, radar, reviews, and ledger queries to mtokaa-api with tenant headers', async () => {
        const fetchMock = vi.fn().mockImplementation((url: string) => {
            if (url.endsWith('/garage/ledger.csv')) {
                return Promise.resolve(new Response('date,stream,gross_kes,vat_kes\n', { status: 200 }));
            }
            return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
        });
        vi.stubGlobal('fetch', fetchMock);
        const auth = { token: 'jwt-tok', organizationId: 'org-99' };

        await garageApi.dashboard(auth);
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/garage/dashboard`,
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer jwt-tok', 'X-Organization-Id': 'org-99' }),
            }),
        );

        await garageApi.radar(auth);
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/garage/dispatch-radar`,
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer jwt-tok', 'X-Organization-Id': 'org-99' }),
            }),
        );

        await garageApi.acceptCall(auth, 'call-1');
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/garage/dispatch-radar/call-1/accept`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({ Authorization: 'Bearer jwt-tok', 'X-Organization-Id': 'org-99' }),
            }),
        );

        await garageApi.reviews(auth);
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/garage/reviews?limit=3`,
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer jwt-tok', 'X-Organization-Id': 'org-99' }),
            }),
        );

        await garageApi.reply(auth, 'rev-1', 'Asante!');
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/garage/reviews/rev-1/reply`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({ Authorization: 'Bearer jwt-tok', 'X-Organization-Id': 'org-99' }),
            }),
        );

        const csv = await garageApi.ledgerCsv(auth);
        expect(csv).toContain('date,stream,gross_kes,vat_kes');
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/garage/ledger.csv`,
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer jwt-tok', 'X-Organization-Id': 'org-99' }),
            }),
        );
    });

    it('routes supportApi messages to mtokaa-api', async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ id: 'sup-1', ticket: 'MTH-SUP-1024' }), { status: 201 }),
        );
        vi.stubGlobal('fetch', fetchMock);

        const res = await supportApi.send({
            name: 'Kelvin',
            email: 'kelvin@example.com',
            topic: 'RESCUE',
            message: 'Need assistance with my roadside invoice.',
        });
        expect(res.ticket).toBe('MTH-SUP-1024');
        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/support/messages`,
            expect.objectContaining({ method: 'POST' }),
        );
    });
});
