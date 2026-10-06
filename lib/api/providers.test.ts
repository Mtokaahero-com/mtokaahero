import { afterEach, describe, expect, it, vi } from 'vitest';
import { providersApi } from './providers';

describe('providersApi', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('sends tenant headers and maps problem+json errors', async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ code: 'PROFILE_INCOMPLETE', detail: 'Complete your profile', errors: [{ field: 'documents', message: 'required for submission' }] }), {
                status: 422,
                headers: { 'Content-Type': 'application/problem+json' },
            }),
        );
        vi.stubGlobal('fetch', fetchMock);
        await expect(providersApi.submit({ token: 'tok', organizationId: 'org-1' })).rejects.toMatchObject({
            code: 'PROFILE_INCOMPLETE',
            fieldErrors: [{ field: 'documents', message: 'required for submission' }],
        });
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toMatch(/\/organization\/provider-profile\/submit$/);
        expect(init.headers).toMatchObject({ Authorization: 'Bearer tok', 'X-Organization-Id': 'org-1' });
    });

    it('uploads multipart without forcing a content type', async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'd1' }), { status: 201 }));
        vi.stubGlobal('fetch', fetchMock);
        await providersApi.uploadDocument({ token: 't', organizationId: 'o' }, new File(['%PDF-1'], 'p.pdf'), 'BUSINESS_PERMIT');
        const init = fetchMock.mock.calls[0][1] as RequestInit;
        expect(init.body).toBeInstanceOf(FormData);
        expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
    });
});
