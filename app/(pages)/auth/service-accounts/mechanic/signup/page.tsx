'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useRegisterMutation } from '@/app/store/servces/authApi';
import { useUploadMutation, useDeleteMutation } from '@/app/store/servces/http.services';

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
    const [fileData, setFileData] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [register, { isLoading }] = useRegisterMutation();
    const [upload, { isLoading: isUploading }] = useUploadMutation();
    const [deleteImage] = useDeleteMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFileData(files[0]);
        }
    };

    // const handleUpload = async () => {
    //     try {
    //         if (fileData === null) {
    //             toast.error('No file selected');
    //             return;
    //         } else {
    //             const payload = await upload({ file: fileData }).unwrap();
    //             return payload;
    //         }
    //     } catch (error) {
    //         console.error('Upload failed:', error);
    //     }
    // };


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            switch (fileData) {
                case null:
                    toast.error('No file selected');
                    break;
                case undefined:
                    toast.error('No file selected');
                    break;
                default:
                    setLoading(true);
                    const payload = await upload({ file: fileData }).unwrap();
                    const response = await register({ ...formData, profilePicture: payload.url }).unwrap();
                    if (response.status === 201) {
                        toast.success(response.message);
                        setLoading(false);
                    } else {
                        toast.error(response.message);
                        setLoading(false);
                        break;
                    }
            }

        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

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
                        <form onSubmit={handleRegister}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="First Name"
                                        required
                                        onChange={handleChange}
                                        name="firstName"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Last Name"
                                        required
                                        onChange={handleChange}
                                        name="lastName"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        onChange={handleChange}
                                        name="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="123 Main St, New York, NY 10001"
                                    required
                                    onChange={handleChange}
                                    name="address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="(123) 456-7890"
                                    required
                                    onChange={handleChange}
                                    name="phoneNumber"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required onChange={handleChange} name="password" />
                            </div>
                            {/* profile picture */}
                            <div className="space-y-2">
                                <Label htmlFor="profile">Profile Picture</Label>
                                <Input
                                    id="profile"
                                    type="file"
                                    required
                                    onChange={handleFileChange}
                                    name="profilePicture"
                                />
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
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleRegister}
                            className="w-full flex justify-center items-center space-x-2"
                            disabled={loading}>
                            {loading ? (
                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
