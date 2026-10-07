import Link from 'next/link';
import { Icon } from '@/components/brand/Icon';

export function GuestSosBanner() {
    return (
        <Link
            href="/rescue"
            className="flex items-center justify-between px-3.5 py-2.5 bg-tertiary text-on-tertiary rounded-xl shadow-sm active:scale-[0.98] transition-all"
        >
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                    <Icon name="emergency" fill className="text-[16px]" />
                </div>
                <div className="flex flex-col">
                    <span className="font-headline-sm text-sm text-white font-bold leading-tight">Need immediate rescue?</span>
                    <span className="font-body-sm text-[11px] text-on-tertiary-container leading-tight">No account needed</span>
                </div>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg text-white">
                <span className="font-label-md text-xs font-semibold">Guest SOS</span>
                <Icon name="arrow_forward" className="text-[14px]" />
            </div>
        </Link>
    );
}
