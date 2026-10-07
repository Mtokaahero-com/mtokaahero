'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Offer } from '@/lib/api/marketplace';
import type { Money } from '@/lib/format';

export interface CartLine {
    offerId: string;
    title: string;
    type: Offer['type'];
    image: string;
    price: Money;
    provider: { id: string; name: string };
    quantity: number;
}

interface CartState {
    lines: CartLine[];
    count: number;
    total: Money | null;
    /** Adds an offer. A cart holds one provider's items (roadmap P10), so another provider's offer starts a new cart. */
    add: (offer: Offer) => { replaced: boolean };
    remove: (offerId: string) => void;
    clear: () => void;
}

const STORAGE_KEY = 'mtokaa.cart';
const CartContext = createContext<CartState | null>(null);

function readStored(): CartLine[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [lines, setLines] = useState<CartLine[]>([]);

    useEffect(() => setLines(readStored()), []);

    const persist = useCallback((next: CartLine[]) => {
        setLines(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // Storage unavailable (private mode): the cart still works for this page view.
        }
    }, []);

    const add = useCallback(
        (offer: Offer) => {
            const replaced = lines.length > 0 && lines[0].provider.id !== offer.provider.id;
            const base = replaced ? [] : lines;
            const existing = base.find((l) => l.offerId === offer.id);
            const next = existing
                ? base.map((l) => (l.offerId === offer.id ? { ...l, quantity: l.quantity + 1 } : l))
                : [
                      ...base,
                      {
                          offerId: offer.id,
                          title: offer.title,
                          type: offer.type,
                          image: offer.image.url,
                          price: { amount: offer.price.amount, currency: offer.price.currency },
                          provider: { id: offer.provider.id, name: offer.provider.name },
                          quantity: 1,
                      },
                  ];
            persist(next);
            return { replaced };
        },
        [lines, persist],
    );

    const value = useMemo<CartState>(() => {
        const count = lines.reduce((n, l) => n + l.quantity, 0);
        const total = lines.length
            ? { amount: lines.reduce((sum, l) => sum + l.price.amount * l.quantity, 0), currency: lines[0].price.currency }
            : null;
        return {
            lines,
            count,
            total,
            add,
            remove: (offerId) => persist(lines.filter((l) => l.offerId !== offerId)),
            clear: () => persist([]),
        };
    }, [lines, add, persist]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
    return ctx;
}
