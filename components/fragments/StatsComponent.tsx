
import React from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';


function StatsSection() {
    return (
        <section
            className="relative items-center justify-center w-screen md:h-[70vh] flex md:flex-row flex-col bg-cover bg-center pt-9"
            style={{ backgroundImage: "url('/stats3.jpg')" }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative z-10 w-full md:w-[55%] h-full flex flex-col p-10 items-start justify-center space-y-4">
                <h1 className="text-white font-bold text-base md:text-lg">Drive Excellence</h1>
                <h1 className="text-white font-bold text-2xl md:text-4xl w-80 md:w-[50%]">
                    Revolutionizing the Way You Experience Automotive Services
                </h1>
                <p className="text-white font-light text-sm md:text-base">
                    Revolutionizing the Way You Experience Automotive Services
                </p>
                <Link href="/services">
                    <Button
                        variant={'secondary'}
                        className="hover:border-brand_blue rounded-xl w-36 border border-white p-2 hover:bg-_brand_pink hover:bg-brand_blue transition-all duration-300 ease-linear hover:text-white"
                    >
                        Discover More
                    </Button>
                </Link>
            </div>
        </section>
    );
}



export default StatsSection;