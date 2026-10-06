'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Icon } from '@/components/brand/Icon';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DispatchRadarCard, InventorySection, NewItemDialog, ReviewsSection } from '@/components/dashboard/Operations';
import { KpiCards, RevenueChart, ShopHeader } from '@/components/dashboard/Overview';
import { useAccount } from '@/hooks/use-account';
import { useApi } from '@/hooks/use-api';
import { garageApi, type GarageAuth } from '@/lib/api/garage';
import type { ItemType } from '@/lib/api/marketplace';
import { ApiError } from '@/lib/api/problem';
import { providersApi, type VerificationStatus } from '@/lib/api/providers';

const RADAR_POLL_MS = 15_000;

function VerificationBanner({ status, reason }: { status?: VerificationStatus; reason?: string | null }) {
    if (status !== 'SUBMITTED' && status !== 'REJECTED' && status !== 'DRAFT') return null;
    const rejected = status === 'REJECTED';
    return (
        <div role="status" className={`rounded-xl p-space-md flex items-center gap-space-sm ${rejected ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
            <Icon name={rejected ? 'error' : 'hourglass_top'} className="text-[24px] shrink-0" />
            <p className="font-body-md text-body-md flex-1">
                {status === 'SUBMITTED'
                    ? "Under review — you'll be able to go online once approved."
                    : rejected
                      ? `Your application was not approved${reason ? `: ${reason}` : '.'}`
                      : 'Finish your partner profile to get listed.'}
            </p>
            {status !== 'SUBMITTED' && (
                <Link href="/partners" className="font-label-lg text-label-lg font-bold underline whitespace-nowrap">
                    {rejected ? 'Fix and resubmit' : 'Finish profile'}
                </Link>
            )}
        </div>
    );
}

function Dashboard({ auth, shopName }: { auth: GarageAuth; shopName: string }) {
    const params = useSearchParams();
    const router = useRouter();
    const view = (params.get('view') as ItemType | null) ?? 'ALL';
    const dashboard = useApi(`dash:${auth.organizationId}`, () => garageApi.dashboard(auth));
    const radar = useApi(`radar:${auth.organizationId}`, () => garageApi.radar(auth));
    const profile = useApi(`profile:${auth.organizationId}`, () => providersApi.get(auth));
    const [toggling, setToggling] = useState(false);
    const [newItemOpen, setNewItemOpen] = useState(false);
    const [catalogVersion, setCatalogVersion] = useState(0);
    const d = dashboard.data;

    useEffect(() => {
        const id = setInterval(radar.reload, RADAR_POLL_MS);
        return () => clearInterval(id);
    }, [radar.reload]);

    const toggle = async (accepting: boolean) => {
        setToggling(true);
        try {
            await providersApi.setAvailability(auth, accepting);
            profile.reload();
            dashboard.reload();
            radar.reload();
            toast.success(accepting ? 'You are online and accepting rescues' : 'Rescue dispatch paused');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Could not change your availability. Try again.');
        } finally {
            setToggling(false);
        }
    };

    const accept = useCallback(
        async (id: string) => {
            try {
                const { trackingToken } = await garageApi.acceptCall(auth, id);
                toast.success('Rescue accepted — mechanic dispatched', {
                    action: { label: 'Track', onClick: () => router.push(`/rescue/track/${trackingToken}`) },
                });
                radar.reload();
            } catch {
                toast.error('Another garage accepted this call first.');
                radar.reload();
            }
        },
        [auth, radar, router],
    );

    const statusLine = d ? `Bay utilization at ${d.shop.utilizationPct}%. ${d.shop.mechanicsDispatched} mechanics dispatched.` : undefined;
    const active = view === 'PART' ? 'parts' : view === 'SERVICE' ? 'bays' : 'overview';

    return (
        <DashboardShell active={active} statusLine={statusLine}>
            {dashboard.error ? (
                <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center flex flex-col items-center gap-2">
                    <Icon name="cloud_off" className="text-[32px] text-tertiary" />
                    <p className="font-title-md text-title-md">We couldn&apos;t load your shop dashboard.</p>
                    <button type="button" onClick={dashboard.reload} className="font-label-lg text-label-lg text-primary">
                        Try again
                    </button>
                </div>
            ) : !d ? (
                <div className="flex flex-col gap-space-lg animate-pulse" aria-label="Loading dashboard">
                    <div className="h-28 rounded-xl bg-surface-container-lowest" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="h-36 rounded-xl bg-surface-container-lowest" />
                        ))}
                    </div>
                    <div className="h-96 rounded-xl bg-surface-container-lowest" />
                </div>
            ) : (
                <div className="flex flex-col w-full space-y-space-lg">
                    <VerificationBanner status={profile.data?.verification.status} reason={profile.data?.verification.rejectionReason} />
                    <ShopHeader shop={{ ...d.shop, accepting: profile.data?.accepting ?? false, autoDispatch: profile.data?.accepting ?? false }} displayName={shopName || d.shop.name} onToggle={toggle} toggling={toggling} onNewItem={() => setNewItemOpen(true)} />
                    <KpiCards kpis={d.kpis} />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                        <RevenueChart revenue={d.revenue} />
                        <DispatchRadarCard radar={radar.data} fleet={d.fleet} accepting={profile.data?.accepting ?? false} onAccept={accept} />
                    </div>
                    <InventorySection auth={auth} initialType={view} refreshKey={catalogVersion} />
                    <ReviewsSection auth={auth} />
                </div>
            )}
            <NewItemDialog auth={auth} open={newItemOpen} onOpenChange={setNewItemOpen} onCreated={() => setCatalogVersion((v) => v + 1)} />
        </DashboardShell>
    );
}

function GarageDashboardGate() {
    const account = useAccount();

    if (account.status === 'loading' || (account.status === 'authenticated' && !account.membershipsLoaded)) {
        return <div className="min-h-screen bg-surface" aria-busy="true" />;
    }

    if (account.status === 'authenticated' && account.activeMembership && account.accessToken) {
        return (
            <Dashboard
                auth={{ token: account.accessToken, organizationId: account.activeMembership.organizationId }}
                shopName={account.activeMembership.name}
            />
        );
    }

    return (
        <DashboardShell active="overview">
            <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-xl shadow-sm p-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon name="storefront" className="text-[32px]" />
                </div>
                <h1 className="font-headline-md text-headline-md text-on-surface">No garage on this account yet</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                    Register your workshop or mobile rescue unit to unlock the command dashboard, dispatch radar and catalogue tools.
                </p>
                <Link href="/partners" className="px-8 py-3.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container flex items-center gap-2">
                    Join the Partner Network <Icon name="arrow_forward" className="text-[20px]" />
                </Link>
            </div>
        </DashboardShell>
    );
}

export default function GarageDashboardPage() {
    return (
        <Suspense>
            <GarageDashboardGate />
        </Suspense>
    );
}
