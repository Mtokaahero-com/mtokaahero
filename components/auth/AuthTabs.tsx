import Link from 'next/link';
import { cn } from '@/lib/utils';

export function AuthTabs({ active }: { active: 'signin' | 'signup' }) {
    const tab = (key: 'signin' | 'signup', href: string, label: string) => (
        <Link
            href={href}
            aria-current={active === key ? 'page' : undefined}
            className={cn(
                'flex-1 rounded-md py-2 text-center text-sm font-semibold transition-colors',
                active === key ? 'bg-white text-primary shadow-card' : 'text-muted-foreground hover:text-foreground',
            )}
        >
            {label}
        </Link>
    );
    return (
        <nav className="flex gap-1 rounded-lg bg-primary-subtle p-1">
            {tab('signin', '/auth/signin', 'Sign in')}
            {tab('signup', '/auth/signup', 'Create account')}
        </nav>
    );
}
