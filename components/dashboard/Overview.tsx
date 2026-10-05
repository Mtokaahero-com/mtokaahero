'use client';

import { Icon } from '@/components/brand/Icon';
import type { GarageDashboard } from '@/lib/api/garage';
import { formatMoney, formatMoneyCompact } from '@/lib/format';
import { cn } from '@/lib/utils';

const card = 'bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]';

function Stars({ value, className }: { value: number; className?: string }) {
    return (
        <div className={cn('flex text-amber-500', className)} aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Icon key={i} name={value >= i ? 'star' : value >= i - 0.5 ? 'star_half' : 'star'} fill={value >= i - 0.5} className="text-[16px]" />
            ))}
        </div>
    );
}

export function ShopHeader({
    shop,
    displayName,
    onToggle,
    toggling,
    onNewItem,
}: {
    shop: GarageDashboard['shop'];
    displayName: string;
    onToggle: (accepting: boolean) => void;
    toggling: boolean;
    onNewItem: () => void;
}) {
    return (
        <div className={cn(card, 'p-space-lg flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md')}>
            <div className="flex items-center gap-space-md min-w-0">
                <div className="relative w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="garage_home" className="text-primary text-[32px]" />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        {shop.accepting && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                        <span className={cn('relative inline-flex rounded-full h-4 w-4', shop.accepting ? 'bg-emerald-500' : 'bg-outline')} />
                    </span>
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex flex-wrap items-center gap-space-xs">
                        <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">{displayName}</h1>
                        <span className="font-code-xs text-code-xs px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold">Tenant {shop.tenantCode}</span>
                        <span className="font-code-xs text-code-xs px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">{shop.tier}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-on-surface-variant">
                        <div className="flex items-center gap-1">
                            <Stars value={shop.rating} />
                            <span className="font-code-sm text-code-sm text-on-surface font-semibold">{shop.rating.toFixed(2)}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">({shop.reviewCount} Motorist Reviews)</span>
                        </div>
                        <span className="text-on-surface-variant/40">•</span>
                        <span className="font-body-sm text-body-sm flex items-center gap-1 text-on-surface-variant">
                            <Icon name="location_on" className="text-[16px]" />
                            {shop.location}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-md w-full xl:w-auto justify-between xl:justify-end pt-2 xl:pt-0">
                <div className="flex items-center gap-3 bg-surface-container-low px-space-md py-space-xs rounded-xl">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={shop.accepting}
                            disabled={toggling}
                            onChange={(e) => onToggle(e.target.checked)}
                            aria-label="Accept rescue requests"
                        />
                        <div className="w-11 h-6 bg-surface-variant peer-focus-visible:ring-2 peer-focus-visible:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                    </label>
                    <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5" role="status">
                            <span className={cn('w-2 h-2 rounded-full inline-block', shop.accepting ? 'bg-emerald-500 animate-pulse' : 'bg-outline')} />
                            {shop.accepting ? 'Online: Accepting Rescues' : 'Paused: Offline'}
                        </span>
                        <span className="font-code-xs text-code-xs text-on-surface-variant">{shop.autoDispatch ? 'Auto-dispatch armed' : 'Dispatch paused'}</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onNewItem}
                    className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors"
                >
                    <Icon name="add_circle" className="text-[20px]" />
                    <span>New Product or Service</span>
                </button>
            </div>
        </div>
    );
}

