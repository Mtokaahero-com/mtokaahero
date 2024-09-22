'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RootState } from '@/app/store/store';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: '📱' },
    { id: 'airtel', name: 'Airtel Money', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
];

function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Processing your order...</p>
            </div>
        </div>
    );
}

export default function Component() {
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch items from Redux store
    const items = useSelector((state: RootState) => state.cart.items);

    const subtotal = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const handlePlaceOrder = () => {
        setIsLoading(true);
        // Simulate an API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Order placed successfully');

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }, 3000);
    };
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <LoadingOverlay isLoading={isLoading} />
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" placeholder="+254 700 000000" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="123 Main St" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="Nairobi" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="county">County</Label>
                                    <Select>
                                        <SelectTrigger id="county">
                                            <SelectValue placeholder="Select county" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nairobi">Nairobi</SelectItem>
                                            <SelectItem value="mombasa">Mombasa</SelectItem>
                                            <SelectItem value="kisumu">Kisumu</SelectItem>
                                            {/* Add more counties as needed */}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>Select your preferred payment method</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={method.id} id={method.id} />
                                        <Label htmlFor={method.id} className="flex items-center">
                                            <span className="mr-2">{method.icon}</span>
                                            {method.name}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                        <CardFooter>
                            {paymentMethod === 'mpesa' && (
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
                                    <Input id="mpesaNumber" placeholder="07XX XXX XXX" />
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{item.productName}</span>
                                    <span>KES {(item.productPrice * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-medium">
                                <span>Subtotal</span>
                                <span>KES {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>KES {shippingCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>KES {total.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handlePlaceOrder}>
                                {isLoading ? 'Processing...' : 'Place Order'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
