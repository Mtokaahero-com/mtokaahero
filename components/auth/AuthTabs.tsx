import Link from 'next/link';
import { cn } from '@/lib/utils';

export function AuthTabs({ active }: { active: 'signin' | 'signup' }) {
    const tab = (key: 'signin' | 'signup', href: string, label: string) => (
        <Link
            href={href}
            role="tab"
            aria-selected={active === key}
            aria-current={active === key ? 'page' : undefined}
            className={cn(
                'flex-1 py-2 rounded-lg font-label-lg text-label-lg font-semibold text-center transition-all',
                active === key ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
            )}
        >
            {label}
        </Link>
    );
    return (
        <nav className="bg-surface-container-high p-1 rounded-xl flex items-center shadow-inner" role="tablist">
            {tab('signin', '/auth/signin', 'Sign in')}
            {tab('signup', '/auth/signup', 'Create account')}
        </nav>
    );
}
