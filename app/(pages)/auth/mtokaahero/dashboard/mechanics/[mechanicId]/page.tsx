"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clipboard, DollarSign, Moon, Settings, Sun, User, Wrench } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [mechanicName, setMechanicName] = useState('John Doe')
    const [specialty, setSpecialty] = useState('Engine Repair')
    const [yearsOfExperience, setYearsOfExperience] = useState('10')

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle('dark', !isDarkMode)
    }

    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden md:flex md:flex-shrink-0">
                    <div className="flex flex-col w-64">
                        <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                                <div className="flex items-center flex-shrink-0 px-4">
                                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        Mechanic Dashboard
                                    </span>
                                </div>
                                <nav className="mt-5 flex-1 px-2 space-y-1">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Clipboard className="mr-2 h-4 w-4" />
                                        Requested Errands
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Payments
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Wrench className="mr-2 h-4 w-4" />
                                        Completed Services
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <User className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {mechanicName} Dashboard
                            </h1>
                            <div className="flex items-center">
                                <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Settings className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Account</DropdownMenuItem>
                                        <DropdownMenuItem>Preferences</DropdownMenuItem>
                                        <DropdownMenuItem>Notifications</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Log out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Dashboard content */}
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                <Tabs defaultValue="errands" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="errands">Requested Errands</TabsTrigger>
                                        <TabsTrigger value="payments">Payments</TabsTrigger>
                                        <TabsTrigger value="services">Completed Services</TabsTrigger>
                                        <TabsTrigger value="profile">Edit Profile</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="errands">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Requested Errands</CardTitle>
                                                <CardDescription>View and manage your upcoming jobs.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Errand ID</TableHead>
                                                            <TableHead>Customer</TableHead>
                                                            <TableHead>Service</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>ERR001</TableCell>
                                                            <TableCell>Alice Johnson</TableCell>
                                                            <TableCell>Oil Change</TableCell>
                                                            <TableCell>2023-06-20</TableCell>
                                                            <TableCell>Pending</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>ERR002</TableCell>
                                                            <TableCell>Bob Smith</TableCell>
                                                            <TableCell>Brake Inspection</TableCell>
                                                            <TableCell>2023-06-21</TableCell>
                                                            <TableCell>Confirmed</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="payments">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Payments</CardTitle>
                                                <CardDescription>
                                                    Track your earnings and payment history.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Payment ID</TableHead>
                                                            <TableHead>Amount</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>PAY001</TableCell>
                                                            <TableCell>$120.00</TableCell>
                                                            <TableCell>2023-06-15</TableCell>
                                                            <TableCell>Completed</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>PAY002</TableCell>
                                                            <TableCell>$85.50</TableCell>
                                                            <TableCell>2023-06-18</TableCell>
                                                            <TableCell>Pending</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="services">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Completed Services</CardTitle>
                                                <CardDescription>Review your recent service history.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Service ID</TableHead>
                                                            <TableHead>Customer</TableHead>
                                                            <TableHead>Service</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Rating</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>SRV001</TableCell>
                                                            <TableCell>Charlie Brown</TableCell>
                                                            <TableCell>Tire Rotation</TableCell>
                                                            <TableCell>2023-06-10</TableCell>
                                                            <TableCell>5 stars</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>SRV002</TableCell>
                                                            <TableCell>Diana Prince</TableCell>
                                                            <TableCell>Engine Tune-up</TableCell>
                                                            <TableCell>2023-06-12</TableCell>
                                                            <TableCell>4 stars</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="profile">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Edit Profile</CardTitle>
                                                <CardDescription>
                                                    Update your personal information and availability.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <form className="space-y-4">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar className="h-20 w-20">
                                                            <AvatarImage
                                                                src="/placeholder-avatar.jpg"
                                                                alt={mechanicName}
                                                            />
                                                            <AvatarFallback>
                                                                {mechanicName
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <Button variant="outline">Change Photo</Button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="mechanic-name">Name</Label>
                                                        <Input
                                                            id="mechanic-name"
                                                            value={mechanicName}
                                                            onChange={(e) => setMechanicName(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="specialty">Specialty</Label>
                                                        <Input
                                                            id="specialty"
                                                            value={specialty}
                                                            onChange={(e) => setSpecialty(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="experience">Years of Experience</Label>
                                                        <Input
                                                            id="experience"
                                                            value={yearsOfExperience}
                                                            onChange={(e) => setYearsOfExperience(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            id="active-status"
                                                            checked={isActive}
                                                            onCheckedChange={setIsActive}
                                                        />
                                                        <Label htmlFor="active-status">Active Status</Label>
                                                    </div>
                                                    <Button type="submit">Save Changes</Button>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
