'use client';
import { addToCart, clearCart, removeFromCart } from '@/app/features/cartActions';
import Navigation from '@/components/fragments/getStartedNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpectedAsProductTypes, ExpectedMechanicProps } from '@/types/foreignTypes';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Component() {

    const router = useRouter();

    const [selectedMechanic, setSelectedMechanic] = useState<ExpectedMechanicProps | null>(null);

    const dispatch = useDispatch();

    const handleAddToCart = (product: ExpectedAsProductTypes) => {
        dispatch(addToCart(product));
    };

    const handleRemoveFromCart = (productId: number) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const mechanics = [
        {
            id: 1,
            name: 'John Doe',
            specialty: 'Engine Repair',
            image: '/placeholder.svg?height=100&width=100',
            email: 'john@gmail.com',
        },
        {
            id: 2,
            name: 'Jane Smith',
            specialty: 'Electrical Systems',
            image: '/placeholder.svg?height=100&width=100',
            email: 'jane@gmail.com',
        },
        {
            id: 3,
            name: 'Mike Johnson',
            specialty: 'Body Work',
            image: '/placeholder.svg?height=100&width=100',
            email: 'mike@gmail.com',
        },
        {
            id: 4,
            name: 'Emily Brown',
            specialty: 'Transmission Repair',
            image: '/placeholder.svg?height=100&width=100',
        },
        { id: 5, name: 'David Lee', specialty: 'Brake Systems', image: '/placeholder.svg?height=100&width=100' },
        { id: 6, name: 'Sarah Wilson', specialty: 'Diagnostics', image: '/placeholder.svg?height=100&width=100' },
    ];

    const products = [
        {
            id: 1,
            productName: 'Oil Filter',
            productPrice: 15.99,
            garageId: 1,
            productImage: '/placeholder.svg?height=100&width=100',
        },
        {
            id: 2,
            productName: 'Brake Pads',
            productPrice: 45.99,
            garageId: 1,
            productImage: '/placeholder.svg?height=100&width=100',
        },
        {
            id: 3,
            productName: 'Spark Plugs',
            productPrice: 9.99,
            garageId: 1,
            productImage: '/placeholder.svg?height=100&width=100',
        },
        {
            id: 4,
            productName: 'Air Filter',
            productPrice: 12.99,
            garageId: 1,
            productImage: '/placeholder.svg?height=100&width=100',
        },
        {
            id: 5,
            productName: 'Wiper Blades',
            productPrice: 22.99,
            garageId: 1,
            productImage: '/placeholder.svg?height=100&width=100',
        },
        {
            id: 6,
            productName: 'Car Battery',
            productPrice: 89.99,
            garageId: 1,
            productImage: '/placeholder.svg?height=100&width=100',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 py-8 flex-grow">
                <Tabs defaultValue="services" className="mb-8">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="mechanics">Featured Mechs</TabsTrigger>
                        <TabsTrigger value="products">Our Products</TabsTrigger>
                    </TabsList>
                    <TabsContent value="mechanics">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {mechanics.slice(0, 3).map((mechanic) => (
                                <Card
                                    key={mechanic.id}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedMechanic(mechanic)}
                                >
                                    <CardHeader>
                                        <CardTitle>{mechanic.name}</CardTitle>
                                        <CardDescription>{mechanic.specialty}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <img
                                            src={mechanic.image}
                                            alt={mechanic.name}
                                            className="w-full h-auto rounded-md"
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/mechanics" className="text-blue-500 hover:underline">
                                <Button>View All Mechanics</Button>
                            </Link>
                        </div>
                        {selectedMechanic && (
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle>{selectedMechanic.name}</CardTitle>
                                    <CardDescription>{selectedMechanic.specialty}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Detailed profile and availability information would go here.</p>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => setSelectedMechanic(null)}>Close Profile</Button>
                                </CardFooter>
                            </Card>
                        )}
                    </TabsContent>
                    <TabsContent value="products">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {products.slice(0, 3).map((product) => (
                                <Card key={product.id}>
                                    <CardHeader>
                                        <CardTitle>{product.productName}</CardTitle>
                                        <CardDescription>${product.productPrice.toFixed(2)}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Button>View All Products</Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Book a Repair Session</CardTitle>
                        <CardDescription>Schedule your vehicle repair with our expert mechanics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="your@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="service">Service Required</Label>
                                <Input id="service" placeholder="e.g., Oil Change, Brake Repair" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Preferred Date</Label>
                                <Input id="date" type="date" />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">
                            <CalendarIcon className="mr-2 h-4 w-4" /> Book Appointment
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
