'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const Navigation = () => {
    return (
        <nav className="sticky top-0 z-10 flex items-center justify-between flex-wrap bg-gray-800 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">MtokaaHero</span>
            </div>

            <div className="hidden lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <Link href="/" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                        Home
                    </Link>
                    <Link
                        href="/services"
                        className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                        Services
                    </Link>
                    <Link
                        href="/mechanics"
                        className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                        Mechanics
                    </Link>
                    <Link
                        href="/products"
                        className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                        Products
                    </Link>
                    <Link href="/contact" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400">
                        Contact
                    </Link>
                </div>
            </div>
            <div className="flex items-center">
                <div className="mr-4"></div>
            </div>

            <div className="block lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <div className="mt-6 flex flex-col space-y-2">
                            <Link href="/" className="text-gray-800 hover:text-gray-600">
                                Home
                            </Link>
                            <Link href="/services" className="text-gray-800 hover:text-gray-600">
                                Services
                            </Link>
                            <Link href="/mechanics" className="text-gray-800 hover:text-gray-600">
                                Mechanics
                            </Link>
                            <Link href="/products" className="text-gray-800 hover:text-gray-600">
                                Products
                            </Link>
                            <Link href="/contacts" className="text-gray-800 hover:text-gray-600">
                                Contact
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
};

export default Navigation;
