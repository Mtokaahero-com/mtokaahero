import type { GeoPoint, MapTile } from '@/lib/api/rescue';
import { cn } from '@/lib/utils';

/** Position of a point on a static map tile, as percentages from the top-left corner. */
export function project(tile: MapTile, p: GeoPoint): { left: number; top: number } {
    const { north, south, east, west } = tile.bounds;
    return {
        left: Math.min(100, Math.max(0, ((p.lng - west) / (east - west)) * 100)),
        top: Math.min(100, Math.max(0, ((north - p.lat) / (north - south)) * 100)),
    };
}

/** Static map backdrop; children are absolutely positioned overlays (pins, cards). */
export function MapSnapshot({ tile, className, label, children }: { tile: MapTile; className?: string; label: string; children?: React.ReactNode }) {
    return (
        <div className={cn('relative overflow-hidden', className)} role="img" aria-label={label}>
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${tile.imageUrl}')` }} />
            {children}
        </div>
    );
}
