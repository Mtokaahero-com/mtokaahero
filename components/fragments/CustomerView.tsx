'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Coffee, Library, Hotel, Users, Monitor, Printer, CoffeeIcon as Coffee2 } from 'lucide-react';




export default function Component() {
    return (
        <div className=" bg-white">
            {/* Hero Section */}
            <div className="relative h-[300px]">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Office Space"
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <h1 className="text-3xl font-semibold mb-8">Where are you working today?</h1>
                    <div className="flex gap-2 bg-white rounded-lg p-2 w-full max-w-3xl mx-4">
                        <div className="flex-1 border-r px-4">
                            <div className="text-xs text-gray-500">Choose location</div>
                            <Input placeholder="Search a remote working space" className="border-0" />
                        </div>
                        <div className="flex-1 border-r px-4">
                            <div className="text-xs text-gray-500">When</div>
                            <Input placeholder="Select date and time" className="border-0" />
                        </div>
                        <div className="flex-1 px-4">
                            <div className="text-xs text-gray-500">Who</div>
                            <Input placeholder="No. of people/company" className="border-0" />
                        </div>
                        <Button size="icon" className="bg-black">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex justify-center gap-8 py-6 border-b">
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Co-working space</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Library className="h-5 w-5" />
                    <span className="text-xs">Library</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Hotel className="h-5 w-5" />
                    <span className="text-xs">Hotel</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Conference room</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    <span className="text-xs">Restaurant</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Printer className="h-5 w-5" />
                    <span className="text-xs">Desk and chair</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Coffee2 className="h-5 w-5" />
                    <span className="text-xs">Private office</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center gap-2">
                    <Coffee className="h-5 w-5" />
                    <span className="text-xs">Cafe</span>
                </Button>
            </div>

            {/* Promotional Banner */}
            <div className="max-w-6xl mx-auto my-8">
                <Card className="bg-black text-white">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-semibold mb-2">
                            Get 20% off a private office at Nairobi Garage Westlands
                        </h2>
                        <p className="text-gray-300">
                            Save massively when you purchase a monthly membership at all locations of the Nairobi
                            Garage. Get 2 free cups of coffee when you subscribe for a year.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Best Deals Section */}
            <div className="max-w-6xl mx-auto my-8">
                <h2 className="text-xl font-semibold mb-4">Best deals in your area</h2>
                <p className="text-gray-500 mb-6">
                    Find a place something happening. Save upto 50% on these locations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <Card key={item}>
                            <img
                                src="/placeholder.svg?height=200&width=300"
                                alt="Workspace"
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="p-4">
                                <h3 className="font-semibold">Nairobi Garage</h3>
                                <p className="text-sm text-gray-500">Delta Corner Annex, Westlands</p>
                                <div className="flex gap-2 my-2">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">WiFi</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">AC</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Coffee</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div>
                                        <span className="font-semibold">KES 890.00</span>
                                        <span className="text-sm text-gray-500">/Per day</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Work Anywhere Section */}
            <div className="max-w-6xl mx-auto my-8">
                <h2 className="text-xl font-semibold mb-4">Work anywhere in Kenya</h2>
                <p className="text-gray-500 mb-6">Find excellent locations to work in these locations</p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <Card className="relative h-48">
                        <img
                            src="/placeholder.svg?height=200&width=400"
                            alt="Nairobi"
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <h3 className="text-xl font-semibold">Nairobi</h3>
                            <p className="text-sm">85 locations</p>
                        </div>
                    </Card>
                    <Card className="relative h-48">
                        <img
                            src="/placeholder.svg?height=200&width=400"
                            alt="Mombasa"
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <h3 className="text-xl font-semibold">Mombasa</h3>
                            <p className="text-sm">27 locations</p>
                        </div>
                    </Card>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {['Kisumu', 'Nakuru', 'Eldoret'].map((city, index) => (
                        <Card key={city} className="relative h-40">
                            <img
                                src="/placeholder.svg?height=160&width=300"
                                alt={city}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                <h3 className="text-xl font-semibold">{city}</h3>
                                <p className="text-sm">{4 + index} locations</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Serene Outdoor Spaces Section */}
            <div className="max-w-6xl mx-auto my-8">
                <h2 className="text-xl font-semibold mb-4">Serene outdoor working spaces near you</h2>
                <p className="text-gray-500 mb-6">
                    Find out all the house into these locations within 5 kilometers from your house
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <Card key={item}>
                            <img
                                src="/placeholder.svg?height=200&width=300"
                                alt="Workspace"
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="p-4">
                                <h3 className="font-semibold">Nairobi Garage</h3>
                                <p className="text-sm text-gray-500">Delta Corner Annex, Westlands</p>
                                <div className="flex gap-2 my-2">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">WiFi</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">AC</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Coffee</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div>
                                        <span className="font-semibold">KES 890.00</span>
                                        <span className="text-sm text-gray-500">/Per day</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