function Sparkline({ points }: { points: number[] }) {
    const max = Math.max(...points, 1);
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i / (points.length - 1)) * 100} ${22 - (p / max) * 20}`).join(' ');
    return (
        <svg className="w-28 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 24" aria-hidden="true">
            <path d={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </svg>
    );
}

export function KpiCards({ kpis }: { kpis: GarageDashboard['kpis'] }) {
    const head = (label: string, icon: string, tone: string) => (
        <div className="flex items-center justify-between mb-2">
            <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', tone)}>
                <Icon name={icon} className="text-[20px]" />
            </div>
        </div>
    );
    const value = 'font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight';
    const { revenue, rescues, parts, csat } = kpis;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
            <div className={cn(card, 'p-space-md flex flex-col justify-between')}>
                {head('Total Gross Revenue', 'payments', 'bg-surface-container-high text-primary')}
                <div className="flex items-baseline justify-between gap-2 mb-2">
                    <span className={cn(value, 'whitespace-nowrap')} title={formatMoney(revenue.total)}>{formatMoneyCompact(revenue.total)}</span>
                    <span className="font-code-xs text-code-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold flex items-center shrink-0">
                        <Icon name={revenue.changePct >= 0 ? 'trending_up' : 'trending_down'} className="text-[14px]" />
                        {revenue.changePct >= 0 ? '+' : ''}
                        {revenue.changePct}%
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2">
                    <Sparkline points={revenue.sparkline} />
                    <span className="font-code-xs text-code-xs text-on-surface-variant text-right">vs {formatMoneyCompact(revenue.previous)} prev month</span>
                </div>
            </div>
            <div className={cn(card, 'p-space-md flex flex-col justify-between')}>
                {head('Roadside Rescues Completed', 'fmd_bad', 'bg-tertiary-fixed text-tertiary')}
                <div className="flex items-baseline justify-between mb-2">
                    <span className={value}>
                        {rescues.completed} <span className="font-body-md text-body-md font-normal text-on-surface-variant">missions</span>
                    </span>
                    <span className="font-code-xs text-code-xs px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-semibold flex items-center">
                        <Icon name="speed" className="text-[14px]" />
                        {rescues.avgMinutes}m avg
                    </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                        <div className="bg-tertiary-container h-1.5 rounded-full" style={{ width: `${Math.min(100, rescues.onTimePct)}%` }} />
                    </div>
                    <span className="font-code-xs text-code-xs text-on-surface-variant ml-2 whitespace-nowrap">{rescues.onTimePct}% on-time</span>
                </div>
            </div>
            <div className={cn(card, 'p-space-md flex flex-col justify-between')}>
                {head('Products & Parts Fitted', 'inventory_2', 'bg-secondary-fixed text-secondary')}
                <div className="flex items-baseline justify-between mb-2">
                    <span className={value}>
                        {parts.unitsFitted} <span className="font-body-md text-body-md font-normal text-on-surface-variant">units</span>
                    </span>
                    <span className="font-code-xs text-code-xs px-1.5 py-0.5 rounded bg-secondary-fixed text-secondary font-semibold">{parts.inStockPct}% in-stock</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-on-surface-variant font-code-xs text-code-xs gap-2">
                    <span>Fastest seller: {parts.topSeller.name}</span>
                    <span className="text-primary font-semibold">{parts.topSeller.dispatched} dispatched</span>
                </div>
            </div>
            <div className={cn(card, 'p-space-md flex flex-col justify-between')}>
                {head('Customer Satisfaction (CSAT)', 'thumb_up', 'bg-emerald-100 text-emerald-800')}
                <div className="flex items-baseline justify-between mb-2">
                    <span className={value}>{csat.pct}%</span>
                    <div className="flex items-center gap-1 font-code-xs text-code-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        <Icon name="star" fill className="text-[13px]" />
                        {csat.rating} / 5.0
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2 text-on-surface-variant font-code-xs text-code-xs">
                    <span>Based on {csat.ratings} ratings</span>
                    <span className="text-emerald-700 font-semibold">{csat.escalations} Escalate Flags</span>
                </div>
            </div>
        </div>
    );
}

/** Catmull-Rom spline through the points, as cubic Bézier segments. */
function smoothPath(points: [number, number][]): string {
    if (points.length < 2) return '';
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
    }
    return d;
}

export function RevenueChart({ revenue }: { revenue: GarageDashboard['revenue'] }) {
    const base = 190;
    const gap = 2;
    const step = 700 / revenue.buckets.length;
    const maxStack = Math.max(...revenue.buckets.map((b) => b.parts + b.labor + b.rescue + gap * 2), 1);
    const k = 180 / maxStack;
    const bars = revenue.buckets.map((b, i) => {
        const x = step * i + (step - 30) / 2;
        const hp = b.parts * k;
        const hl = b.labor * k;
        const hr = b.rescue * k;
        const yp = base - hp;
        const yl = yp - gap - hl;
        const yr = yl - gap - hr;
        return { b, x, hp, hl, hr, yp, yl, yr };
    });
    const trend = smoothPath(bars.map((bar) => [bar.x + 15, bar.yr - 2] as [number, number]));
    const labelIdx = [0, 2, 4, 6, 8, revenue.buckets.length - 1];

    return (
        <div className={cn(card, 'lg:col-span-8 p-space-lg flex flex-col')}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
                <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Revenue Breakdown &amp; Dispatch Output</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Spare Parts Commerce vs. Workshop Labor &amp; Emergency Field Rescue ({revenue.period})
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {[
                        ['bg-primary', 'Parts Retail'],
                        ['bg-secondary', 'Bay Labor'],
                        ['bg-tertiary-container', 'SOS Rescues'],
                    ].map(([dot, label]) => (
                        <span key={label} className="flex items-center gap-1 text-code-xs font-code-xs text-on-surface-variant font-medium">
                            <span className={cn('w-2.5 h-2.5 rounded-full inline-block', dot)} />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
            <div className="relative w-full h-64 flex flex-col justify-between">
                <svg className="w-full h-52 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200" role="img" aria-label="Revenue by stream over the period">
                    {[40, 90, 140].map((y) => (
                        <line key={y} stroke="#f2f3ff" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1={y} y2={y} />
                    ))}
                    <line stroke="#dae2fd" strokeWidth="1" x1="0" x2="700" y1="190" y2="190" />
                    {bars.map(({ b, x, hp, hl, hr, yp, yl, yr }) => (
                        <g key={b.label} className="cursor-pointer group">
                            <title>{`${b.label}: parts ${b.parts}, labor ${b.labor}, rescue ${b.rescue}`}</title>
                            <rect className="fill-primary transition-all group-hover:opacity-85" height={hp} rx="3" width="30" x={x} y={yp} />
                            <rect className="fill-secondary transition-all group-hover:opacity-85" height={hl} rx="3" width="30" x={x} y={yl} />
                            <rect className="fill-tertiary-container transition-all group-hover:opacity-85" height={hr} rx="3" width="30" x={x} y={yr} />
                        </g>
                    ))}
                    <path d={trend} fill="none" stroke="#2151da" strokeDasharray="3 3" strokeWidth="2.5" />
                </svg>
                <div className="flex justify-between font-code-xs text-code-xs text-on-surface-variant pt-2 border-t border-surface-container">
                    {labelIdx.map((i) => (
                        <span key={i}>{revenue.buckets[i]?.label}</span>
                    ))}
                </div>
            </div>
            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low p-space-sm rounded-lg">
                <div className="flex items-center gap-2">
                    <Icon name="verified" className="text-primary text-[18px]" />
                    <span>
                        Automatic payout cycle active: Next scheduled transfer <strong>{revenue.nextPayout}</strong>
                    </span>
                </div>
                <a className="text-primary font-label-md text-label-md font-semibold hover:underline" href={revenue.ledgerUrl} download>
                    Download Tax Ledger (CSV)
                </a>
            </div>
        </div>
    );
}
