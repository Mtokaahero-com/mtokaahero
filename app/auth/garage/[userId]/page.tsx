'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Home, Menu, Settings } from 'lucide-react';
import { toast, useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

import { UserInterface } from '@/interfaces/returnTypes';
import { getUserByid } from '@/lib/db/users';

export interface GarageSignupWithNavbarProps {
    params: {
        userId: string;
    };
}

const GarageSignupWithNavbar: React.FC<GarageSignupWithNavbarProps> = ({ params }) => {
    const [freeTrialGarage, setFreeTrialGarage] = useState(false);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        garageName: '',
        ownerName: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        specialties: '',
        openingHours: '',
        yearsInBusiness: '',
    });

    const userId = params.userId;

    useEffect(() => {
        if (userId) {
            getUserByid(userId).then((data) => {
                setUser(data);
            });
        }
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Here you would typically send the data to your backend
            console.log('Form submitted:', { ...formData, freeTrialGarage });
            toast({
                title: freeTrialGarage ? 'Free trial started' : 'Garage registered',
                description: 'Your garage account has been set up successfully.',
            });
            // Reset form after successful submission
            setFormData({
                garageName: '',
                ownerName: '',
                address: '',
                phone: '',
                email: '',
                description: '',
                specialties: '',
                openingHours: '',
                yearsInBusiness: '',
            });
            setFreeTrialGarage(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'There was a problem setting up your garage account. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-primary to-primary-foreground relative">
            {/* Navbar Trigger */}
            <div className="absolute top-4 right-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-4 mt-4">
                            <Link href="/" className="flex items-center space-x-2 text-sm">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </Link>
                            <Link href="/settings" className="flex items-center space-x-2 text-sm">
                                <Settings className="h-5 w-5" />
                                <span>Settings</span>
                            </Link>
                            <Link href="/help" className="flex items-center space-x-2 text-sm">
                                <HelpCircle className="h-5 w-5" />
                                <span>Help</span>
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32 xl:py-40 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-4 md:space-y-6 hidden sm:block">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
                            {user ? `Welcome, ${user.userName}!` : 'Welcome!'}
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/80">
                            Join our network of trusted automotive repair services and connect with customers in your
                            area.
                        </p>
                    </div>
                    <Card className="bg-background p-6 md:p-8 lg:p-10 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Set Up Your Garage Account</CardTitle>
                            <Link href="/auth/myaccount" prefetch={false} className="text-center block mt-2">
                                <span className="text-red-600 hover:text-primary/90">Find Your Account</span>
                            </Link>
                            <CardDescription>Fill out the form below to get started.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="garageName">Garage Name</Label>
                                        <Input
                                            id="garageName"
                                            name="garageName"
                                            value={formData.garageName}
                                            onChange={handleInputChange}
                                            placeholder="MtokaaHero Auto Repair"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Owner Full Names</Label>
                                        <Input
                                            id="ownerName"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="123 Main St, Anytown Kenya"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="(555) 555-5555"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="garage@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Garage Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about your garage and services..."
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="specialties">Specialties</Label>
                                    <Input
                                        id="specialties"
                                        name="specialties"
                                        value={formData.specialties}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Brake repair, Engine diagnostics"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="openingHours">Opening Hours</Label>
                                    <Input
                                        id="openingHours"
                                        name="openingHours"
                                        value={formData.openingHours}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Mon-Fri: 8am-6pm, Sat: 9am-3pm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="yearsInBusiness">Years in Business</Label>
                                    <Select onValueChange={handleSelectChange('yearsInBusiness')}>
                                        <SelectTrigger id="yearsInBusiness">
                                            <SelectValue placeholder="Select years in business" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                                            <SelectItem value="1-5">1-5 years</SelectItem>
                                            <SelectItem value="5-10">5-10 years</SelectItem>
                                            <SelectItem value="10+">10+ years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-6 rounded-lg shadow-lg text-white space-y-4">
                                    <h2 className="text-2xl font-bold">Start Your Free Trial Today!</h2>
                                    <p>Experience all features for 30 days, no credit card required.</p>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="free-trial"
                                            checked={freeTrialGarage}
                                            onCheckedChange={setFreeTrialGarage}
                                        />
                                        <Label htmlFor="free-trial">Enable Free Trial</Label>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading
                                        ? 'Processing...'
                                        : freeTrialGarage
                                          ? 'Start Free Trial'
                                          : 'Register Garage'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default GarageSignupWithNavbar;
