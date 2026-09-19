import { Siren, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function GuestSosBanner() {
    return (
        <Link
            href="/rescue"
            className="flex items-center gap-3 rounded-lg bg-rescue px-4 py-3 text-white shadow-raised transition-colors hover:bg-rescue/90"
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Siren className="h-5 w-5" />
            </span>
            <span className="flex-1">
                <span className="block font-heading text-base font-bold uppercase tracking-wide">Need immediate rescue?</span>
                <span className="block text-sm text-white/85">No account needed</span>
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold underline underline-offset-4">
                Guest SOS <ArrowRight className="h-4 w-4" />
            </span>
        </Link>
    );
}
