'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/brand/Icon';
import { MobileHeader } from '@/components/site/MobileHeader';
import { MobileTabBar } from '@/components/site/MobileTabBar';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { ApiError } from '@/lib/api/problem';
import { supportApi, type SupportMessageInput } from '@/lib/api/support';
import { cn } from '@/lib/utils';

const FAQ = [
    ['I am broken down right now. What do I do?', 'Tap “Request Rescue Hero” or the SOS button. No account is needed: share your location, vehicle and phone number and the nearest verified mechanic is dispatched. You get a live tracking link by SMS.'],
    ['How do payments and the release code work?', 'Your quote is agreed before dispatch. When the job is done and your engine starts, give the mechanic the 4-digit release code shown on your tracking page to close the job.'],
    ['How do I list my garage or mobile rescue unit?', 'Open the Partner Garage Portal, fill in your business profile, capabilities and service radius, and submit your permits. You can manage your catalogue from the shop dashboard right away.'],
    ['Which areas do you cover?', 'Nairobi Metro today, with rescue radii set by each partner garage (5–60 km). Coverage grows as partners join along major highways.'],
    ['How are ratings verified?', 'Only motorists with a completed order can review, and providers can reply publicly.'],
];

const TOPICS: { value: SupportMessageInput['topic']; label: string }[] = [
    { value: 'RESCUE', label: 'An active rescue' },
    { value: 'ORDER', label: 'Parts or a booking' },
    { value: 'PARTNER', label: 'Partner garage onboarding' },
    { value: 'ACCOUNT', label: 'My account' },
    { value: 'OTHER', label: 'Something else' },
];

const field =
    'w-full bg-surface-container-low px-space-md py-2.5 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container';

