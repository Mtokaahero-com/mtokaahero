'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RegistrationPage() {
    const [freeTrialGarage, setFreeTrialGarage] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className=" min-h-screen bg-gradient-to-br from-primary to-primary-foreground w-full flex  justify-center items-center">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Garage Registration</CardTitle>
                            <CardDescription>
                                Create your garage profile and start attracting more customers
                                <span className="flex items-center space-x-2">
                                    <Link href="/auth/myaccount/find-profile" className="text-blue-600 hover:underline">
                                        Already have an account? Login here
                                    </Link>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="garageName">Garage Name</Label>
                                    <Input id="garageName" placeholder="Enter garage name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="garageEmail">Email</Label>
                                    <Input id="garageEmail" type="email" placeholder="garage@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="garageAddress">Address</Label>
                                <Input id="garageAddress" placeholder="Enter garage address" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="garagePhone">Phone Number</Label>
                                    <Input id="garagePhone" type="tel" placeholder="(123) 456-7890" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="garageWebsite">Website (Optional)</Label>
                                    <Input id="garageWebsite" type="url" placeholder="https://www.example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="garageServices">Services Offered</Label>
                                <Textarea id="garageServices" placeholder="List your main services..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo">Upload Logo</Label>
                                <div className="flex items-center space-x-2 pb-2">
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        // onChange={handleLogoUpload}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 pb-12"
                                    />
                                    {loading && <Loader2 className="h-8 w-8 animate-spin" />}
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-6 rounded-lg shadow-lg text-white space-y-4">
                                <h2 className="text-2xl font-bold">Start Your Free Trial Today!</h2>
                                <p>Experience all features for 7 days, no credit card required.</p>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="free-trial"
                                        checked={freeTrialGarage}
                                        onCheckedChange={setFreeTrialGarage}
                                    />
                                    <Label htmlFor="free-trial">Enable Free Trial</Label>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <button
                                type="submit"
                                className={`mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={loading}>
                                {freeTrialGarage ? 'Start Free Trial' : 'Register Garage'}
                            </button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
