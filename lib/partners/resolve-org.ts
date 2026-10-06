import type { Membership } from '@/lib/api/account';

export interface OrgTarget {
    organizationId: string;
    /** True when the organization already existed (membership or an earlier attempt), so it must not be created. */
    existing: boolean;
}

/** Provider membership that may edit and resubmit a profile. */
export function providerMembership(membership: Membership | null): Membership | null {
    if (!membership) return null;
    if (membership.role !== 'OWNER' && membership.role !== 'MANAGER') return null;
    return membership.type === 'GARAGE' || membership.type === 'MOBILE_MECHANIC' ? membership : null;
}

/** Pick the organization to onboard: an existing provider membership, else one created earlier this session, else null (create). */
export function resolveTargetOrg(membership: Membership | null, created: { current: string | null }): OrgTarget | null {
    const m = providerMembership(membership);
    if (m) return { organizationId: m.organizationId, existing: true };
    if (created.current) return { organizationId: created.current, existing: true };
    return null;
}
