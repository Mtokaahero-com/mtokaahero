import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

export default function PricingSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Select the perfect plan for your automotive business needs. Upgrade or downgrade at any time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard
                        title="Basic"
                        price="$29"
                        description="Perfect for small garages or independent mechanics"
                        features={[
                            'Garage management tools',
                            'Basic appointment scheduling',
                            'Inventory tracking',
                            'Email support',
                        ]}
                        badge="Popular"
                    />

                    <PricingCard
                        title="Gold"
                        price="$79"
                        description="Ideal for growing automotive businesses"
                        features={[
                            'All Basic features',
                            'Advanced financial analytics',
                            'Customer management system',
                            'Priority email & chat support',
                            'Staff management tools',
                        ]}
                    />

                    <PricingCard
                        title="Premium"
                        price="$149"
                        description="For large garages and automotive networks"
                        features={[
                            'All Gold features',
                            'Multi-location support',
                            'Custom integrations',
                            'Dedicated account manager',
                            '24/7 phone support',
                            'Advanced reporting and insights',
                        ]}
                    />
                </div>

                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-semibold mb-4">Trusted by Automotive Professionals</h3>
                    <div className="flex items-center justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="text-yellow-400 w-6 h-6 fill-current" />
                        ))}
                    </div>
                    <p className="text-lg font-medium">4.9 out of 5 stars from over 1,000 reviews</p>
                </div>
            </div>
        </section>
    );
}

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    badge?: string;
}

function PricingCard({ title, price, description, features, badge }: PricingCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    {badge && <Badge variant="secondary">{badge}</Badge>}
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-3xl font-bold mb-4">
                    {price}
                    <span className="text-lg font-normal">/month</span>
                </div>
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Choose {title}</Button>
            </CardFooter>
        </Card>
    );
}
