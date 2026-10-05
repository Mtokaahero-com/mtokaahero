import Link from 'next/link';
import { Icon } from '@/components/brand/Icon';
import { LogoMark } from '@/components/brand/Logo';
import { GuestSosBanner } from './GuestSosBanner';

/** Sign in / Create account layout from the Stitch "Sign In & Create Account (Email)" screen. */
export function AuthShell({
    title,
    subtitle,
    children,
    showSos = true,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    showSos?: boolean;
}) {
    return (
        <main className="flex flex-col relative w-full bg-surface min-h-screen">
            <div className="flex flex-col w-full max-w-md mx-auto pb-8 sm:pt-6">
                {showSos && (
                    <div className="px-4 pt-3 pb-2">
                        <GuestSosBanner />
                    </div>
                )}
                <header className="px-4 pt-4 pb-4 flex flex-col items-center text-center">
                    <Link href="/" className="w-full max-w-[200px] mb-2 flex justify-center items-center" aria-label="MtokaaHero home">
                        <LogoMark className="w-full h-auto max-h-10" />
                    </Link>
                    <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-bold tracking-tight">{title}</h1>
                    {subtitle && <p className="font-body-md text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
                </header>
                <div className="px-4 flex flex-col gap-5">{children}</div>
                <footer className="px-4 mt-8 flex flex-col items-center text-center gap-2">
                    <div className="flex items-center gap-3 text-on-surface-variant font-label-md text-label-md">
                        <Link className="hover:text-primary transition-colors" href="/terms">
                            Terms
                        </Link>
                        <span className="text-outline-variant">•</span>
                        <Link className="hover:text-primary transition-colors" href="/privacy">
                            Privacy
                        </Link>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline max-w-xs">© MtokaaHero Kenya Ltd. Secure garage network &amp; roadside rescue.</p>
                </footer>
            </div>
        </main>
    );
}

/** Password reset and email verification layout: app bar with back/help, cards, encrypted-auth footer. */
export function AuthFlowShell({ children, backHref = '/auth/signin', backLabel = 'Back to sign in' }: { children: React.ReactNode; backHref?: string; backLabel?: string }) {
    return (
        <div className="w-full min-h-screen bg-slate-50">
            <div className="w-full max-w-md mx-auto min-h-screen flex flex-col">
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 shadow-sm">
                    <Link
                        href={backHref}
                        aria-label={backLabel}
                        className="w-11 h-11 -ml-1 rounded-[12px] flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 transition-all"
                    >
                        <Icon name="arrow_back" className="text-[24px]" />
                    </Link>
                    <Link href="/" aria-label="MtokaaHero home">
                        <LogoMark />
                    </Link>
                    <Link
                        href="/contact"
                        title="Rescue Hotline & Help"
                        aria-label="Help"
                        className="w-11 h-11 rounded-[12px] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                    >
                        <Icon name="help" className="text-[22px]" />
                    </Link>
                </header>
                <main className="flex-1 px-4 py-5 space-y-5">{children}</main>
                <footer className="py-4 px-4 text-center border-t border-slate-200/60 bg-white/60">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Icon name="lock" className="text-[13px] text-emerald-600" />
                        <span>End-to-end encrypted authentication</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">© {new Date().getFullYear()} MtokaaHero Automotive Network. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

/** White form card with the royal-blue accent bar across the top. */
export function FlowCard({ title, intro, children }: { title: string; intro?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
            <div className="mb-5 pt-1">
                <h1 className="font-heading text-[22px] sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">{title}</h1>
                {intro && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{intro}</p>}
            </div>
            {children}
        </div>
    );
}
