import { Icon } from '@/components/brand/Icon';
import { cn } from '@/lib/utils';

/** Page list like "1 2 3 … 8": first, last, and a window around the current page. */
export function pageItems(page: number, pages: number): (number | 'gap')[] {
    const keep = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
    if (page <= 3) [2, 3].forEach((p) => p <= pages && keep.add(p));
    const sorted = [...keep].sort((a, b) => a - b);
    const out: (number | 'gap')[] = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) out.push('gap');
        out.push(p);
    });
    return out;
}

export function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
    if (pages <= 1) return null;
    const navBtn = 'w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40';
    return (
        <nav aria-label="Pagination" className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-xl shadow-sm">
            <button type="button" aria-label="Previous page" className={navBtn} disabled={page === 1} onClick={() => onPage(page - 1)}>
                <Icon name="chevron_left" className="text-[18px]" />
            </button>
            {pageItems(page, pages).map((item, i) =>
                item === 'gap' ? (
                    <span key={`gap-${i}`} className="px-1 text-on-surface-variant text-xs">
                        •••
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-current={item === page ? 'page' : undefined}
                        onClick={() => onPage(item)}
                        className={cn(
                            'w-8 h-8 rounded font-label-md text-label-md transition-colors',
                            item === page ? 'bg-primary text-on-primary font-bold' : 'text-on-surface hover:bg-surface-container-low',
                        )}
                    >
                        {item}
                    </button>
                ),
            )}
            <button type="button" aria-label="Next page" className={navBtn} disabled={page === pages} onClick={() => onPage(page + 1)}>
                <Icon name="chevron_right" className="text-[18px]" />
            </button>
        </nav>
    );
}
