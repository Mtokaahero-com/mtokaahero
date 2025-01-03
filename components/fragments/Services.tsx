import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings,
    PenTool as Tool,
    BarChart,
    Calendar,
    Users,
    ClipboardList,
    Cog,
    Truck,
    DollarSign,
} from 'lucide-react';
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

export default function ServicesShowcase() {
    const { ref, isVisible } = useVisibleOnScroll();

    return (
        <div ref={ref} className={`fade-in ${isVisible ? 'visible' : ''}`}>
            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="garage" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="garage">Garage Managers</TabsTrigger>
                        <TabsTrigger value="mechanic">Mechanics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="garage">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <ServiceCard
                                icon={<Settings className="h-6 w-6" />}
                                title="Garage Management"
                                description="Streamline your garage operations with our comprehensive management tools."
                                features={['Inventory tracking', 'Work order management', 'Customer database']}
                            />
                            <ServiceCard
                                icon={<BarChart className="h-6 w-6" />}
                                title="Financial Analytics"
                                description="Gain insights into your garage's financial performance with detailed analytics."
                                features={['Revenue tracking', 'Expense management', 'Profit analysis']}
                            />
                            <ServiceCard
                                icon={<Calendar className="h-6 w-6" />}
                                title="Appointment Scheduling"
                                description="Efficiently manage appointments and optimize your garage's schedule."
                                features={['Online booking', 'SMS reminders', 'Staff allocation']}
                            />
                            <ServiceCard
                                icon={<Users className="h-6 w-6" />}
                                title="Staff Management"
                                description="Effectively manage your team with our staff management features."
                                features={['Time tracking', 'Performance metrics', 'Payroll integration']}
                            />
                            <ServiceCard
                                icon={<Truck className="h-6 w-6" />}
                                title="Parts Ordering"
                                description="Streamline your parts ordering process with our integrated system."
                                features={['Supplier management', 'Automated reordering', 'Price comparison']}
                            />
                            <ServiceCard
                                icon={<DollarSign className="h-6 w-6" />}
                                title="Invoicing & Payments"
                                description="Simplify your billing process with our invoicing and payment tools."
                                features={['Custom invoices', 'Online payments', 'Payment tracking']}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="mechanic">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <ServiceCard
                                icon={<Tool className="h-6 w-6" />}
                                title="Job Management"
                                description="Efficiently manage your workload and track job progress."
                                features={['Task assignment', 'Time tracking', 'Job status updates']}
                            />
                            <ServiceCard
                                icon={<ClipboardList className="h-6 w-6" />}
                                title="Digital Checklists"
                                description="Use digital checklists to ensure thorough and consistent work."
                                features={['Customizable templates', 'Photo documentation', 'Client approval']}
                            />
                            <ServiceCard
                                icon={<Cog className="h-6 w-6" />}
                                title="Repair Guides"
                                description="Access a comprehensive database of repair guides and manuals."
                                features={['Vehicle-specific guides', 'Video tutorials', 'Troubleshooting tips']}
                            />
                            <ServiceCard
                                icon={<BarChart className="h-6 w-6" />}
                                title="Performance Metrics"
                                description="Track your performance and identify areas for improvement."
                                features={['Job completion rates', 'Customer satisfaction', 'Efficiency analytics']}
                            />
                            <ServiceCard
                                icon={<Calendar className="h-6 w-6" />}
                                title="Schedule Management"
                                description="Manage your work schedule and appointments efficiently."
                                features={['Shift planning', 'Leave management', 'Overtime tracking']}
                            />
                            <ServiceCard
                                icon={<Users className="h-6 w-6" />}
                                title="Collaboration Tools"
                                description="Collaborate seamlessly with your team and garage managers."
                                features={['In-app messaging', 'File sharing', 'Team announcements']}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
}

function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">{icon}</div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Learn More</Button>
            </CardFooter>
        </Card>
    );
}
