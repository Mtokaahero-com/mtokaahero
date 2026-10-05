import Link from 'next/link';
import { Icon } from '@/components/brand/Icon';
import { cn } from '@/lib/utils';

const TRUST = [
    { icon: 'verified', tone: 'text-primary', title: 'Verified Mechanics', body: 'Background-checked and certified technicians nationwide.' },
    { icon: 'build_circle', tone: 'text-primary', title: '100% Guaranteed Parts', body: 'OEM and Tier-1 aftermarket parts with verified fitment.' },
    { icon: 'fmd_good', tone: 'text-tertiary', title: '24/7 Roadside Assistance', body: 'Rapid towing, jumpstart, and flat-tire dispatch under 30 mins.' },
    { icon: 'shield', tone: 'text-secondary', title: 'Escrow Secure Payments', body: 'Funds released only when work and diagnostics are verified.' },
];

const COLUMNS = [
    {
        title: 'For Motorists',
        links: [
            ['Emergency SOS', '/rescue'],
            ['Book a Service Bay', '/?categoryId=garages'],
            ['Auto Parts Store', '/?categoryId=batteries'],
            ['Vehicle Service Log', '/rescue/track'],
        ],
    },
    {
        title: 'Garage Partners',
        links: [
            ['Shop Portal Access', '/dashboard/garage'],
            ['Register Workshop', '/partners'],
            ['Bay Utilization Tool', '/dashboard/garage'],
            ['Wholesale Parts Supply', '/partners?type=PARTS_SHOP'],
        ],
    },
    {
        title: 'Mobile Mechanics',
        links: [
            ['Join Hero Fleet', '/partners?type=MOBILE_MECHANIC'],
            ['Technician Tablet App', '/partners?type=MOBILE_MECHANIC'],
            ['Diagnostic Tool Grants', '/contact'],
            ['Territory Map', '/contact'],
        ],
    },
    {
        title: 'Emergency Dispatch',
        links: [
            ['Live Patrol Radar', '/rescue'],
            ['24/7 Heavy Towing', '/rescue'],
            ['File Insurance Claim', '/contact'],
            ['Rescue FAQs', '/contact'],
        ],
    },
];

/** Marketplace footer: trust tiles, four link columns, legal line and the garage registration CTA. */
export function SiteFooter({ className, showTrust = true }: { className?: string; showTrust?: boolean }) {
    return (
        <footer className={cn('w-full bg-surface-container-low', className)}>
            <div className="w-full px-gutter-lg py-space-xl">
                {showTrust && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg mb-space-xl">
                        {TRUST.map((t) => (
                            <div
                                key={t.title}
                                className="flex items-start gap-space-sm p-space-md bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]"
                            >
                                <Icon name={t.icon} className={cn('text-[28px]', t.tone)} />
                                <div>
                                    <h4 className="font-title-md text-title-md text-on-surface">{t.title}</h4>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">{t.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xl py-space-lg">
                    {COLUMNS.map((col) => (
                        <div key={col.title} className="flex flex-col gap-space-sm">
                            <h5 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">{col.title}</h5>
                            {col.links.map(([label, href]) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                        © {new Date().getFullYear()} MtokaaHero Technologies. All rights reserved. High-Trust Automotive Infrastructure.
                    </span>
                    <Link
                        href="/partners"
                        className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] hover:bg-primary transition-colors"
                    >
                        <Icon name="storefront" className="text-[18px]" />
                        <span>Register Garage Multi-Tenant Bay</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
