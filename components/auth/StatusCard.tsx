import { Icon } from '@/components/brand/Icon';
import { cn } from '@/lib/utils';

const TONES = {
    loading: {
        card: 'border-slate-200/90 bg-white',
        badge: 'bg-blue-50 text-blue-700',
        dot: 'bg-blue-600',
        badgeLabel: 'In progress',
        meta: 'text-slate-400',
    },
    success: {
        card: 'border-emerald-300 bg-gradient-to-b from-emerald-50/40 via-white to-white',
        badge: 'bg-emerald-100 text-emerald-800',
        dot: 'bg-emerald-600',
        badgeLabel: 'Verified',
        meta: 'text-emerald-700',
    },
    warning: {
        card: 'border-amber-300 bg-gradient-to-b from-amber-50/60 via-white to-white',
        badge: 'bg-amber-100 text-amber-800',
        dot: 'bg-amber-500',
        badgeLabel: 'Attention',
        meta: 'text-amber-700',
    },
} as const;

/** Result card from the Stitch password-reset and email-verification state screens. */
export function StatusCard({
    tone,
    title,
    badge,
    meta,
    children,
    action,
}: {
    tone: keyof typeof TONES;
    title: string;
    badge?: string;
    meta?: string;
    children?: React.ReactNode;
    action?: React.ReactNode;
}) {
    const t = TONES[tone];
    return (
        <div className={cn('rounded-2xl p-5 shadow-sm border-2 relative overflow-hidden', t.card)} role={tone === 'loading' ? 'status' : undefined}>
            <div className="flex items-center justify-between pb-3 mb-3">
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[11px] font-mono font-semibold uppercase tracking-wider', t.badge)}>
                    <span className={cn('w-1.5 h-1.5 rounded-pill', t.dot, tone !== 'warning' && 'animate-pulse')} />
                    {badge ?? t.badgeLabel}
                </span>
                {meta && <span className={cn('text-[11px] font-mono font-semibold tracking-wide uppercase', t.meta)}>{meta}</span>}
            </div>
            {tone === 'loading' ? (
                <div className="flex flex-col items-center text-center gap-3 py-2">
                    <div className="w-12 h-12 rounded-pill bg-blue-50 flex items-center justify-center">
                        <Icon name="progress_activity" className="text-[28px] text-blue-600 animate-spin" />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-slate-900">{title}</h2>
                    {children && <div className="text-sm text-slate-600 leading-relaxed">{children}</div>}
                </div>
            ) : (
                <div className="flex items-start gap-3.5">
                    <div
                        className={cn(
                            'w-10 h-10 rounded-pill flex items-center justify-center shrink-0 shadow-sm',
                            tone === 'success' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white',
                        )}
                    >
                        <Icon name={tone === 'success' ? 'check' : 'warning'} className="text-[22px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-heading text-lg font-bold text-slate-900 tracking-tight leading-tight">{title}</h2>
                        {children && <div className="text-sm text-slate-600 mt-1.5 leading-relaxed">{children}</div>}
                    </div>
                </div>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
