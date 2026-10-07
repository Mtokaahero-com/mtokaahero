'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { authApi, type Membership, type OrganizationType } from '@/lib/api/account';

const TYPE_LABEL: Record<OrganizationType, string> = {
    GARAGE: 'Garage Tenant',
    PARTS_SHOP: 'Parts Shop',
    MOBILE_MECHANIC: 'Mobile Mechanic',
};

export interface Account {
    status: 'loading' | 'authenticated' | 'unauthenticated';
    /** Primary line of the account chip: the active organization, else the person's name. */
    displayName: string;
    /** Secondary mono line: "Garage Tenant", "Motorist" or "Guest Motorist". */
    roleLabel: string;
    initials: string;
    memberships: Membership[];
    /** False until /me has answered for the signed-in user. */
    membershipsLoaded: boolean;
    activeMembership: Membership | null;
    accessToken: string | null;
}

export function useAccount(): Account {
    const { data: session, status } = useSession();
    const [memberships, setMemberships] = useState<Membership[] | null>(null);
    const token = session?.user.accessToken ?? null;

    useEffect(() => {
        if (!token) return;
        let active = true;
        authApi
            .me(token)
            .then((me) => active && setMemberships(me.memberships ?? []))
            .catch(() => active && setMemberships([]));
        return () => {
            active = false;
        };
    }, [token]);

    if (status !== 'authenticated' || !session) {
        return {
            status: status === 'loading' ? 'loading' : 'unauthenticated',
            displayName: 'Sign in',
            roleLabel: 'Guest Motorist',
            initials: '',
            memberships: [],
            membershipsLoaded: status !== 'loading',
            activeMembership: null,
            accessToken: null,
        };
    }

    const active = memberships?.find((m) => m.organizationStatus === 'ACTIVE') ?? null;
    const fullName = `${session.user.firstName} ${session.user.lastName}`.trim();
    return {
        status: 'authenticated',
        displayName: active?.name ?? fullName,
        roleLabel: active ? TYPE_LABEL[active.type] : 'Motorist',
        initials: `${session.user.firstName[0] ?? ''}${session.user.lastName[0] ?? ''}`.toUpperCase(),
        memberships: memberships ?? [],
        membershipsLoaded: memberships !== null,
        activeMembership: active,
        accessToken: token,
    };
}
