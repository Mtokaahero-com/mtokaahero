'use client';

import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Loading from '@/components/ui/loading';

export default function Component() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <main>
            {loading ? (
                <Loading />
            ) : (
                <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-md space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                                Sign in to your account
                            </h2>
                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                Or{' '}
                                <Link
                                    href="/auth/customers/signup"
                                    className="font-medium text-primary hover:text-primary/90"
                                    prefetch={true}
                                >
                                    sign up for a new account
                                </Link>
                            </p>
                        </div>
                        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                                    Email address
                                </Label>
                                <div className="mt-1">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                        }}
                                        required
                                        className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                    <span className="text-sm text-red-600"> {error || ''}</span>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                                    Password
                                </Label>
                                <div className="mt-1">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                        }}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-0"
                                    />
                                    <span className="text-sm text-red-600"> {error || ''}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="remember-me"
                                        name="remember-me"
                                        className="h-4 w-4 rounded text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                                        Remember me
                                    </Label>
                                </div>
                                <div className="text-sm">
                                    <Link
                                        href="#"
                                        className="font-medium text-primary hover:text-primary/90"
                                        prefetch={false}
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                >
                                    Sign in
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
