import FeatureCard from '@/components/fragments/FeatureCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChartIcon, GlobeIcon, MessageSquareIcon, PackageIcon, ShieldIcon, UsersIcon } from 'lucide-react';
import Navigation from '@/components/fragments/getStartedNavigation';
import Link from 'next/link';

export default function ServicesPage() {
    return (
        <div className=" ">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>

                <Tabs defaultValue="saas" className="mb-12">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="saas">SaaS Platform</TabsTrigger>
                        <TabsTrigger value="importing">Car Importing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="saas">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">SaaS Platform for Mechanics and Garages</CardTitle>
                                <CardDescription>
                                    Streamline your automotive business with our comprehensive SaaS solution
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <FeatureCard
                                        icon={<GlobeIcon className="h-6 w-6 text-primary" />}
                                        title="Online Presence"
                                        description="Create a professional online profile to showcase your services and expertise."
                                    />
                                    <FeatureCard
                                        icon={<BarChartIcon className="h-6 w-6 text-primary" />}
                                        title="Business Analytics"
                                        description="Gain insights into your business performance with detailed analytics and reporting."
                                    />
                                    <FeatureCard
                                        icon={<PackageIcon className="h-6 w-6 text-primary" />}
                                        title="Inventory Management"
                                        description="Easily manage your parts inventory and streamline your supply chain."
                                    />
                                    <FeatureCard
                                        icon={<UsersIcon className="h-6 w-6 text-primary" />}
                                        title="Customer Management"
                                        description="Keep track of your customers, their vehicles, and service history in one place."
                                    />
                                    <FeatureCard
                                        icon={<MessageSquareIcon className="h-6 w-6 text-primary" />}
                                        title="Appointment Booking"
                                        description="Allow customers to book appointments online and manage your schedule efficiently."
                                    />
                                    <FeatureCard
                                        icon={<ShieldIcon className="h-6 w-6 text-primary" />}
                                        title="Secure Payments"
                                        description="Process payments securely and manage your finances with ease."
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Link href="/auth/service-accounts" className="text-primary">
                                    <Button size="lg">Start Your Free Trial</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="importing">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Car Importing Service</CardTitle>
                                <CardDescription>
                                    Let us handle the complexities of importing your dream car
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p>
                                        Our expert team takes care of the entire importing process, from sourcing your
                                        desired vehicle to handling all the paperwork and logistics. We specialize in:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Sourcing rare and luxury vehicles from international markets</li>
                                        <li>Navigating complex customs regulations and import laws</li>
                                        <li>Arranging secure transportation and shipping</li>
                                        <li>Handling all necessary inspections and certifications</li>
                                        <li>Providing comprehensive insurance coverage throughout the process</li>
                                    </ul>
                                    <p>
                                        With our service, you can sit back and relax while we bring your automotive
                                        dreams to reality.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button size="lg">Request a Quote</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Why Choose MtokaaHero?</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Expertise</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    With years of experience in the automotive industry, we bring unparalleled knowledge
                                    to every service we offer.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Cutting-edge Technology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Our platform leverages the latest in cloud technology to provide a seamless,
                                    efficient experience for mechanics and customers alike.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer-Centric Approach</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    We put our clients first, ensuring that every interaction with MtokaaHero exceeds
                                    expectations.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>


                <section className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="mb-6">
                        Join the MtokaaHero community and take your automotive business to the next level.
                    </p>
                    <Button size="lg">Check Out Our Partner Garages</Button>
                </section>
            </div>
        </div>
    );
}