export default function ContactPage() {
    const [values, setValues] = useState<SupportMessageInput>({ name: '', email: '', topic: 'RESCUE', message: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [state, setState] = useState<{ kind: 'idle' | 'sending' } | { kind: 'sent'; ticket: string }>({ kind: 'idle' });
    const set = (k: keyof SupportMessageInput, v: string) => {
        setValues((s) => ({ ...s, [k]: v }));
        setErrors((e) => ({ ...e, [k]: '', form: '' }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setState({ kind: 'sending' });
        try {
            const res = await supportApi.send(values);
            setState({ kind: 'sent', ticket: res.ticket });
        } catch (err) {
            setState({ kind: 'idle' });
            if (err instanceof ApiError && err.fieldErrors.length) setErrors(Object.fromEntries(err.fieldErrors.map((f) => [f.field, f.message])));
            else setErrors({ form: 'We could not send your message. Email support@mtokaahero.com instead.' });
        }
    };

    const err = (k: string) => (errors[k] ? <p className="font-body-sm text-body-sm text-error">{errors[k]}</p> : null);

    return (
        <>
            <SiteHeader className="hidden md:block" />
            <MobileHeader className="md:hidden" />
            <main className="w-full bg-surface min-h-screen pt-16 pb-24 md:pt-20 md:pb-0">
                <section className="w-full bg-surface-container-low px-gutter md:px-gutter-lg py-space-xl relative overflow-hidden">
                    <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none" />
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed mb-space-xs shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-code-xs text-code-xs tracking-wider uppercase font-semibold">24/7 Support Desk</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight max-sm:text-headline-lg-mobile">Talk to the MtokaaHero team</h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1 max-w-2xl">
                            Questions about a rescue, an order or joining as a partner garage — we usually reply within the hour.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-gutter md:px-gutter-lg py-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                    <div className="lg:col-span-7 flex flex-col gap-space-lg">
                        <Link
                            href="/rescue"
                            className="flex items-center justify-between gap-space-md p-space-md rounded-xl bg-tertiary text-on-tertiary shadow-md active:scale-[0.99] transition-transform"
                        >
                            <span className="flex items-center gap-space-sm">
                                <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <Icon name="emergency" fill className="text-[22px]" />
                                </span>
                                <span>
                                    <span className="block font-title-md text-title-md font-bold">Stranded right now?</span>
                                    <span className="block font-body-sm text-body-sm text-on-tertiary-container">Skip the form — dispatch a rescue mechanic in one tap.</span>
                                </span>
                            </span>
                            <Icon name="arrow_forward" className="text-[22px]" />
                        </Link>

                        <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                            <div className="flex items-center gap-space-xs">
                                <Icon name="forum" className="text-primary text-[22px]" />
                                <h2 className="font-title-lg text-title-lg text-on-surface">Send us a message</h2>
                            </div>
                            {state.kind === 'sent' ? (
                                <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-success-subtle" role="status">
                                    <Icon name="check_circle" fill className="text-success text-[24px]" />
                                    <div>
                                        <p className="font-title-md text-title-md text-on-surface">Message received</p>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                                            Your ticket is <span className="font-code-sm text-code-sm text-primary">{state.ticket}</span>. We&apos;ll reply to {values.email}.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} noValidate className="flex flex-col gap-space-md">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                                        <div className="flex flex-col gap-space-xs">
                                            <label htmlFor="ct-name" className="font-label-md text-label-md text-on-surface font-medium">
                                                Name
                                            </label>
                                            <input id="ct-name" autoComplete="name" className={field} value={values.name} onChange={(e) => set('name', e.target.value)} />
                                            {err('name')}
                                        </div>
                                        <div className="flex flex-col gap-space-xs">
                                            <label htmlFor="ct-email" className="font-label-md text-label-md text-on-surface font-medium">
                                                Email
                                            </label>
                                            <input id="ct-email" type="email" autoComplete="email" className={field} value={values.email} onChange={(e) => set('email', e.target.value)} />
                                            {err('email')}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-space-xs">
                                        <span className="font-label-md text-label-md text-on-surface font-medium">This is about</span>
                                        <div className="flex flex-wrap gap-2" role="radiogroup">
                                            {TOPICS.map((t) => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={values.topic === t.value}
                                                    onClick={() => set('topic', t.value)}
                                                    className={cn(
                                                        'px-space-md py-2 rounded-full font-label-md text-label-md transition-all',
                                                        values.topic === t.value ? 'bg-primary text-on-primary font-bold shadow-sm' : 'bg-surface-container-low text-on-surface hover:bg-surface-container',
                                                    )}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-space-xs">
                                        <label htmlFor="ct-msg" className="font-label-md text-label-md text-on-surface font-medium">
                                            Message
                                        </label>
                                        <textarea id="ct-msg" rows={5} className={field} value={values.message} onChange={(e) => set('message', e.target.value)} />
                                        {err('message')}
                                    </div>
                                    {err('form')}
                                    <button
                                        type="submit"
                                        disabled={state.kind === 'sending'}
                                        className="self-start px-space-lg py-3 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-label-lg text-label-lg font-bold shadow-md flex items-center gap-2 disabled:opacity-70"
                                    >
                                        <Icon name="send" className="text-[18px]" />
                                        {state.kind === 'sending' ? 'Sending…' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </section>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-space-lg">
                        <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                            <h2 className="font-title-lg text-title-lg text-on-surface">Reach us directly</h2>
                            {[
                                ['phone_in_talk', 'Rescue hotline (toll free)', '0800 720 000', 'tel:0800720000', 'text-tertiary'],
                                ['mail', 'Support email', 'support@mtokaahero.com', 'mailto:support@mtokaahero.com', 'text-primary'],
                                ['location_on', 'Head office', 'Westlands, Nairobi, Kenya', undefined, 'text-secondary'],
                            ].map(([icon, label, value, href, tone]) => (
                                <div key={label} className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low">
                                    <Icon name={icon!} className={cn('text-[22px]', tone)} />
                                    <div>
                                        <span className="block font-code-xs text-code-xs text-on-surface-variant uppercase">{label}</span>
                                        {href ? (
                                            <a href={href} className="font-label-lg text-label-lg text-on-surface hover:text-primary">
                                                {value}
                                            </a>
                                        ) : (
                                            <span className="font-label-lg text-label-lg text-on-surface">{value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </section>
                        <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-sm">
                            <h2 className="font-title-lg text-title-lg text-on-surface mb-space-xs">Frequently asked</h2>
                            {FAQ.map(([q, a]) => (
                                <details key={q} className="group rounded-xl bg-surface-container-low px-space-md py-space-sm">
                                    <summary className="flex items-center justify-between gap-2 cursor-pointer list-none font-label-lg text-label-lg text-on-surface">
                                        {q}
                                        <Icon name="expand_more" className="text-on-surface-variant transition-transform group-open:rotate-180" />
                                    </summary>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">{a}</p>
                                </details>
                            ))}
                        </section>
                    </div>
                </div>
            </main>
            <SiteFooter className="hidden md:block" showTrust={false} />
            <MobileTabBar className="md:hidden" />
        </>
    );
}
