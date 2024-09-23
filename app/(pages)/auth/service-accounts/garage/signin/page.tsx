'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WrenchIcon } from '@/components/ui/icons';

export default function Component() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-primary to-primary-foreground">
            <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32 xl:py-40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-4 md:space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
                            Welcome Back to MtokaaHero
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/80">
                            Sign in to your MtokaaHero Auto Repair account and continue managing your garage
                            effortlessly.
                        </p>
                    </div>
                    <Card className="bg-background p-6 md:p-8 lg:p-10 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <WrenchIcon className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Sign in to Your Account</CardTitle>
                            <CardDescription className="text-center">
                                Enter your username and password to access the MtokaaHero Auto Repair platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" placeholder="Enter your username" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" placeholder="Enter your password" required />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Link
                                        href="#"
                                        className="text-sm font-medium text-primary-foreground hover:underline"
                                        prefetch={false}>
                                        Forgot password?
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                Find My Store
                            </Button>
                        </CardFooter>
                        <div className="mt-4 text-center">
                            <span className="text-sm">Don't have an account? </span>
                            <Link href="/auth/garage/signup" prefetch={false} className="text-primary hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
