'use client';

import Footer from '@/components/fragments/Footer';
import HeroSection from '@/components/fragments/HeroComponent';
import Navbar from '@/components/fragments/Navbar';
import WhyChooseUs from '@/components/fragments/WhyChooseUs';
import GuideSection from '@/components/fragments/GuideSection';
import OurServices from '@/components/fragments/Services';
// import StatsSection from '@/components/fragments/StatsComponent';

export default function Home() {
    return (
        <main className="w-full  h-screen max-w-screen">
            <Navbar />
            <HeroSection />
            {/* <StatsSection /> */}
            <OurServices />
            <WhyChooseUs />
            <GuideSection />
            <Footer />
        </main>
    );
}
