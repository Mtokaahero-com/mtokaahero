'use client';

import Footer from '@/components/fragments/Footer';
import CustomerView from '@/components/fragments/CustomerView';
import { lazy, Suspense } from 'react';

const HeroSection = lazy(() => import('@/components/fragments/HeroComponent'));
const customerView = lazy(() => import('@/components/fragments/CustomerView'));
const PricingSection = lazy(() => import('@/components/fragments/Pricing'));

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HelpCircle, Home, LogOut, Menu, Settings } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="w-full h-screen max-w-screen">
            <div className="absolute top-4 right-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-4 mt-4">
                            <Link href="/" className="flex items-center space-x-2 text-sm">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </Link>
                            <Link href="/settings" className="flex items-center space-x-2 text-sm">
                                <Settings className="h-5 w-5" />
                                <span>Settings</span>
                            </Link>
                            <Link href="/help" className="flex items-center space-x-2 text-sm">
                                <HelpCircle className="h-5 w-5" />
                                <span>Help</span>
                            </Link>
                            <Button variant="ghost" className="justify-start px-2">
                                <LogOut className="h-5 w-5 mr-2" />
                                <span>Login</span>
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
            {/* <Navbar /> */}
            <Suspense fallback={<div>Loading...</div>}>
                <HeroSection />
                {/* <OurServices /> */}
                <CustomerView />
                <PricingSection />
            </Suspense>
            <Footer />
        </main>
    );
}
