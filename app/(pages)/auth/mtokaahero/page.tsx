'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WrenchIcon, BuildingIcon, UploadIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'


export default function RegistrationPage() {
    const [freeTrialGarage, setFreeTrialGarage] = useState(false)
    const [freeTrialMechanic, setFreeTrialMechanic] = useState(true)
    const [loading, setLoading] = useState(false)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Join the MtokaaHero Network</h1>
                <p className="text-xl text-muted-foreground">
                    Boost your business, connect with customers, and grow your automotive career
                </p>
            </div>

            <Tabs defaultValue="garage" className="max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="garage" className="text-lg">
                        <BuildingIcon className="w-5 h-5 mr-2" />
                        Register Garage
                    </TabsTrigger>
                    <TabsTrigger value="mechanic" className="text-lg">
                        <WrenchIcon className="w-5 h-5 mr-2" />
                        Register as Mechanic
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="garage">
                    <Card>
                        <CardHeader>
                            <CardTitle>Garage Registration</CardTitle>
                            <CardDescription>
                                Create your garage profile and start attracting more customers
                                <span className="flex items-center space-x-2">
                                    <Link href="/auth/mtokaahero/find-profile" className="text-blue-600 hover:underline">
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
                                disabled={loading}
                            >
                                {freeTrialGarage ? 'Start Free Trial' : 'Register Garage'}
                            </button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="mechanic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mechanic Registration</CardTitle>
                            <CardDescription>
                                Create your professional profile and connect with potential clients
                                <span className="flex items-center space-x-2">
                                    <Link href="/auth/mtokaahero/find-profile" className="text-blue-600 hover:underline">
                                        Already have an account? Login here
                                    </Link>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mechanicFirstName">First Name</Label>
                                    <Input id="mechanicFirstName" placeholder="Enter first name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mechanicLastName">Last Name</Label>
                                    <Input id="mechanicLastName" placeholder="Enter last name" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mechanicEmail">Email</Label>
                                <Input id="mechanicEmail" type="email" placeholder="mechanic@example.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mechanicPhone">Phone Number</Label>
                                    <Input id="mechanicPhone" type="tel" placeholder="(123) 456-7890" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mechanicExperience">Years of Experience</Label>
                                    <Input id="mechanicExperience" type="number" min="0" placeholder="Enter years" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mechanicSpecialty">Specialty</Label>
                                <Select>
                                    <SelectTrigger id="mechanicSpecialty">
                                        <SelectValue placeholder="Select your specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General Repair</SelectItem>
                                        <SelectItem value="engine">Engine Specialist</SelectItem>
                                        <SelectItem value="electrical">Electrical Systems</SelectItem>
                                        <SelectItem value="bodywork">Body Work</SelectItem>
                                        <SelectItem value="transmission">Transmission</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mechanicCertifications">Certifications (Optional)</Label>
                                <Textarea id="mechanicCertifications" placeholder="List your certifications..." />
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
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg text-white space-y-4">
                                <h2 className="text-2xl font-bold">Start Your Free Trial Today!</h2>
                                <p>Experience all features for 30 days, no credit card required.</p>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="free-trial"
                                        checked={freeTrialMechanic}
                                        onCheckedChange={setFreeTrialMechanic}
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
                                disabled={loading}
                            >
                                {freeTrialGarage ? 'Start Free Trial' : 'Register Mechanic Profile'}
                            </button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
