'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useApi } from '@/hooks/use-api';
import { ApiError } from '@/lib/api/problem';
import {
    rememberTracking,
    rescueApi,
    type GeoPoint,
    type PaymentMethod,
    type ResolvedLocation,
    type ServiceMode,
} from '@/lib/api/rescue';
import { useCart } from '@/providers/cart-provider';

// Waiyaki Way, Westlands — used when the browser cannot share a position.
const FALLBACK_POINT: GeoPoint = { lat: -1.2642, lng: 36.8044 };

const schema = z.object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    phone: z.string().regex(/^\d{9}$/, 'Enter the 9 digits after +254'),
    email: z.string().trim().email('Enter a valid email for your receipt'),
    make: z.string().trim().min(2, 'Enter the make'),
    model: z.string().trim().min(1, 'Enter the model'),
    year: z.coerce.number().int().min(1980, 'Enter the year').max(new Date().getFullYear() + 1, 'Enter the year'),
    plate: z.string().trim().min(5, 'Enter the plate number'),
});

export type CheckoutFields = { fullName: string; phone: string; email: string; make: string; model: string; year: string; plate: string };
export type FieldErrors = Partial<Record<keyof CheckoutFields | 'location' | 'form', string>>;
export type LocationState =
    | { kind: 'locating' }
    | { kind: 'ready'; location: ResolvedLocation; approximate: boolean }
    | { kind: 'failed' };

/** Strip +254 / leading 0 and spaces so "0712 345 678" becomes "712345678". */
export function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('254')) return digits.slice(3, 12);
    if (digits.startsWith('0')) return digits.slice(1, 10);
    return digits.slice(0, 9);
}

export function useCheckout() {
    const params = useSearchParams();
    const router = useRouter();
    const cart = useCart();
    const { data: session } = useSession();

    const [mode, setMode] = useState<ServiceMode>(params.get('mode') === 'IN_SHOP' ? 'IN_SHOP' : 'ROADSIDE');
    const [fields, setFields] = useState<CheckoutFields>({ fullName: '', phone: '', email: '', make: '', model: '', year: '', plate: '' });
    const [notes, setNotes] = useState('');
    const [payment, setPayment] = useState<PaymentMethod>('MPESA');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [location, setLocation] = useState<LocationState>({ kind: 'locating' });

    // Prefill contact details for signed-in motorists without overwriting anything typed.
    useEffect(() => {
        if (!session?.user) return;
        setFields((f) => ({
            ...f,
            fullName: f.fullName || `${session.user.firstName} ${session.user.lastName}`.trim(),
            email: f.email || session.user.email,
            phone: f.phone || normalizePhone(session.user.phone ?? ''),
        }));
    }, [session?.user]);

    const resolve = (point: GeoPoint, approximate: boolean) =>
        rescueApi
            .reverseGeocode(point)
            .then((loc) => setLocation({ kind: 'ready', location: loc, approximate }))
            .catch(() => setLocation({ kind: 'failed' }));

    const locate = () => {
        setLocation({ kind: 'locating' });
        if (!('geolocation' in navigator)) return void resolve(FALLBACK_POINT, true);
        navigator.geolocation.getCurrentPosition(
            (pos) => void resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }, false),
            () => void resolve(FALLBACK_POINT, true),
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    useEffect(() => {
        const lat = Number(params.get('lat'));
        const lng = Number(params.get('lng'));
        if (params.get('lat') && Number.isFinite(lat) && Number.isFinite(lng)) void resolve({ lat, lng }, false);
        else locate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const offerIds = useMemo(() => cart.lines.map((l) => l.offerId), [cart.lines]);
    const quote = useApi(`quote:${mode}:${offerIds.join(',')}`, () => rescueApi.quote({ offerIds, mode }));

    const set = (key: keyof CheckoutFields, value: string) => {
        setFields((f) => ({ ...f, [key]: key === 'phone' ? normalizePhone(value) : value }));
        setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
    };

    const contactDone = schema.pick({ fullName: true, phone: true }).safeParse(fields).success;
    const vehicleDone = schema.pick({ make: true, model: true, year: true, plate: true }).safeParse(fields).success;
    const step = contactDone && vehicleDone && location.kind === 'ready' ? 2 : 1;

    const submit = async () => {
        const parsed = schema.safeParse(fields);
        const next: FieldErrors = {};
        if (!parsed.success) for (const issue of parsed.error.issues) next[issue.path[0] as keyof CheckoutFields] ??= issue.message;
        if (location.kind !== 'ready') next.location = 'We need your location to dispatch a mechanic.';
        if (!quote.data) next.form = 'Your quote is still loading.';
        setErrors(next);
        if (Object.keys(next).length || !parsed.success || location.kind !== 'ready' || !quote.data) return false;

        setSubmitting(true);
        try {
            const created = await rescueApi.create(
                {
                    quoteId: quote.data.id,
                    offerIds,
                    mode,
                    contact: { fullName: parsed.data.fullName, phone: parsed.data.phone, email: parsed.data.email },
                    vehicle: { make: parsed.data.make, model: parsed.data.model, year: parsed.data.year, plate: parsed.data.plate.toUpperCase() },
                    location: {
                        lat: location.location.lat,
                        lng: location.location.lng,
                        label: location.location.label,
                        detail: location.location.detail,
                    },
                    notes: notes.trim(),
                    paymentMethod: payment,
                },
                session?.user.accessToken,
            );
            rememberTracking(created.trackingToken);
            cart.clear();
            router.push(`/rescue/track/${created.trackingToken}`);
            return true;
        } catch (err) {
            if (err instanceof ApiError && err.fieldErrors.length) {
                const fe: FieldErrors = {};
                for (const e of err.fieldErrors) {
                    const key = e.field.split('.').pop() as keyof FieldErrors;
                    fe[key] = e.message;
                }
                setErrors(fe);
            } else {
                setErrors({ form: err instanceof Error ? err.message : 'Dispatch failed. Call the hotline.' });
            }
            setSubmitting(false);
            return false;
        }
    };

    return {
        mode,
        setMode,
        fields,
        set,
        notes,
        setNotes,
        payment,
        setPayment,
        errors,
        submitting,
        submit,
        location,
        locate,
        quote,
        step,
        signedIn: Boolean(session?.user),
    };
}

export type Checkout = ReturnType<typeof useCheckout>;
