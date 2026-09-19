import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TONES = {
    loading: { icon: Loader2, className: 'text-primary animate-spin', bg: 'bg-primary-subtle' },
    success: { icon: CheckCircle2, className: 'text-success', bg: 'bg-success-subtle' },
    warning: { icon: AlertTriangle, className: 'text-warning', bg: 'bg-warning-subtle' },
} as const;

export function StatusCard({
    tone,
    title,
    children,
    action,
}: {
    tone: keyof typeof TONES;
    title: string;
    children?: React.ReactNode;
    action?: React.ReactNode;
}) {
    const { icon: Icon, className, bg } = TONES[tone];
    return (
        <div className="space-y-4 text-center" role={tone === 'loading' ? 'status' : undefined}>
            <span className={cn('mx-auto flex h-12 w-12 items-center justify-center rounded-full', bg)}>
                <Icon className={cn('h-6 w-6', className)} />
            </span>
            <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
            {children && <div className="text-sm text-muted-foreground">{children}</div>}
            {action}
        </div>
    );
}
