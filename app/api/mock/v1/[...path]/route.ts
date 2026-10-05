import { NextRequest, NextResponse } from 'next/server';
import { handleMock } from '@/lib/mock/router';

// In-app stand-in for the marketplace, rescue and garage-operations endpoints that mtokaa-api does not serve yet.
// The contract lives in docs/superpowers/specs/2026-10-05-stitch-ui-api-contract.md.

/** JSON bodies as-is; multipart uploads reduced to the file's metadata (the mock stores nothing). */
async function readBody(req: NextRequest): Promise<unknown> {
    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
        const form = await req.formData().catch(() => null);
        const file = form?.get('file');
        return file instanceof File ? { name: file.name, size: file.size, type: file.type } : undefined;
    }
    return req.json().catch(() => undefined);
}

async function handle(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params;
    const body = req.method === 'GET' || req.method === 'DELETE' ? undefined : await readBody(req);
    if (path.join('/') === 'garage/ledger.csv') return ledger();
    const result = await handleMock(req.method, `/${path.join('/')}`, req.nextUrl.searchParams, body, req.headers);
    if (result.status === 204) return new NextResponse(null, { status: 204 });
    return NextResponse.json(result.body, {
        status: result.status,
        headers: result.status >= 400 ? { 'Content-Type': 'application/problem+json' } : undefined,
    });
}

export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };

function ledger() {
    const csv = 'date,stream,gross_kes,vat_kes\n2026-05-01,parts,585000,93600\n2026-05-01,labor,364000,58240\n2026-05-01,rescue,364000,58240\n';
    return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="tax-ledger.csv"' } });
}
