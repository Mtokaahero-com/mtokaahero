import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden ">
            {/* Background video */}
            <video
                autoPlay={true}
                loop={true}
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover">
                <source
                    src="https://res.cloudinary.com/dazptrvgj/video/upload/v1722592933/7565182-uhd_4096_2160_25fps_zsffdo.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>

            {/* Overlay to darken the video */}
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6 md:space-y-8">
                    <Button
                        variant="outline"
                        className="font-bold text-2xl text-white border-white/40 rounded-full px-6 py-2 bg-transparent hover:bg-white/10 transition-colors duration-300">
                        <span className="mr-2 ">Drive Your Dreams Forward</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <h1 className="text-4xl md:text-4xl font-bold text-white max-w-2xl">
                        Welcome to MtokaaHero
                        <span className="block text-brand_blue">Your Ultimate Garage Solution</span>
                    </h1>

                    <p className="text-xl text-white/80 max-w-xl">
                        Register your garage or find the best mechanics in your area. MtokaaHero is the ultimate
                        platform
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link href="/auth/mtokaahero ">
                            <Button
                                variant="outline"
                                className="w-40 text-black border-white/40 hover:bg-white hover:text-black transition-colors duration-300">
                                Start Your Free Trial
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button className="w-40 bg-brand_blue hover:bg-brand_pink transition-colors duration-300">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="mt-12"></motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection;
