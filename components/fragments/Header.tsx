/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';

export default function Component() {
    return (
        <section className="relative w-full bg-[url('/hero-image.jpg')] bg-cover bg-center py-20 md:py-32 lg:py-40">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative container px-4 md:px-6">
                <div className="max-w-3xl space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                        Your One-Stop Online Garage Shop
                    </h1>
                    <p className="text-lg text-gray-300 md:text-xl">
                        Find the perfect spare parts, import your dream vehicle, or schedule a service with our expert
                        mechanics. We've got you covered for all your automotive needs.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                            href="#"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}>
                            Browse Shop
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}>
                            Schedule Service
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
