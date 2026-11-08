import type { ItemType } from '@/lib/api/marketplace';

/** Stock photos per category, shown until providers can upload item photos. */
const CATEGORY_IMAGE: Record<string, string> = {
    rescue: '/images/market/rescue-van.jpg',
    batteries: '/images/market/bosch-s5-showroom.jpg',
    brakes: '/images/market/brake-pads-workbench.jpg',
    tyres: '/images/market/tyre-mechanic-highway.jpg',
    engine: '/images/market/oil-change.jpg',
    fluids: '/images/market/castrol-edge.jpg',
    diagnostics: '/images/market/diagnostics-tablet.jpg',
    body: '/images/market/workshop-bay.jpg',
};

const TYPE_IMAGE: Record<ItemType, string> = {
    PART: '/images/market/bosch-agm-studio.jpg',
    SERVICE: '/images/market/workshop-bay.jpg',
    RESCUE_PACKAGE: '/images/market/rescue-van-thumb.jpg',
};

export function offerImage(item: {
    image?: { url: string | null } | null;
    categoryId?: string;
    type: ItemType;
}): string {
    return item.image?.url ?? (item.categoryId && CATEGORY_IMAGE[item.categoryId]) ?? TYPE_IMAGE[item.type];
}
