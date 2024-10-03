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
import { useDeleteMutation, useUploadMutation } from '@/app/store/servces/http.services';


import { CloudinaryUploadResponse } from '@/types/responseTypes';

export default function Component() {
const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john)@example.com',
    phoneNumber: '+254712345678',
    role: 'mechanic',
    address: '123-street',
    password: 'mechanic',
    profilePicture: '',
});
const [fileData, setFileData] = useState<File | null>(null);
const [loading, setLoading] = useState<boolean>(false);

const [register] = useRegisterMutation();
const [upload] = useUploadMutation();
const [deleteImage] = useDeleteMutation();

// Handle input changes
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

// Handle file input changes
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        setFileData(files[0]);
    }
};
    
const uploadPF = async (): Promise<CloudinaryUploadResponse> => {
        return new Promise(async (resolve, reject) => {
            if (fileData) {
                uploadImageToCloudinary(fileData)
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                reject('Please select an image to upload');
            }
        });
    };

    // to be handled in issue #24
    const uploadImageToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
         const formData = new FormData();
         formData.append('file', file);
         return new Promise(async (resolve, reject) => {
             try {
                 const response = await fetch('http://localhost:8900/api/image/upload', {
                     method: 'POST',
                     body: formData,
                 });
                 const data: CloudinaryUploadResponse = await response.json();
                 if (data) {
                     resolve(data);
                 } else {
                     reject('An error occurred while uploading the image');
                 }
             } catch (error) {
                 reject('An error occurred while uploading the image');
             }
         });
     };
    
     const invokeImageDelete = async (publicId: string): Promise<CloudinaryUploadResponse> => {
         return new Promise(async (resolve, reject) => {
             try {
                 const response = await fetch('http://localhost:8900/api/image/delete', {
                     method: 'DELETE',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({ publicId }),
                 });
                 const data = await response.json();
                 if (data) {
                     resolve(data);
                 } else {
                     reject('An error occurred while deleting the image');
                 }
             } catch (error) {
                 reject('An error occurred while deleting the image');
             }
         });
     };

    
    const handleRegister = async () => {
        setLoading(true);
        try {
            const profilePicture = await uploadPF();
            const response = await register({ ...formData, profilePicture: profilePicture.url });
            if (response.data) {
                toast.success(response.data.message);
            } else {
                toast.error("An error occurred while registering your account");
            }
        } catch (error) {
            toast.error('An error occurred while registering your account');
        } finally {
            setLoading(false);
        }
    }


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
                                        value={formData.firstName}
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
                                        value={formData.lastName}
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
                                        value={formData.email}
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
                                    value={formData.address}
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
                                    value={formData.phoneNumber}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password"
                                    type="password"
                                    required onChange={handleChange}
                                    name="password"
                                    value={formData.password}
                                />
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
                            type='submit'
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
