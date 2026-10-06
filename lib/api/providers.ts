import { parseProblem } from './problem';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export type Capability = 'ENGINE' | 'BRAKES' | 'DIAGNOSTICS' | 'MOBILE_RESCUE' | 'TOWING' | 'PARTS_RETAIL';
export type VerificationStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type DocumentKind = 'BUSINESS_PERMIT' | 'TRADE_CERTIFICATE' | 'INSURANCE' | 'OTHER';
export type DayHours = { day: string; closed: true } | { day: string; opens: string; closes: string };

export interface Payout {
    mobileMoney: { kind: 'PAYBILL' | 'TILL'; number: string; account: string | null } | null;
    bankAccount: { bank: string; accountNumber: string } | null;
}

export interface ProviderProfile {
    organizationId: string;
    type: 'GARAGE' | 'PARTS_SHOP' | 'MOBILE_MECHANIC';
    location: { lat: number; lng: number } | null;
    addressLine: string | null;
    serviceRadiusKm: number;
    capabilities: Capability[];
    bays: number;
    vans: number;
    taxPin: string | null;
    openingHours: DayHours[];
    payout: Payout;
    documents: { id: string; kind: DocumentKind; fileName: string; contentType: string; sizeBytes: number; uploadedAt: string }[];
    verification: { status: VerificationStatus; submittedAt: string | null; decidedAt: string | null; rejectionReason: string | null };
    accepting: boolean;
    missing: string[];
}

export interface PartnerProgram {
    capabilities: { id: Capability; label: string; detail: string }[];
    serviceRadiusKm: { min: number; max: number; default: number };
    documentKinds: DocumentKind[];
    maxDocumentBytes: number;
    maxDocuments: number;
}

export type ProfileUpdate = Partial<Omit<ProviderProfile, 'organizationId' | 'type' | 'documents' | 'verification' | 'accepting' | 'missing' | 'payout'>> & {
    payout?: { mobileMoney?: { kind: 'PAYBILL' | 'TILL'; number: string; account?: string } | null; bankAccount?: { bank: string; accountNumber: string } | null };
};

export interface TenantAuth {
    token: string;
    organizationId: string;
}

async function call<T>(path: string, init: { method?: string; body?: unknown; form?: FormData; auth?: TenantAuth } = {}): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (init.body !== undefined) headers['Content-Type'] = 'application/json';
    if (init.auth) {
        headers.Authorization = `Bearer ${init.auth.token}`;
        headers['X-Organization-Id'] = init.auth.organizationId;
    }
    const res = await fetch(`${API_URL}${path}`, {
        method: init.method ?? 'GET',
        headers,
        body: init.form ?? (init.body === undefined ? undefined : JSON.stringify(init.body)),
        cache: 'no-store',
    });
    if (!res.ok) throw await parseProblem(res);
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

const base = '/organization/provider-profile';

export const providersApi = {
    program: () => call<PartnerProgram>('/partners/program'),
    get: (auth: TenantAuth) => call<ProviderProfile>(base, { auth }),
    update: (auth: TenantAuth, body: ProfileUpdate) => call<ProviderProfile>(base, { method: 'PATCH', body, auth }),
    uploadDocument: (auth: TenantAuth, file: File, kind: DocumentKind) => {
        const form = new FormData();
        form.append('kind', kind);
        form.append('file', file);
        return call<ProviderProfile['documents'][number]>(`${base}/documents`, { method: 'POST', form, auth });
    },
    removeDocument: (auth: TenantAuth, id: string) => call<void>(`${base}/documents/${id}`, { method: 'DELETE', auth }),
    submit: (auth: TenantAuth) => call<ProviderProfile>(`${base}/submit`, { method: 'POST', auth }),
    setAvailability: (auth: TenantAuth, accepting: boolean) => call<ProviderProfile>(`${base}/availability`, { method: 'PUT', body: { accepting }, auth }),
};
