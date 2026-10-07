export interface Money {
    amount: number;
    currency: string;
}

/** "KES 4,500" — whole shillings, no decimals, tabular digits come from the body font settings. */
export function formatMoney(money: Money | null | undefined, opts: { decimals?: boolean } = {}): string {
    if (!money) return '';
    const digits = opts.decimals ? 2 : 0;
    const value = money.amount.toLocaleString('en-KE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
    return `${money.currency} ${value}`;
}

/** "KES 3.23M" / "KES 845K" for KPI tiles where the full figure would not fit. */
export function formatMoneyCompact(money: Money): string {
    const a = Math.abs(money.amount);
    if (a >= 1_000_000) return `${money.currency} ${(money.amount / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
    if (a >= 10_000) return `${money.currency} ${Math.round(money.amount / 1000)}K`;
    return formatMoney(money);
}

export function formatRating(rating: number): string {
    return rating.toFixed(rating >= 10 ? 0 : 1);
}

export function formatCount(n: number): string {
    return n.toLocaleString('en-KE');
}
