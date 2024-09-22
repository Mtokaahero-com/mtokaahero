'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

type FormData = {
    email: string;
    password: string;
};

export default function SignIn() {
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add authentication logic here
            console.log(formData);
        } catch (error) {
            setError('Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-sm p-4 bg-white rounded-md shadow-md">
                <h1 className="text-2xl font-semibold text-center">Sign In</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Checkbox id="remember-me" name="remember-me" />
                        <Label htmlFor="remember-me">Remember me</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loading /> : 'Sign In'}
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
                <div className="flex flex-col items-center mt-4">
                    <span>Or sign in with</span>
                    <div className="flex space-x-4">
                        <Button>SignIn</Button>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <span>Don't have an account?</span>
                    <Link href="/auth/customers/signup" className="text-blue-500">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
