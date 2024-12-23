'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HelpCircle, Home, LogOut, Menu, Settings } from 'lucide-react';
import { Loader2, User, Building2, Wrench } from 'lucide-react';

interface Profile {
    type: 'garage' | 'mechanic' | 'vendor';
    name: string;
    address?: string;
    specialty?: string;
}

const fetchProfile = async (email: string): Promise<Profile> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const profiles: { [key: string]: Profile } = {
        'garage@example.com': { type: 'garage', name: 'SuperFix Garage', address: '123 Main St' },
        'mechanic@example.com': { type: 'mechanic', name: 'John Doe', specialty: 'Engine Repair' },
    };
    if (email in profiles) return profiles[email];
    throw new Error('Profile not found');
};

export default function Component() {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [profile, setProfile] = useState<Profile | null>(null);
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [accountType, setAccountType] = useState<'mechanic' | 'garage' | 'vendor' | null>(null);

    const router = useRouter();

    const handleFetchProfile = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const fetchedProfile = await fetchProfile(email);
            setProfile(fetchedProfile);
            setIsDialogOpen(true);
        } catch (err) {
            setError('Failed to fetch profile. Please check your email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: FormEvent) => {
        setTimeout(() => {
            setIsDialogOpen(false);
            router.push('/auth/mtokaahero/dashboard/garage/1');
        }, 2000);
    };

    const handleRedirect = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push(`/auth/newaccounts/${accountType}`);
        }, 2000);
    };

    return (
        <>
            <div className="absolute top-4 right-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6 text-white" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-4 mt-4 ">
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
            <div
                className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4"
                style={{ backgroundImage: "url('/bg.jpg')" }}>
                <Card className="w-full max-w-md border bg-white/90 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
                        <CardDescription>
                            {isLogin
                                ? 'Enter your email to fetch your profile and log in.'
                                : 'Choose your account type and sign up.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLogin ? (
                            <form onSubmit={handleFetchProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="mechanic@example.com"
                                        value={email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Fetch Profile'}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleRedirect} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Account Type</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            type="button"
                                            variant={accountType === 'mechanic' ? 'default' : 'outline'}
                                            className="w-full"
                                            onClick={() => setAccountType('mechanic')}>
                                            <Wrench className="mr-2 h-4 w-4" />
                                            Mechanic
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={accountType === 'garage' ? 'default' : 'outline'}
                                            className="w-full"
                                            onClick={() => setAccountType('garage')}>
                                            <Building2 className="mr-2 h-4 w-4" />
                                            Garage
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={accountType === 'vendor' ? 'default' : 'outline'}
                                            className="w-full"
                                            onClick={() => setAccountType('vendor')}>
                                            <User className="mr-2 h-4 w-4" />
                                            Shop
                                        </Button>
                                    </div>
                                </div>
                                <Button type="submit" disabled={isLoading || !accountType} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign Up'}
                                </Button>
                            </form>
                        )}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-500">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <Button variant="link" className="p-0" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? 'Sign up' : 'Log in'}
                            </Button>
                        </p>
                    </CardFooter>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Your Profile</DialogTitle>
                            <DialogDescription>
                                Confirm your details and enter your password to log in.
                            </DialogDescription>
                        </DialogHeader>
                        {profile && (
                            <div className="flex items-center space-x-4 mb-4">
                                {profile.type === 'garage' ? (
                                    <Building2 className="h-10 w-10 text-blue-500" />
                                ) : (
                                    <User className="h-10 w-10 text-green-500" />
                                )}
                                <div>
                                    <h3 className="font-semibold">{profile.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {profile.type === 'garage' ? profile.address : profile.specialty}
                                    </p>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log In'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
