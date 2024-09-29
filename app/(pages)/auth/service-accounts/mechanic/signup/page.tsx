'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useState } from 'react';

import { useLoginMutation } from '@/app/store/servces/authApi';

export default function Component() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'mechanic',
        address: '',
        password: '',
        profilePicture: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [signIn, {isLoading}] = useLoginMutation();
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Sign Up for Mechanic Account</h1>
                    <p className="text-muted-foreground">
                        Create your account to access our online motor vehicle garage system.
                    </p>
                </div>
                <Card>
                    <CardContent className="space-y-4 text-2xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="First Name" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Last Name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="123 Main St, New York, NY 10001" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" type="tel" placeholder="(123) 456-7890" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                        {/* profile picture */}
                        <div className="space-y-2">
                            <Label htmlFor="profile">Profile Picture</Label>
                            <Input id="profile" type="file" required />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" required />
                            <Label htmlFor="terms" className="text-sm text-muted-foreground">
                                I agree to the{' '}
                                <Link href="#" className="underline" prefetch={false}>
                                    terms of service
                                </Link>
                                .
                            </Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            <span>{isLoading ? 'Logging in...' : 'Login'}</span>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
