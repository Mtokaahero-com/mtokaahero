import type { Money } from '@/lib/format';
import type { OrganizationType } from './account';
import { MARKETPLACE_API_URL, marketplaceFetch } from './client';
import { parseProblem } from './problem';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export interface Capability {
    id: string;
    label: string;
    detail: string;
}

export interface PartnerProgram {
    capabilities: Capability[];
    radiusKm: { min: number; max: number; default: number; marks: { km: number; label: string }[] };
    advantages: { icon: string; tone: 'primary' | 'amber' | 'tint' | 'rescue'; title: string; body: string }[];
    testimonial: {
        name: string;
        business: string;
        photo: string;
        quote: string;
        monthlyPayout: Money;
        rating: number;
        reviewCount: number;
    } | null;
    dispatch: { avgMinutes: number; targetMinutes: number; onTimeRate: number };
    support: { label: string; href: string };
}

export interface PartnerApplicationInput {
    organizationId: string;
    type: OrganizationType;
    taxPin: string;
    bays: number;
    vans: number;
    address: string;
    location: { lat: number; lng: number } | null;
    capabilityIds: string[];
    radiusKm: number;
    documentIds: string[];
    payout: { mobileMoney: string; bankAccount: string };
}

export interface PartnerApplication {
    id: string;
    organizationId: string;
    status: 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
    submittedAt: string;
}

export interface UploadedDocument {
    id: string;
    name: string;
    size: number;
}

export const partnersApi = {
    program: () => marketplaceFetch<PartnerProgram>('/partners/program'),
    submit: (input: PartnerApplicationInput, token: string) =>
        marketplaceFetch<PartnerApplication>('/partners/applications', { method: 'POST', body: input, token }),
    uploadDocument: async (file: File, token: string): Promise<UploadedDocument> => {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`${MARKETPLACE_API_URL}/partners/documents`, {
            method: 'POST',
            body: form,
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw await parseProblem(res);
        return (await res.json()) as UploadedDocument;
    },
    /** Real mtokaa-api endpoint: creates the organization with the caller as OWNER (requires a verified email). */
    createOrganization: async (
        input: { name: string; type: OrganizationType; addressLine?: string; city?: string; contactPhone?: string },
        token: string,
    ): Promise<{ id: string; name: string; type: OrganizationType }> => {
        const res = await fetch(`${API_URL}/organizations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...input, country: 'KE' }),
        });
        if (!res.ok) throw await parseProblem(res);
        return res.json();
    },
};
