'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { useState } from 'react';
import { HomeIcon } from 'lucide-react';
import Image from 'next/image';

const sidebarMenuItems = [
    {
        name: 'Home',
        href: '/',
        icon: HomeIcon,
    },
    {
        name: 'Help',
        href: '/contact',
    },
    {
        name: 'Customer Page',
        href: '/customers',
    },
    {
        name: 'Garage Page',
        href: '/garages',
    },
    {
        name: 'Mechanic Page',
        href: '/mechanics',
    },
    {
        name: 'Become a Vendor',
        href: '/auth/newaccounts/vendor/signup',
    }
];

export default function Component() {
    const [freeTrialGarage, setFreeTrialGarage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const FloatingMenu = () => {
        return (
            <div
                className={`
                    isolate aspect-video w-96 rounded-xl bg-white/10 shadow-lg ring-1 ring-black/5
                    fixed inset-y-0 left-20 h-[250px] mt-[90px]  z-50  p-6  transform transition-transform duration-300 ease-in-out ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                {/* <button onClick={() => setSidebarOpen(false)} className="mb-6 text-gray-700">
                    <X className="h-6 w-6" />
                {/* Sidebar Menu */}
                <ul className="space-y-4">
                    {sidebarMenuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="flex items-center space-x-2 text-gray-800 hover:text-white">
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <div className="w-full min-h-screen bg-gradient-to-br from-primary to-primary-foreground relative">
                <FloatingMenu />

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32 xl:py-40 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
                                Set up Your Garage Account
                            </h1>
                            <p className="text-lg md:text-xl text-primary-foreground/80">
                                Join our network of trusted automotive repair services and connect with customers in
                                your area.
                            </p>
                        </div>
                        <Card className="bg-background p-6 md:p-8 lg:p-10 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Set Up Your Garage Account</CardTitle>
                                <Link href="/auth/garage/signin" prefetch={false} className="text-center block mt-2">
                                    <span className="text-red-600 hover:text-primary/90">Sign in to your account</span>
                                </Link>
                                <CardDescription>Fill out the form below to get started.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="garage-name">Garage Name</Label>
                                            <Input id="garage-name" placeholder="MtokaaHero Auto Repair" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="owner-name">Owner Full Names</Label>
                                            <Input id="owner-name" placeholder="John Doe" required />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" placeholder="123 Main St, Anytown Kenya" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" type="tel" placeholder="(555) 555-5555" required />
                                        </div>
                                    </div>
                                </form>
                                <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-6 rounded-lg shadow-lg text-white space-y-4 mt-6">
                                    <h2 className="text-2xl font-bold">Start Your Free Trial Today!</h2>
                                    <p>Experience all features for 7 days, no credit card required.</p>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="free-trial"
                                            checked={freeTrialGarage}
                                            onCheckedChange={setFreeTrialGarage}
                                        />
                                        <Label htmlFor="free-trial">Enable Free Trial</Label>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <button
                                    type="submit"
                                    className={`mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={loading}>
                                    {freeTrialGarage ? 'Start Free Trial' : 'Register Garage'}
                                </button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
