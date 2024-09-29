'use client';

import React, { useState } from 'react';
import { useLoginMutation } from '@/app/store/servces/authApi';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WrenchIcon } from '@/components/ui/icons';
import Link from 'next/link';


interface LoginFormProps {
    // Define the props for the login form
    email: string;
    password: string;
}


const handleErrorResponse = (error: any) => {
    console.log('Error:', error);
    if (error?.response && error?.response?.data) { 
        const { message, error: errorMessage } = error.response.data;
        toast.error(message || errorMessage);
    } else {
        toast.error('An error occurred. Please try again.');
    }
}



const LoginForm = () => {
    const [formData, setFormData] = useState<LoginFormProps>({ email: '', password: '' });
    const [login, { isLoading, isError, data }] = useLoginMutation(); // Use the login mutation hook

    if (isError) {
        handleErrorResponse(data);
    }
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.email || !formData.password) {
                return toast.error('Please enter your email and password');
            }
            const payload = await login({ ...formData }).unwrap(); // Make the login request
            if (payload.status === 401) {
                toast.error(payload.message)
            }
            // Handle the login response
            const id = payload.profile.id;
            toast.success('Login successful, redirecting...');
            setTimeout(() => {
                window.location.href = '/dashboard'+id;
            }
            , 2000);
        } catch (error) {
            console.error('Login failed:', error);
        }

    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        for (let key in formData) {
            if (key === e.target.id) {
                setFormData({ ...formData, [key]: e.target.value });
            }
        }
    }

    //

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-primary to-primary-foreground">
            <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32 xl:py-40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-4 md:space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
                            Welcome Back to MtokaaHero
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/80">
                            Sign in to your MtokaaHero Auto Repair account and continue managing your garage
                            effortlessly.
                        </p>
                    </div>  
                    <Card className="bg-background p-6 md:p-8 lg:p-10 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <WrenchIcon className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Sign in to Your Account</CardTitle>
                            <CardDescription className="text-center">
                                Enter your username and password to access the MtokaaHero Auto Repair platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Username</Label>
                                    <Input id="email" placeholder="Enter your email" required
                                        onChange={handleChange}
                                        // value={formData.email}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" placeholder="Enter your password" required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Link
                                        href="#"
                                        className="text-sm font-medium text-black hover:underline"
                                        prefetch={false}>
                                        Forgot password?
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" onClick={handleLogin}>
                                {isLoading ? 'Loading...' : 'Sign In'}
                            </Button>
                        </CardFooter>
                        <div className="mt-4 text-center">
                            <span className="text-sm">Don't have an account? </span>
                            <Link href="/auth/garage/signup" prefetch={false} className="text-primary hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
