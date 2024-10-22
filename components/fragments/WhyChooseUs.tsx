import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/icons';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const useVisibleOnScroll = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );

        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    }, []);
    return { ref, isVisible };
};

function WhyChooseUs() {
    const { ref, isVisible } = useVisibleOnScroll();
    return (
        <div ref={ref} className={`fade-in ${isVisible ? 'visible' : ''}`}>
        <div className="flex flex-col  w-full  items-center justify-center">
            <main className="flex-1 grid md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center bg-slate-300">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Register Or Start A free Trial</h2>
                    <p className="text-muted-foreground">
                        Streamline your automotive services with our powerful tools and features:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={'/auth/service-accounts/'}>
                            <Button variant="outline">Sign In</Button>
                        </Link>
                        <Button>Create Account</Button>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>
                            <CheckIcon className="h-4 w-4 mr-2 inline-block" />
                            Manage customer appointments and service history
                        </li>
                        <li>
                            <CheckIcon className="h-4 w-4 mr-2 inline-block" />
                            Track inventory and order parts seamlessly
                        </li>
                        <li>
                            <CheckIcon className="h-4 w-4 mr-2 inline-block" />
                            Generate detailed invoices and reports
                        </li>
                    </ul>
                </section>
            </main>
            </div>
        </div>
    );
}

export default WhyChooseUs;
