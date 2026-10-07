import { describe, expect, it } from 'vitest';
import { ApiError, parseProblem } from './problem';

describe('parseProblem', () => {
    it('reads code, detail and field errors from problem+json', async () => {
        const res = new Response(
            JSON.stringify({ status: 400, code: 'VALIDATION_FAILED', detail: 'Invalid input', errors: [{ field: 'email', message: 'must be an email' }] }),
            { status: 400, headers: { 'Content-Type': 'application/problem+json' } },
        );
        const err = await parseProblem(res);
        expect(err).toBeInstanceOf(ApiError);
        expect(err).toMatchObject({ status: 400, code: 'VALIDATION_FAILED', message: 'Invalid input' });
        expect(err.fieldErrors).toEqual([{ field: 'email', message: 'must be an email' }]);
    });

    it('falls back for non-JSON bodies', async () => {
        const err = await parseProblem(new Response('Bad gateway', { status: 502 }));
        expect(err).toMatchObject({ status: 502, code: 'HTTP_ERROR', message: 'Request failed (502)' });
    });
});
