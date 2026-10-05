'use client';

import { Icon } from '@/components/brand/Icon';
import type { MarketplaceFilters, VehicleSelection } from '@/lib/api/marketplace';
import type { Marketplace } from './useMarketplace';

function Field({ label, icon, iconClass, span, children }: { label: string; icon: string; iconClass?: string; span: string; children: React.ReactNode }) {
    return (
        <div className={`${span} flex flex-col`}>
            <label className="font-code-xs text-code-xs text-on-surface-variant mb-1 font-medium">{label}</label>
            <div className="relative flex items-center bg-surface-container-low rounded-lg px-space-sm py-space-xs focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary">
                <Icon name={icon} className={`${iconClass ?? 'text-on-surface-variant'} text-[20px] mr-2`} />
                {children}
            </div>
        </div>
    );
}

const selectClass = 'w-full bg-transparent font-title-md text-title-md text-on-surface focus:outline-none cursor-pointer';

export function modelsFor(filters: MarketplaceFilters | undefined, v: VehicleSelection) {
    return filters?.makes.find((m) => m.id === v.makeId)?.models ?? [];
}

/** "Step 1: Calibrate Vehicle Spec" card from the desktop marketplace hero. */
export function VehicleFilterBar({ market }: { market: Marketplace }) {
    const { state, update, filters } = market;
    const f = filters.data;
    const draft = state.draftVehicle;
    const models = modelsFor(f, draft);
    const years = models.find((m) => m.id === draft.modelId)?.years ?? [];

    const setDraft = (patch: VehicleSelection) => update({ draftVehicle: { ...draft, ...patch } });

    return (
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider flex items-center gap-space-xs">
                    <Icon name="minor_crash" className="text-primary text-[18px]" />
                    Step 1: Calibrate Vehicle Spec for Guaranteed Fitment
                </span>
                <span className="font-code-xs text-code-xs text-primary bg-primary-fixed/50 px-2 py-0.5 rounded">VIN Decoder Ready</span>
            </div>
            <form
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-space-sm items-center"
                onSubmit={(e) => {
                    e.preventDefault();
                    update({ vehicle: draft });
                }}
            >
                <Field label="VEHICLE MAKE" icon="directions_car" span="lg:col-span-3">
                    <select
                        aria-label="Vehicle make"
                        className={selectClass}
                        value={draft.makeId ?? ''}
                        onChange={(e) => {
                            const make = f?.makes.find((m) => m.id === e.target.value);
                            const model = make?.models[0];
                            setDraft({ makeId: e.target.value, modelId: model?.id, year: model?.years[0] });
                        }}
                    >
                        {f?.makes.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        )) ?? <option>Toyota</option>}
                    </select>
                </Field>
                <Field label="SERIES / MODEL" icon="tune" span="lg:col-span-3">
                    <select
                        aria-label="Series or model"
                        className={selectClass}
                        value={draft.modelId ?? ''}
                        onChange={(e) => {
                            const model = models.find((m) => m.id === e.target.value);
                            setDraft({ modelId: e.target.value, year: model?.years.includes(draft.year ?? 0) ? draft.year : model?.years[0] });
                        }}
                    >
                        {models.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="BUILD YEAR" icon="calendar_today" span="lg:col-span-2">
                    <select
                        aria-label="Build year"
                        className={selectClass}
                        value={draft.year ?? ''}
                        onChange={(e) => setDraft({ year: Number(e.target.value) })}
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="SERVICE LOCALITY" icon="location_on" iconClass="text-tertiary" span="lg:col-span-2">
                    <select
                        aria-label="Service locality"
                        className={selectClass}
                        value={state.localityId}
                        onChange={(e) => update({ localityId: e.target.value })}
                    >
                        {f?.localities.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.radiusKm ? `${l.name} (${l.radiusKm}km)` : l.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <div className="lg:col-span-2 flex flex-col justify-end">
                    <label className="hidden lg:block font-code-xs text-code-xs text-transparent mb-1" aria-hidden="true">
                        EXECUTE
                    </label>
                    <button
                        className="h-12 w-full bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-space-xs shadow-md transition-all active:scale-[0.98]"
                        type="submit"
                    >
                        <Icon name="filter_alt" className="text-[20px]" />
                        <span>Filter Results</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
