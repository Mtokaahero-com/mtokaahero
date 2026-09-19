import Image from 'next/image';
import Link from 'next/link';
import { GuestSosBanner } from './GuestSosBanner';

export function AuthShell({
    title,
    subtitle,
    children,
    footer,
    showSos = true,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    showSos?: boolean;
}) {
    return (
        <main className="min-h-screen bg-canvas px-4 py-6 sm:py-12">
            <div className="mx-auto w-full max-w-md space-y-6">
                {showSos && <GuestSosBanner />}
                <div className="space-y-2 text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Image src="/logo.png" alt="MtokaaHero" width={40} height={40} className="rounded-md" />
                        <span className="font-heading text-lg font-bold text-foreground">MtokaaHero</span>
                    </Link>
                    <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground max-sm:text-[30px]">{title}</h1>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                </div>
                <section className="rounded-lg border border-border bg-white p-5 shadow-card sm:p-6">{children}</section>
                {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
            </div>
        </main>
    );
}
