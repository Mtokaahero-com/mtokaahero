'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Wrench, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserRole } from '@/next-auth';

const ROLE_ROUTES: Record<string, string> = {
    GARAGE: '/dashboard/garage',
    MECHANIC: '/dashboard/mechanics',
    SHOP: '/dashboard/vendors',
};

const REGISTER_LINKS = [
    { label: 'Register a Garage', href: '/auth/garage', color: 'text-blue-400' },
    { label: 'Register as a Mechanic', href: '/auth/mechanic', color: 'text-orange-400' },
    { label: 'Register a Shop', href: '/auth/shop', color: 'text-purple-400' },
];

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter your email and password.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid email or password. Please try again.');
                return;
            }

            // Fetch session to get role for redirect
            const { getSession } = await import('next-auth/react');
            const session = await getSession();
            const role = session?.user?.role as UserRole | undefined;
            const redirect = role && ROLE_ROUTES[role] ? ROLE_ROUTES[role] : '/dashboard';

            toast.success(`Welcome back, ${session?.user?.firstName ?? 'User'}!`);
            router.push(redirect);
            router.refresh();
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                {/* Left — Branding */}
                <div className="hidden lg:flex lg:col-span-2 flex-col justify-center space-y-8 py-8 px-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-3 rounded-xl">
                            <Wrench className="h-8 w-8 text-slate-900" />
                        </div>
                        <span className="text-2xl font-bold">MtokaaHero</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold leading-tight mb-3">
                            Kenya's automotive<br />
                            <span className="text-yellow-400">service platform.</span>
                        </h1>
                        <p className="text-slate-400">
                            One login for garages, mechanics, and spare parts shops.
                        </p>
                    </div>

                    {/* Register links */}
                    <div className="space-y-2">
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">New here?</p>
                        {REGISTER_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 text-sm ${link.color} hover:opacity-80 transition-opacity`}
                            >
                                <ChevronRight className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right — Form */}
                <Card className="lg:col-span-3 border-0 shadow-2xl bg-white/5 backdrop-blur-sm text-white">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-slate-300 text-sm">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500 h-11"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500 h-11"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold h-11 text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        {/* Mobile register links */}
                        <div className="mt-6 lg:hidden space-y-2 border-t border-white/10 pt-4">
                            <p className="text-slate-400 text-sm text-center">Don't have an account?</p>
                            <div className="flex flex-col gap-1">
                                {REGISTER_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center justify-center gap-2 text-sm ${link.color} hover:opacity-80 py-1`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
