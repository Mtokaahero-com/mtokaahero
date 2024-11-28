'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Moon, Sun, Settings, Plus, DollarSign, ShoppingCart, Package, Wrench, Users, User } from 'lucide-react';

// Create a context for the theme
const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
});

// Theme provider component
import { ReactNode } from 'react';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the theme
const useTheme = () => useContext(ThemeContext);

export default function Component() {
    return (
        <ThemeProvider>
            <GarageSaasAdmin />
        </ThemeProvider>
    );
}

function GarageSaasAdmin() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold mb-6">Garage Admin</h1>
                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Button variant="ghost" className="w-full justify-start">
                                    <DollarSign className="mr-2 h-4 w-4" /> Payments
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost" className="w-full justify-start">
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Orders
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Package className="mr-2 h-4 w-4" /> Products
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Wrench className="mr-2 h-4 w-4" /> Services
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" /> Customers
                                </Button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Dashboard</h2>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Billing</DropdownMenuItem>
                                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Report an Issue</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Profile</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Log Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <div className="p-6 space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground">3 require attention</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">145</div>
                                    <p className="text-xs text-muted-foreground">5 low in stock</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">573</div>
                                    <p className="text-xs text-muted-foreground">+201 this week</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs for different sections */}
                        <Tabs defaultValue="orders" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                                <TabsTrigger value="services">Completed Services</TabsTrigger>
                                <TabsTrigger value="products">Manage Products</TabsTrigger>
                            </TabsList>
                            <TabsContent value="orders" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Orders</CardTitle>
                                        <CardDescription>You have 12 pending orders.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Order ID</TableHead>
                                                    <TableHead>Customer</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>#1234</TableCell>
                                                    <TableCell>John Doe</TableCell>
                                                    <TableCell>Pending</TableCell>
                                                    <TableCell>$120.00</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>#1235</TableCell>
                                                    <TableCell>Jane Smith</TableCell>
                                                    <TableCell>Processing</TableCell>
                                                    <TableCell>$85.50</TableCell>
                                                </TableRow>
                                                {/* Add more rows as needed */}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="services" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Completed Services</CardTitle>
                                        <CardDescription>Recent services completed by your garage.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Service ID</TableHead>
                                                    <TableHead>Customer</TableHead>
                                                    <TableHead>Service Type</TableHead>
                                                    <TableHead>Completion Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>#S001</TableCell>
                                                    <TableCell>Alice Johnson</TableCell>
                                                    <TableCell>Oil Change</TableCell>
                                                    <TableCell>2023-06-15</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>#S002</TableCell>
                                                    <TableCell>Bob Williams</TableCell>
                                                    <TableCell>Brake Repair</TableCell>
                                                    <TableCell>2023-06-14</TableCell>
                                                </TableRow>
                                                {/* Add more rows as needed */}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="products" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Manage Products</CardTitle>
                                        <CardDescription>Add or edit products and services.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="productName">Product Name</Label>
                                                    <Input id="productName" placeholder="Enter product name" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="productPrice">Price</Label>
                                                    <Input id="productPrice" type="number" placeholder="0.00" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="productDescription">Description</Label>
                                                <Input
                                                    id="productDescription"
                                                    placeholder="Enter product description"
                                                />
                                            </div>
                                            <Button type="submit">
                                                <Plus className="mr-2 h-4 w-4" /> Add Product
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Information</CardTitle>
                                <CardDescription>Manage your payment method and view upcoming charges.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Current Payment Method</p>
                                        <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                                    </div>
                                    <Button variant="outline">Update</Button>
                                </div>
                                <div>
                                    <p className="font-semibold">Next Payment Due</p>
                                    <p className="text-sm text-muted-foreground">$49.99 on July 1, 2023</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
