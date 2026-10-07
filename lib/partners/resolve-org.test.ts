import { describe, expect, it } from 'vitest';
import type { Membership } from '@/lib/api/account';
import { resolveTargetOrg } from './resolve-org';

const m = (over: Partial<Membership> = {}): Membership => ({
    organizationId: 'org-1',
    name: 'Shop',
    slug: 'shop',
    type: 'GARAGE',
    organizationStatus: 'ACTIVE',
    role: 'OWNER',
    ...over,
});

describe('resolveTargetOrg', () => {
    it('uses an existing provider membership and never creates', () => {
        expect(resolveTargetOrg(m(), { current: null })).toEqual({ organizationId: 'org-1', existing: true });
        expect(resolveTargetOrg(m({ role: 'MANAGER', type: 'MOBILE_MECHANIC' }), { current: 'x' })?.organizationId).toBe('org-1');
    });
    it('ignores staff and non-provider memberships', () => {
        expect(resolveTargetOrg(m({ role: 'STAFF' }), { current: null })).toBeNull();
        expect(resolveTargetOrg(m({ type: 'PARTS_SHOP' }), { current: null })).toBeNull();
    });
    it('reuses an org created earlier in the session', () => {
        expect(resolveTargetOrg(null, { current: 'org-9' })).toEqual({ organizationId: 'org-9', existing: true });
    });
    it('returns null when an org must be created', () => {
        expect(resolveTargetOrg(null, { current: null })).toBeNull();
    });
});
