'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { RoleInterface } from '@/interfaces/returnTypes';
import { useEffect, useState } from 'react';

import { getRoles } from '@/lib/db/roles';

export default function UserCreationPage() {
    const [roles, setRoles] = useState<RoleInterface[]>([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        userName: '',
        roleId: '',
    });
    const [errors, setErrors] = useState<Errors>({});
    const { toast } = useToast();

    interface FormData {
        email: string;
        password: string;
        phoneNumber: string;
        userName: string;
        roleId: string;
    }

    interface Errors {
        email?: string;
        password?: string;
        phoneNumber?: string;
        userName?: string;
        roleId?: string;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev: FormData) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof Errors]) {
            setErrors((prev: Errors) => ({ ...prev, [name]: '' }));
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData((prev: FormData) => ({ ...prev, roleId: value }));
        if (errors.roleId) {
            setErrors((prev: Errors) => ({ ...prev, roleId: '' }));
        }
    };

    const validateForm = () => {
        let newErrors: Errors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.userName) newErrors.userName = 'Username is required';
        if (!formData.roleId) newErrors.roleId = 'Role is required';

        // Basic email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password strength check (example: at least 8 characters)
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (validateForm()) {
            // Here you would typically send the data to your backend
            console.log('Form submitted:', formData);
            toast({
                title: 'Account created',
                description: "We've created your account for you.",
            });
            // Reset form after successful submission
            setFormData({ email: '', password: '', phoneNumber: '', userName: '', roleId: '' });
        } else {
            toast({
                title: 'Error',
                description: 'Please fill all required fields correctly.',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        async function fetchRoles() {
            await getRoles()
                .then((res) => {
                    setRoles(res);
                })
                .catch((error) => console.log(error));
        }

        fetchRoles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                    <CardDescription>Enter the details to create a new user account.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userName">Username</Label>
                            <Input
                                id="userName"
                                name="userName"
                                type="text"
                                placeholder="Choose a username"
                                value={formData.userName}
                                onChange={handleInputChange}
                            />
                            {errors.userName && <p className="text-sm text-red-500">{errors.userName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <select className="w-full rounded border p-2" name="serviceId" onChange={handleRoleChange}>
                                <option value="">Select a service</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.roleId && <p className="text-sm text-red-500">{errors.roleId}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Toaster />
        </div>
    );
}
