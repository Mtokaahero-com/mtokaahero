'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Wrench, MapPin, User, Mail, Phone, Lock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';

const schema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phoneNumber: z.string().min(10, 'Enter a valid phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    garageName: z.string().min(2, 'Garage name must be at least 2 characters'),
    address: z.string().min(5, 'Please enter a valid address'),
    location: z.string().min(2, 'Please enter your location / coordinates'),
});

type FormValues = z.infer<typeof schema>;

export default function GarageRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            await authApi.registerGarage(data);
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            if (result?.error) {
                toast.success('Garage registered! Please sign in to continue.');
                router.push('/auth/signin');
                return;
            }
            toast.success('Welcome to MtokaaHero!');
            router.push('/dashboard/garage');
        } catch (err: any) {
            toast.error(err.message ?? 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left panel */}
                <div className="hidden lg:flex flex-col space-y-6 text-white p-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-3 rounded-xl">
                            <Wrench className="h-8 w-8" />
                        </div>
                        <span className="text-2xl font-bold">MtokaaHero</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight">
                        Grow your garage<br />
                        <span className="text-blue-400">with us.</span>
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Join hundreds of garages already using MtokaaHero to connect with customers across Kenya.
                    </p>
                    <ul className="space-y-3 text-slate-300">
                        {['Get discovered by local customers', 'Manage services & bookings', 'Build trust with verified reviews'].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-blue-400 rounded-full" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Registration form */}
                <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-sm text-white">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Register Your Garage</CardTitle>
                        <CardDescription className="text-slate-400">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="text-blue-400 hover:underline font-medium">
                                Sign in
                            </Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Owner name row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="firstName" className="text-slate-300 text-sm">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input id="firstName" placeholder="John" className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('firstName')} />
                                    </div>
                                    {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="lastName" className="text-slate-300 text-sm">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('lastName')} />
                                    {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            {/* Garage name */}
                            <div className="space-y-1">
                                <Label htmlFor="garageName" className="text-slate-300 text-sm">Garage Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input id="garageName" placeholder="Doe's Auto Repair" className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('garageName')} />
                                </div>
                                {errors.garageName && <p className="text-red-400 text-xs">{errors.garageName.message}</p>}
                            </div>

                            {/* Email & Phone row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input id="email" type="email" placeholder="john@garage.com" className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('email')} />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phoneNumber" className="text-slate-300 text-sm">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input id="phoneNumber" type="tel" placeholder="+254700000000" className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('phoneNumber')} />
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-400 text-xs">{errors.phoneNumber.message}</p>}
                                </div>
                            </div>

                            {/* Address & Location row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="address" className="text-slate-300 text-sm">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input id="address" placeholder="123 Garage St, Nairobi" className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('address')} />
                                    </div>
                                    {errors.address && <p className="text-red-400 text-xs">{errors.address.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="location" className="text-slate-300 text-sm">Location / Area</Label>
                                    <Input id="location" placeholder="Westlands, Nairobi" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('location')} />
                                    {errors.location && <p className="text-red-400 text-xs">{errors.location.message}</p>}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-500" {...register('password')} />
                                </div>
                                {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-semibold h-11" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : 'Register Garage'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
