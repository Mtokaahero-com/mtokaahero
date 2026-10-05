'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Icon } from '@/components/brand/Icon';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useApi } from '@/hooks/use-api';
import { garageApi, type CatalogItem, type CatalogItemInput, type DispatchRadar, type GarageAuth, type GarageDashboard, type Review } from '@/lib/api/garage';
import type { ItemType } from '@/lib/api/marketplace';
import { ApiError } from '@/lib/api/problem';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

const card = 'bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]';

function useNow(intervalMs = 1000) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
}

const mmss = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function DispatchRadarCard({
    radar,
    fleet,
    accepting,
    onAccept,
}: {
    radar: DispatchRadar | undefined;
    fleet: GarageDashboard['fleet'];
    accepting: boolean;
    onAccept: (id: string) => Promise<void>;
}) {
    const now = useNow();
    const [busy, setBusy] = useState<string | null>(null);
    const live = radar?.calls.filter((c) => new Date(c.expiresAt).getTime() > now) ?? [];

    return (
        <div id="dispatch" className={cn(card, 'lg:col-span-4 p-space-lg flex flex-col justify-between scroll-mt-28')}>
            <div>
                <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            {accepting && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />}
                            <span className={cn('relative inline-flex rounded-full h-3 w-3', accepting ? 'bg-tertiary-container' : 'bg-outline')} />
                        </span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Dispatch Radar</h2>
                    </div>
                    {live.length > 0 && (
                        <span className="font-code-xs text-code-xs bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {live.filter((c) => c.severity === 'URGENT').length || live.length} Urgent
                        </span>
                    )}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Live emergency calls within your {radar?.radiusKm ?? 15}km garage service geo-fence.
                </p>
                <div className="space-y-space-sm" aria-live="polite">
                    {!accepting ? (
                        <div className="p-space-md bg-surface-container-low rounded-xl text-center font-body-sm text-body-sm text-on-surface-variant">
                            You&apos;re offline. Switch on “Accepting Rescues” to receive SOS calls.
                        </div>
                    ) : live.length === 0 ? (
                        <div className="p-space-md bg-surface-container-low rounded-xl text-center font-body-sm text-body-sm text-on-surface-variant">
                            <Icon name="radar" className="text-[28px] text-primary block mx-auto mb-1" />
                            No open calls in your geo-fence right now.
                        </div>
                    ) : (
                        live.map((c) => {
                            const urgent = c.severity === 'URGENT';
                            return (
                                <div key={c.id} className="p-space-md bg-surface-container-low rounded-xl relative overflow-hidden">
                                    <div className={cn('absolute top-0 left-0 bottom-0 w-1', urgent ? 'bg-tertiary-container' : 'bg-secondary')} />
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <Icon name={c.icon} className={cn('text-[18px]', urgent ? 'text-tertiary-container' : 'text-secondary')} />
                                            <span className="font-title-md text-title-md text-on-surface font-bold">{c.title}</span>
                                        </div>
                                        <span
                                            className={cn(
                                                'font-code-xs text-code-xs px-2 py-0.5 rounded font-bold',
                                                urgent ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed',
                                            )}
                                            title="Time left to accept"
                                        >
                                            {mmss(new Date(c.expiresAt).getTime() - now)}
                                        </span>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                                        {c.location} ({c.distanceKm} km away) • {c.vehicle}
                                    </p>
                                    <div className="flex items-center justify-between gap-2 pt-1">
                                        <div className="flex flex-wrap items-center gap-1 text-on-surface font-code-sm text-code-sm font-semibold">
                                            <span>EST: {formatMoney(c.estimate)}</span>
                                            <span className="text-on-surface-variant font-normal">| {c.paymentLabel}</span>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={busy === c.id}
                                            onClick={async () => {
                                                setBusy(c.id);
                                                await onAccept(c.id).finally(() => setBusy(null));
                                            }}
                                            className={cn(
                                                'px-space-sm py-1 rounded font-label-md text-label-md transition-colors shadow-sm shrink-0 disabled:opacity-70',
                                                urgent
                                                    ? 'bg-tertiary-container text-on-tertiary hover:bg-tertiary'
                                                    : 'bg-secondary text-on-secondary hover:bg-on-secondary-container',
                                            )}
                                        >
                                            {busy === c.id ? 'Dispatching…' : 'Accept & Dispatch'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div className="mt-space-md pt-space-sm border-t border-surface-container">
                <div className="flex items-center justify-between gap-2 text-on-surface-variant font-code-xs text-code-xs">
                    <span>
                        Active Mobile Units:{' '}
                        <strong>
                            {fleet.onRoad}/{fleet.total} On Road
                        </strong>
                    </span>
                    <span className="text-emerald-700 font-semibold">{fleet.note}</span>
                </div>
            </div>
        </div>
    );
}

const TABS: { type: ItemType | 'ALL'; label: string }[] = [
    { type: 'ALL', label: 'All Offerings' },
    { type: 'PART', label: 'Parts Inventory' },
    { type: 'SERVICE', label: 'Workshop Services' },
    { type: 'RESCUE_PACKAGE', label: 'Rescue Packages' },
];

const TYPE_CELL: Record<ItemType, { icon: string; label: string; className: string }> = {
    PART: { icon: 'inventory', label: 'Retail Part', className: 'text-primary' },
    SERVICE: { icon: 'garage', label: 'In-Shop Labor', className: 'text-secondary' },
    RESCUE_PACKAGE: { icon: 'electric_bolt', label: 'Mobile On-Site', className: 'text-tertiary-container' },
};

function StockPill({ stock }: { stock: CatalogItem['stock'] }) {
    const instant = stock.kind === 'INSTANT';
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-code-xs text-code-xs font-bold whitespace-nowrap',
                instant ? 'bg-primary-fixed text-primary' : 'bg-emerald-50 text-emerald-700',
            )}
        >
            <span className={cn('w-1.5 h-1.5 rounded-full', instant ? 'bg-primary animate-ping' : 'bg-emerald-600')} />
            {stock.label}
        </span>
    );
}

export function InventorySection({ auth, initialType, refreshKey }: { auth: GarageAuth; initialType: ItemType | 'ALL'; refreshKey: number }) {
    const [type, setType] = useState<ItemType | 'ALL'>(initialType);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const catalog = useApi(`catalog:${type}:${page}:${refreshKey}`, () =>
        garageApi.catalog(auth, { type: type === 'ALL' ? undefined : type, page, pageSize }),
    );
    const data = catalog.data;
    const pages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

    useEffect(() => setType(initialType), [initialType]);

    const act = async (fn: () => Promise<unknown>, success: string) => {
        try {
            await fn();
            toast.success(success);
            catalog.reload();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'That did not work. Try again.');
        }
    };

    return (
        <div id="inventory" className={cn(card, 'p-space-lg flex flex-col space-y-space-md scroll-mt-28')}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Inventory &amp; Service Offerings</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Manage workshop services, stocked retail parts, and roadside on-demand packages.</p>
                </div>
                <div className="flex items-center overflow-x-auto gap-1 bg-surface-container-low p-1 rounded-xl no-scrollbar" role="tablist">
                    {TABS.map((t) => (
                        <button
                            key={t.type}
                            type="button"
                            role="tab"
                            aria-selected={type === t.type}
                            onClick={() => {
                                setType(t.type);
                                setPage(1);
                            }}
                            className={cn(
                                'px-3 py-1.5 rounded-lg font-label-md text-label-md font-semibold whitespace-nowrap',
                                type === t.type ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
                            )}
                        >
                            {t.label}
                            {data ? ` (${data.counts[t.type]})` : ''}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="border-b border-surface-container text-on-surface-variant font-code-xs text-code-xs uppercase tracking-wider">
                            <th className="py-3 px-4">Item &amp; OEM / SKU</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Unit Rate (KES)</th>
                            <th className="py-3 px-4">Stock / Bay Capacity</th>
                            <th className="py-3 px-4">Rating</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={cn('divide-y divide-surface-container-low font-body-md text-body-md transition-opacity', catalog.loading && data && 'opacity-50')}>
                        {!data
                            ? Array.from({ length: pageSize }, (_, i) => (
                                  <tr key={i}>
                                      <td colSpan={8} className="py-3 px-4">
                                          <div className="h-10 rounded-lg bg-surface-container-low animate-pulse" />
                                      </td>
                                  </tr>
                              ))
                            : data.items.map((item) => {
                                  const t = TYPE_CELL[item.type];
                                  const categoryTone =
                                      item.type === 'RESCUE_PACKAGE' ? 'bg-tertiary-fixed text-tertiary' : 'bg-surface-container-high text-on-surface';
                                  return (
                                      <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                                          <td className="py-3 px-4">
                                              <div className="flex items-center gap-3 min-w-[280px]">
                                                  <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden flex items-center justify-center flex-shrink-0">
                                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                                      <img className="w-full h-full object-cover" alt="" src={item.image} />
                                                  </div>
                                                  <div className="min-w-0">
                                                      <span className="font-label-lg text-label-lg text-on-surface font-semibold block">{item.title}</span>
                                                      <span className="font-code-xs text-code-xs text-on-surface-variant">{item.code}</span>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="py-3 px-4">
                                              <span className={cn('px-2 py-0.5 rounded font-code-xs text-code-xs font-medium whitespace-nowrap', categoryTone)}>{item.category}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                              <span className={cn('inline-flex items-center gap-1 font-body-sm text-body-sm font-semibold whitespace-nowrap', t.className)}>
                                                  <Icon name={t.icon} className="text-[16px]" />
                                                  {t.label}
                                              </span>
                                          </td>
                                          <td className="py-3 px-4">
                                              <span className="font-headline-sm text-headline-sm text-on-surface font-bold whitespace-nowrap">{formatMoney(item.unitPrice)}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                              <StockPill stock={item.stock} />
                                          </td>
                                          <td className="py-3 px-4">
                                              {item.reviewCount > 0 ? (
                                                  <div className="flex items-center gap-1 font-code-xs text-code-xs">
                                                      <Icon name="star" fill className="text-amber-500 text-[14px]" />
                                                      <span className="font-bold text-on-surface">{item.rating.toFixed(1)}</span>
                                                      <span className="text-on-surface-variant">({item.reviewCount})</span>
                                                  </div>
                                              ) : (
                                                  <span className="font-code-xs text-code-xs text-on-surface-variant">New</span>
                                              )}
                                          </td>
                                          <td className="py-3 px-4">
                                              <button
                                                  type="button"
                                                  title={item.status === 'ACTIVE' ? 'Pause listing' : 'Activate listing'}
                                                  onClick={() =>
                                                      act(
                                                          () => garageApi.updateItem(auth, item.id, { status: item.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }),
                                                          item.status === 'ACTIVE' ? 'Listing paused' : 'Listing active',
                                                      )
                                                  }
                                                  className={cn(
                                                      'px-2 py-0.5 rounded-full font-code-xs text-code-xs font-semibold',
                                                      item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-on-surface-variant',
                                                  )}
                                              >
                                                  {item.status === 'ACTIVE' ? 'Active' : 'Paused'}
                                              </button>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                              <div className="flex items-center justify-end gap-1">
                                                  {item.type !== 'RESCUE_PACKAGE' && (
                                                      <button
                                                          type="button"
                                                          className="p-1 rounded text-on-surface-variant hover:text-emerald-700 hover:bg-surface-container"
                                                          title={item.type === 'PART' ? 'Restock +5' : 'Open a bay'}
                                                          aria-label={item.type === 'PART' ? `Restock ${item.title}` : `Open a bay for ${item.title}`}
                                                          onClick={() =>
                                                              act(() => garageApi.updateItem(auth, item.id, { restock: item.type === 'PART' ? 5 : 1 }), 'Capacity updated')
                                                          }
                                                      >
                                                          <Icon name={item.type === 'PART' ? 'add_box' : 'calendar_month'} className="text-[18px]" />
                                                      </button>
                                                  )}
                                                  {item.type === 'RESCUE_PACKAGE' && (
                                                      <span className="p-1 text-on-surface-variant" title="Dispatched on demand">
                                                          <Icon name="tune" className="text-[18px]" />
                                                      </span>
                                                  )}
                                                  <button
                                                      type="button"
                                                      className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container"
                                                      title="Remove"
                                                      aria-label={`Remove ${item.title}`}
                                                      onClick={() => act(() => garageApi.deleteItem(auth, item.id), `${item.title} removed`)}
                                                  >
                                                      <Icon name="delete" className="text-[18px]" />
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  );
                              })}
                    </tbody>
                </table>
            </div>
            {data && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-space-xs">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Showing {data.items.length} of {data.total} total catalog items • Synchronized with Central MtokaaHero Driver App
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="font-code-xs text-code-xs font-bold">
                            {page} / {pages}
                        </span>
                        <button
                            type="button"
                            disabled={page >= pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const fieldClass =
    'w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:outline-none rounded-lg px-3 py-2 text-on-surface font-body-sm text-body-sm';

export function NewItemDialog({ auth, open, onOpenChange, onCreated }: { auth: GarageAuth; open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
    const [values, setValues] = useState<CatalogItemInput>({ title: '', type: 'PART', unitPrice: 0, stock: '', category: 'Tyres & Alignment', sku: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const set = (k: keyof CatalogItemInput, v: string | number) => {
        setValues((s) => ({ ...s, [k]: v }));
        setErrors((e) => ({ ...e, [k]: '' }));
    };

    const save = async () => {
        setSaving(true);
        try {
            await garageApi.createItem(auth, values);
            toast.success(`${values.title} published to the marketplace`);
            setValues({ title: '', type: 'PART', unitPrice: 0, stock: '', category: 'Tyres & Alignment', sku: '' });
            onCreated();
            onOpenChange(false);
        } catch (err) {
            if (err instanceof ApiError && err.fieldErrors.length) setErrors(Object.fromEntries(err.fieldErrors.map((f) => [f.field, f.message])));
            else setErrors({ form: err instanceof Error ? err.message : 'Could not save.' });
        } finally {
            setSaving(false);
        }
    };

    const err = (k: string) => (errors[k] ? <p className="font-body-sm text-body-sm text-error mt-1">{errors[k]}</p> : null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <div className="flex items-center gap-2">
                    <Icon name="add_business" className="text-primary text-[24px]" />
                    <DialogTitle className="font-headline-sm text-headline-sm text-on-surface font-bold">Add New Catalog Offering</DialogTitle>
                </div>
                <DialogDescription className="sr-only">Publish a part, workshop service or rescue package to the marketplace.</DialogDescription>
                <form
                    className="space-y-space-sm"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        void save();
                    }}
                >
                    <div>
                        <label htmlFor="ni-title" className="block font-label-md text-label-md text-on-surface font-medium mb-1">
                            Item or Service Title
                        </label>
                        <input id="ni-title" className={fieldClass} placeholder="e.g. Michelin Primacy 4 215/55 R17" value={values.title} onChange={(e) => set('title', e.target.value)} />
                        {err('title')}
                    </div>
                    <div className="grid grid-cols-2 gap-space-sm">
                        <div>
                            <label htmlFor="ni-type" className="block font-label-md text-label-md text-on-surface font-medium mb-1">
                                Catalog Offering Type
                            </label>
                            <select id="ni-type" className={fieldClass} value={values.type} onChange={(e) => set('type', e.target.value as ItemType)}>
                                <option value="PART">Parts Retail Inventory</option>
                                <option value="SERVICE">In-Shop Labor &amp; Service</option>
                                <option value="RESCUE_PACKAGE">Mobile Emergency Rescue</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ni-price" className="block font-label-md text-label-md text-on-surface font-medium mb-1">
                                Unit Rate (KES)
                            </label>
                            <input
                                id="ni-price"
                                className={fieldClass}
                                placeholder="18,850"
                                inputMode="numeric"
                                value={values.unitPrice || ''}
                                onChange={(e) => set('unitPrice', Number(e.target.value.replace(/[^\d]/g, '')))}
                            />
                            {err('unitPrice')}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-space-sm">
                        <div>
                            <label htmlFor="ni-stock" className="block font-label-md text-label-md text-on-surface font-medium mb-1">
                                Stock Quantity or Capacity
                            </label>
                            <input id="ni-stock" className={fieldClass} placeholder="e.g. 12 or Unlimited" value={values.stock} onChange={(e) => set('stock', e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="ni-cat" className="block font-label-md text-label-md text-on-surface font-medium mb-1">
                                Category Classification
                            </label>
                            <select id="ni-cat" className={fieldClass} value={values.category} onChange={(e) => set('category', e.target.value)}>
                                <option>Tyres &amp; Alignment</option>
                                <option>Braking System</option>
                                <option>Engine &amp; Powertrain</option>
                                <option>Electrical &amp; Starting</option>
                                <option>Fluids &amp; Lubricants</option>
                                <option>Roadside Rescue</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ni-sku" className="block font-label-md text-label-md text-on-surface font-medium mb-1">
                            OEM / Part / Package SKU
                        </label>
                        <input id="ni-sku" className={cn(fieldClass, 'font-code-xs text-code-xs')} placeholder="e.g. TYR-MICH-21555" value={values.sku} onChange={(e) => set('sku', e.target.value)} />
                        {err('sku')}
                    </div>
                    {errors.form && <p className="font-body-sm text-body-sm text-error">{errors.form}</p>}
                    <div className="pt-space-sm flex items-center justify-end gap-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm disabled:opacity-70"
                        >
                            {saving ? 'Publishing…' : 'Save & Publish'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const AVATAR_TONES = ['bg-primary-fixed text-primary', 'bg-secondary-fixed text-secondary', 'bg-tertiary-fixed text-tertiary'];

function ago(iso: string) {
    const h = (Date.now() - new Date(iso).getTime()) / 3600_000;
    if (h < 1) return 'Just now';
    if (h < 24) return `${Math.floor(h)} hour${Math.floor(h) === 1 ? '' : 's'} ago`;
    if (h < 48) return 'Yesterday';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function ReviewCard({ review, index, auth }: { review: Review; index: number; auth: GarageAuth }) {
    const [replying, setReplying] = useState(false);
    const [text, setText] = useState('');
    const [reply, setReply] = useState(review.reply);
    const initials = review.author
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-space-sm">
            <div>
                <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={cn('w-8 h-8 rounded-full font-bold flex items-center justify-center font-code-xs text-code-xs shrink-0', AVATAR_TONES[index % 3])}>
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <span className="font-title-md text-title-md text-on-surface font-semibold block leading-tight truncate">{review.author}</span>
                            <span className="font-code-xs text-code-xs text-on-surface-variant">{review.vehicle}</span>
                        </div>
                    </div>
                    {review.verified && <span className="font-code-xs text-code-xs text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">Verified</span>}
                </div>
                <div className="flex text-amber-500 mb-2" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Icon key={i} name="star" fill={review.rating >= i} className="text-[16px]" />
                    ))}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface italic">&quot;{review.comment}&quot;</p>
                {reply && (
                    <div className="mt-2 p-2 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant">
                        <span className="font-semibold text-on-surface">Your reply: </span>
                        {reply}
                    </div>
                )}
                {replying && (
                    <form
                        className="mt-2 flex flex-col gap-2"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const updated = await garageApi.reply(auth, review.id, text);
                                setReply(updated.reply);
                                setReplying(false);
                                toast.success('Reply posted');
                            } catch (err) {
                                toast.error(err instanceof Error ? err.message : 'Could not post reply');
                            }
                        }}
                    >
                        <textarea
                            autoFocus
                            rows={2}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            aria-label={`Reply to ${review.author}`}
                            className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Thank the motorist or follow up…"
                        />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setReplying(false)} className="px-3 py-1 rounded-lg font-label-md text-label-md text-on-surface-variant">
                                Cancel
                            </button>
                            <button type="submit" className="px-3 py-1 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold">
                                Post reply
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                <span className="font-code-xs text-code-xs text-on-surface-variant">{ago(review.createdAt)}</span>
                {!reply && !replying && (
                    <button type="button" onClick={() => setReplying(true)} className="text-primary font-label-md text-label-md font-semibold hover:underline flex items-center gap-1">
                        <Icon name="reply" className="text-[16px]" />
                        Reply to Motorist
                    </button>
                )}
            </div>
        </div>
    );
}

export function ReviewsSection({ auth }: { auth: GarageAuth }) {
    const reviews = useApi(`reviews:${auth.organizationId}`, () => garageApi.reviews(auth));
    return (
        <div className={cn(card, 'p-space-lg flex flex-col space-y-space-md')}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Recent Verified Motorist Feedback</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time ratings submitted via the MtokaaHero Motorist App post-rescue and workshop checkout.</p>
                </div>
                <div className="flex items-center gap-2 font-code-xs text-code-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg shrink-0">
                    <Icon name="verified_user" className="text-[18px] text-emerald-700" />
                    <span>100% Verified Completed Jobs</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {reviews.data
                    ? reviews.data.map((r, i) => <ReviewCard key={r.id} review={r} index={i} auth={auth} />)
                    : Array.from({ length: 3 }, (_, i) => <div key={i} className="h-48 rounded-xl bg-surface-container-low animate-pulse" />)}
            </div>
        </div>
    );
}
