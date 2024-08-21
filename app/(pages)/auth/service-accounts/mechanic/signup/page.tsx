'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

export default function Component() {
    const [formData, setFormData] = useState({
        name: '',
        last: '',
        email: '',
        phone: '',
        password: '',
        profilePicture: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first">First Name</Label>
                                <Input id="name" placeholder="First Name" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last">Last Name</Label>
                                <Input id="last" placeholder="Last Name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="(123) 456-7890" required />
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
                            Sign Up
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
