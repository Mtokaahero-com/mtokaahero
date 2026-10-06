import type { OrganizationType } from './account';
import { parseProblem } from './problem';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export const partnersApi = {
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
