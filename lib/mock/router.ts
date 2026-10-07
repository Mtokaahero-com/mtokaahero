import type { RescueRequestInput } from '@/lib/api/rescue';
import { filters, offers, queryOffers, summary } from './marketplace';
import * as garage from './garage';
import { buildQuote, createRequest, reverseGeocode, tracking } from './rescue';

export interface MockResult {
    status: number;
    body?: unknown;
}

type Handler = (match: RegExpMatchArray, query: URLSearchParams, body: unknown, headers: Headers) => MockResult | Promise<MockResult>;

const ok = (body: unknown): MockResult => ({ status: 200, body });
const notFound = (detail = 'Not found'): MockResult => ({ status: 404, body: { code: 'NOT_FOUND', detail } });

const routes: [string, RegExp, Handler][] = [
    ['GET', /^\/marketplace\/summary$/, () => ok(summary)],
    ['GET', /^\/marketplace\/filters$/, () => ok(filters)],
    ['GET', /^\/marketplace\/offers$/, (_m, q) => ok(queryOffers(q))],
    [
        'GET',
        /^\/marketplace\/offers\/([\w-]+)$/,
        (m) => {
            const offer = offers.find((o) => m[1] === o.id || m[1].startsWith(`${o.id}_`));
            return offer ? ok(offer) : notFound('Offer not found');
        },
    ],
    ['POST', /^\/rescue\/quotes$/, (_m, _q, body) => ok(buildQuote((body ?? {}) as Parameters<typeof buildQuote>[0]))],
    [
        'GET',
        /^\/geo\/reverse$/,
        (_m, q) => ok(reverseGeocode({ lat: Number(q.get('lat') ?? -1.2642), lng: Number(q.get('lng') ?? 36.8044) })),
    ],
    [
        'POST',
        /^\/rescue\/requests$/,
        (_m, _q, body) => {
            const input = body as Partial<RescueRequestInput> | undefined;
            const errors = [
                !input?.contact?.fullName?.trim() && { field: 'contact.fullName', message: 'Enter your full name' },
                !/^\d{9}$/.test(input?.contact?.phone ?? '') && { field: 'contact.phone', message: 'Enter a 9-digit Safaricom/Airtel number' },
                !input?.location && { field: 'location', message: 'Share your location' },
            ].filter(Boolean);
            if (errors.length) return { status: 422, body: { code: 'VALIDATION_FAILED', detail: 'Check the highlighted fields.', errors } };
            return { status: 201, body: createRequest(input as RescueRequestInput) };
        },
    ],
    [
        'GET',
        /^\/rescue\/track\/([\w-]+)$/,
        (m) => {
            const view = tracking(m[1]);
            return view ? ok(view) : notFound('This tracking link has expired or does not exist.');
        },
    ],

    // Garage operations: tenant-scoped by X-Organization-Id, like mtokaa-api's /organization routes.
    ['GET', /^\/garage\/dashboard$/, (_m, _q, _b, h) => ok(garage.dashboard(org(h)))],
    ['GET', /^\/garage\/dispatch-radar$/, (_m, _q, _b, h) => ok(garage.radar(org(h)))],
    ['POST', /^\/garage\/dispatch-radar\/([\w-]+)\/accept$/, (m, _q, _b, h) => ok(garage.acceptCall(org(h), m[1]))],
    ['GET', /^\/garage\/catalog$/, (_m, q, _b, h) => ok(garage.catalog(org(h), q))],
    [
        'POST',
        /^\/garage\/catalog$/,
        (_m, _q, b, h) => {
            const input = b as Parameters<typeof garage.createItem>[1] | undefined;
            const errors = [
                !input?.title?.trim() && { field: 'title', message: 'Enter a title' },
                !(Number(input?.unitPrice) > 0) && { field: 'unitPrice', message: 'Enter a price above zero' },
                !input?.sku?.trim() && { field: 'sku', message: 'Enter an SKU or package code' },
            ].filter(Boolean);
            if (errors.length) return { status: 422, body: { code: 'VALIDATION_FAILED', detail: 'Check the highlighted fields.', errors } };
            return { status: 201, body: garage.createItem(org(h), { ...input!, unitPrice: Number(input!.unitPrice) }) };
        },
    ],
    [
        'PATCH',
        /^\/garage\/catalog\/([\w-]+)$/,
        (m, _q, b, h) => {
            const item = garage.updateItem(org(h), m[1], (b ?? {}) as Parameters<typeof garage.updateItem>[2]);
            return item ? ok(item) : notFound('Catalog item not found');
        },
    ],
    ['DELETE', /^\/garage\/catalog\/([\w-]+)$/, (m, _q, _b, h) => (garage.deleteItem(org(h), m[1]) ? { status: 204 } : notFound('Catalog item not found'))],
    ['GET', /^\/garage\/reviews$/, (_m, _q, _b, h) => ok(garage.reviews(org(h)))],
    [
        'POST',
        /^\/garage\/reviews\/([\w-]+)\/reply$/,
        (m, _q, b, h) => {
            const text = String((b as { body?: string })?.body ?? '').trim();
            if (!text) return { status: 422, body: { code: 'VALIDATION_FAILED', detail: 'Write a reply first.' } };
            const review = garage.reply(org(h), m[1], text);
            return review ? ok(review) : notFound('Review not found');
        },
    ],
    [
        'POST',
        /^\/support\/messages$/,
        (_m, _q, b) => {
            const input = b as { name?: string; email?: string; message?: string } | undefined;
            const errors = [
                !input?.name?.trim() && { field: 'name', message: 'Enter your name' },
                !/^\S+@\S+\.\S+$/.test(input?.email ?? '') && { field: 'email', message: 'Enter a valid email' },
                !(input?.message && input.message.trim().length >= 10) && { field: 'message', message: 'Tell us a bit more (10+ characters)' },
            ].filter(Boolean);
            if (errors.length) return { status: 422, body: { code: 'VALIDATION_FAILED', detail: 'Check the highlighted fields.', errors } };
            return { status: 201, body: { id: crypto.randomUUID(), ticket: `MTH-SUP-${Math.floor(1000 + Math.random() * 8999)}` } };
        },
    ],
];

const org = (h: Headers) => h.get('x-organization-id') ?? 'demo-org';

export async function handleMock(method: string, path: string, query: URLSearchParams, body: unknown, headers: Headers = new Headers()): Promise<MockResult> {
    for (const [m, pattern, handler] of routes) {
        if (m !== method) continue;
        const match = path.match(pattern);
        if (match) return handler(match, query, body, headers);
    }
    return notFound(`No mock for ${method} ${path}`);
}