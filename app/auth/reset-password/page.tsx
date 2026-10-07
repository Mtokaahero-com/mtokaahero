'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { AuthFlowShell, FlowCard } from '@/components/auth/AuthShell';
import { authErrorMessage, passwordStrength } from '@/components/auth/authErrors';
import { FormError } from '@/components/auth/FormError';
import { PasswordField } from '@/components/auth/PasswordField';
import { Icon } from '@/components/brand/Icon';
import { authApi } from '@/lib/api/account';
import { ApiError } from '@/lib/api/problem';
import { cn } from '@/lib/utils';

const schema = z
    .object({
        password: z.string().min(10, 'Use at least 10 characters').max(128),
        confirm: z.string(),
    })
    .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });
type Values = z.infer<typeof schema>;

const STRENGTH = ['', 'Too short (1/4)', 'Fair (2/4)', 'Strong (3/4)', 'Excellent (4/4)'];
const CRITERIA: [string, (pw: string) => boolean][] = [
    ['Minimum 10 characters', (pw) => pw.length >= 10],
    ['Uppercase & lowercase letters', (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw)],
    ['At least one number (0-9)', (pw) => /\d/.test(pw)],
    ['At least one special symbol (!@#$%)', (pw) => /[^A-Za-z0-9]/.test(pw)],
];

function ExpiredCard() {
    return (
        <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200/90 shadow-sm relative overflow-hidden" role="alert">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                    <Icon name="warning" className="text-[24px]" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="font-heading text-sm font-bold text-amber-950 tracking-tight">This link has expired</h2>
                        <span className="text-[10px] font-mono uppercase bg-amber-200/80 text-amber-800 font-semibold px-1.5 py-0.5 rounded">Timed out</span>
                    </div>
                    <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                        Reset links work for 30 minutes and only once. Request a fresh link to securely finish resetting your account password.
                    </p>
                    <Link
                        href="/auth/forgot-password"
                        className="mt-3 inline-flex items-center justify-center gap-1.5 py-2 px-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-heading font-semibold text-xs rounded-lg shadow-sm hover:shadow active:scale-[0.98] transition-all"
                    >
                        <Icon name="forward_to_inbox" className="text-[16px]" />
                        <span>Send a new link</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ResetForm() {
    const router = useRouter();
    const token = useSearchParams().get('token');
    const [expired, setExpired] = useState(!token);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, control, formState } = useForm<Values>({ resolver: zodResolver(schema) });
    const password = useWatch({ control, name: 'password' }) ?? '';
    const confirm = useWatch({ control, name: 'confirm' }) ?? '';
    const strength = passwordStrength(password);
    const matches = confirm.length > 0 && confirm === password;

    if (expired) return <ExpiredCard />;

    const onSubmit = async (values: Values) => {
        setError(null);
        try {
            await authApi.confirmPasswordReset(token!, values.password);
            router.replace('/auth/signin?reset=1');
        } catch (err) {
            if (err instanceof ApiError && err.code === 'TOKEN_INVALID') setExpired(true);
            else setError(authErrorMessage(err instanceof ApiError ? err.code : 'HTTP_ERROR'));
        }
    };

    return (
        <FlowCard
            title="Choose a new password"
            intro="Create a strong, unique password to secure your MtokaaHero account, garage booking access, and rescue credentials."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormError message={error} />
                <div>
                    <PasswordField
                        id="password"
                        label="New password"
                        variant="outlined"
                        autoComplete="new-password"
                        placeholder="At least 10 characters"
                        error={formState.errors.password?.message}
                        {...register('password')}
                    />
                    <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                            <span className="text-slate-500">Password strength:</span>
                            <span className={cn('font-semibold font-heading', strength >= 3 ? 'text-[#1d4ed8]' : strength === 2 ? 'text-amber-600' : 'text-slate-500')}>
                                {STRENGTH[strength] || '—'}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1.5" aria-hidden>
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={cn('h-full rounded-pill', i <= strength ? (strength < 2 ? 'bg-red-500' : strength < 3 ? 'bg-amber-500' : 'bg-[#1d4ed8]') : 'bg-slate-200')}
                                />
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                            <Icon name="info" className="text-[14px] text-blue-600" />
                            At least 10 characters recommended.
                        </p>
                    </div>
                    <ul className="mt-3 p-3 bg-slate-50 rounded-[12px] border border-slate-200/80 space-y-1.5">
                        {CRITERIA.map(([label, test]) => {
                            const ok = test(password);
                            return (
                                <li key={label} className={cn('flex items-center gap-2 text-[11px]', ok ? 'text-emerald-700' : 'text-slate-500')}>
                                    <Icon name={ok ? 'check_circle' : 'radio_button_unchecked'} fill={ok} className={cn('text-[16px]', ok ? 'text-emerald-600' : 'text-slate-400')} />
                                    <span>{label}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div>
                    <PasswordField
                        id="confirm"
                        label="Confirm password"
                        variant="outlined"
                        tone={matches ? 'success' : 'default'}
                        autoComplete="new-password"
                        placeholder="Repeat your new password"
                        error={formState.errors.confirm?.message}
                        status={matches ? <Icon name="check_circle" fill className="text-[18px] text-emerald-600" /> : null}
                        {...register('confirm')}
                    />
                    {matches && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                            <Icon name="done_all" className="text-[14px]" />
                            Passwords match perfectly
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="w-full py-3.5 px-4 bg-[#1d4ed8] hover:bg-blue-800 active:bg-blue-900 text-white font-heading font-semibold text-sm rounded-[12px] shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                    <span>{formState.isSubmitting ? 'Updating…' : 'Update password'}</span>
                    <Icon name="check" className="text-[18px] group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-center text-[11px] text-slate-500">You will be signed out on all devices.</p>
                <div className="text-center">
                    <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#1d4ed8] transition-colors py-1">
                        <Icon name="arrow_back" className="text-[16px]" />
                        <span>Back to sign in</span>
                    </Link>
                </div>
            </form>
        </FlowCard>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthFlowShell>
            <Suspense>
                <ResetForm />
            </Suspense>
        </AuthFlowShell>
    );
}
