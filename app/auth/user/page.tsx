'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { RoleInterface } from '@/interfaces/returnTypes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateEmail } from '@/lib/validators/users';

import { getRoles } from '@/lib/db/roles';
import { getRole } from '@/lib/validators/users';

export default function UserCreationPage() {
    const [roles, setRoles] = useState<RoleInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        userName: '',
        roleId: '',
    });
    const [errors, setErrors] = useState<Errors>({});
    const { toast } = useToast();

    const router = useRouter();

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

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            toast({
                title: 'Error',
                description: 'Please fill all required fields correctly.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const user = await response.json();
            const role = await getRole(user.user.roleId) as unknown as RoleInterface;
            if (role.name === 'garage') {
                router.push(`/auth/garage/${user.user.id}`);
            } else if (role.name === 'mechanic') {
                router.push(`/auth/mechanic/${user.user.id}`);
            } else if (role.name === 'shop') {
                router.push(`/auth/shop/${user.user.id}`);
            } else {
                toast({
                    title: 'Base Permission Failed',
                    description: 'Process failed when Asigning your account, please ty again',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({ title: 'Submission Failed', description: (error as any).message, variant: 'destructive' });
        } finally {
            setLoading(false);
            setFormData({ email: '', password: '', phoneNumber: '', userName: '', roleId: '' });
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        })();
    }, []);

    //  useEffect(() => {
    //      const timeout = setTimeout(async () => {
    //          if (formData.email && !errors.email) {
    //              const isEmailValid = await validateEmail(formData.email);
    //              if (!isEmailValid) {
    //                  setErrors((prev) => ({ ...prev, email: 'Email already in use' }));
    //              }
    //          }
    //      }, 500); // debounce interval
    //      return () => clearTimeout(timeout);
    //  }, [formData.email, errors.email]);

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
                                <option value="">Select account type</option>
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
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Toaster />
        </div>
    );
}
