'use client';

import { lazy, Suspense } from 'react';
import Footer from '@/components/fragments/Footer';
import Navbar from '@/components/fragments/Navbar';
import Pricing from '@/components/fragments/Pricing';


// Lazy load components
const HeroSection = lazy(() => import('@/components/fragments/HeroComponent'));
const OurServices = lazy(() => import('@/components/fragments/Services'));
const WhyChooseUs = lazy(() => import('@/components/fragments/WhyChooseUs'));
const GuideSection = lazy(() => import('@/components/fragments/GuideSection'));
const PricingSection = lazy(() => import('@/components/fragments/Pricing'));

export default function Home() {
    return (
        <main className="w-full h-screen max-w-screen">
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <HeroSection />
                <OurServices />
                <PricingSection />
            </Suspense>
            <Footer />
        </main>
    );
}
