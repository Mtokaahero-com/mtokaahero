'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthFlowShell, FlowCard } from '@/components/auth/AuthShell';
import { authErrorMessage } from '@/components/auth/authErrors';
import { FormError } from '@/components/auth/FormError';
import { Icon } from '@/components/brand/Icon';
import { authApi } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';
import { cn } from '@/lib/utils';

const schema = z.object({ email: z.string().trim().email('Enter a valid email') });
type Values = z.infer<typeof schema>;
const COOLDOWN_S = 60;

export default function ForgotPasswordPage() {
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    const send = async (email: string) => {
        setError(null);
        try {
            await authApi.requestPasswordReset(email);
            setSentTo(email);
            setCooldown(COOLDOWN_S);
        } catch (err) {
            setError(authErrorMessage(err instanceof ApiError ? err.code : 'HTTP_ERROR'));
        }
    };

    const emailError = formState.errors.email?.message;

    return (
        <AuthFlowShell>
            <FlowCard title="Reset your password" intro="Enter the email you signed up with and we'll send you a link to set a new password.">
                <form onSubmit={handleSubmit((v) => send(v.email))} className="space-y-4" noValidate>
                    <FormError message={error} />
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 font-heading" htmlFor="email">
                            Email address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <Icon name="mail" className="text-[20px]" />
                            </span>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="jane@example.com"
                                aria-invalid={Boolean(emailError)}
                                aria-describedby={emailError ? 'email-error' : 'email-hint'}
                                className={cn(
                                    'w-full pl-10 pr-4 py-3 text-sm font-medium text-slate-900 bg-white border rounded-[12px] focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 shadow-sm',
                                    emailError ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-300 focus:ring-blue-600/20 focus:border-blue-600',
                                )}
                                {...register('email')}
                            />
                        </div>
                        {emailError ? (
                            <p id="email-error" className="text-xs text-red-600 mt-1.5">
                                {emailError}
                            </p>
                        ) : (
                            <p id="email-hint" className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                                <Icon name="schedule" className="text-[14px] text-slate-400" />
                                Single-use reset link expires in 30 minutes.
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={formState.isSubmitting}
                        className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-heading font-semibold text-sm rounded-[12px] shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        <span>{formState.isSubmitting ? 'Sending…' : 'Send reset link'}</span>
                        <Icon name="send" className="text-[18px] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <div className="text-center pt-1">
                        <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors py-1">
                            <Icon name="arrow_back" className="text-[17px]" />
                            <span>Back to sign in</span>
                        </Link>
                    </div>
                </form>
            </FlowCard>

            {sentTo && (
                <div className="rounded-2xl p-5 shadow-sm border border-emerald-200/90 relative overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white" role="status">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-100">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-xs font-medium bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-pill bg-emerald-600 animate-pulse" />
                            Link sent
                        </span>
                        <span className="text-[11px] font-mono text-emerald-700 font-semibold tracking-wide uppercase">Delivered</span>
                    </div>
                    <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                            <Icon name="check_circle" className="text-[26px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-heading text-lg font-bold text-slate-900 tracking-tight leading-tight">Check your email</h2>
                            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                                If an account exists for{' '}
                                <span className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">{sentTo}</span>, a reset link
                                is on its way. It expires in 30 minutes.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        <button
                            type="button"
                            disabled={cooldown > 0}
                            onClick={() => send(sentTo)}
                            className={cn(
                                'w-full min-h-[44px] py-2.5 px-4 font-heading font-semibold text-xs rounded-[12px] border flex items-center justify-center gap-2 select-none transition-colors',
                                cooldown > 0
                                    ? 'bg-slate-100 text-slate-400 border-slate-200/80 cursor-not-allowed'
                                    : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50',
                            )}
                        >
                            <Icon name={cooldown > 0 ? 'progress_activity' : 'refresh'} className={cn('text-[16px]', cooldown > 0 && 'animate-spin')} />
                            <span>{cooldown > 0 ? `Resend in 0:${String(cooldown).padStart(2, '0')}` : 'Resend link'}</span>
                        </button>
                        <p className="text-center text-[11px] text-slate-500">Didn&apos;t receive the email? Check your spam or junk folder.</p>
                    </div>
                </div>
            )}
        </AuthFlowShell>
    );
}
