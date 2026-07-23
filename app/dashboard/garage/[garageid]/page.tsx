'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Settings, DollarSign, ShoppingCart, Package, Wrench, Users, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '@/components/fragments/LogoutButton';
import { ProductsTab } from '@/components/dashboard/garage/ProductsTab';
import { CustomersTab } from '@/components/dashboard/garage/CustomersTab';
import { OrdersTab } from '@/components/dashboard/garage/OrdersTab';
import { productsApi } from '@/lib/api/products';
import { customersApi } from '@/lib/api/customers';
import { ordersApi } from '@/lib/api/orders';

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
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [revenue, setRevenue] = useState(0);

    // Fetch all metrics up-front so the headline cards are correct on first
    // paint — the tabs only mount (and report their counts) once visited, so
    // we can't rely on their callbacks alone for the initial numbers.
    useEffect(() => {
        if (!token) return;
        let active = true;
        (async () => {
            try {
                const [products, customers, orders] = await Promise.all([
                    productsApi.list(token),
                    customersApi.list(token),
                    ordersApi.list(token),
                ]);
                if (!active) return;
                setProductCount(products.length);
                setCustomerCount(customers.length);
                setPendingOrders(orders.filter((o) => o.status === 'PENDING').length);
                setRevenue(orders.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0));
            } catch {
                // metric cards stay at their current values; individual tabs surface errors
            }
        })();
        return () => {
            active = false;
        };
    }, [token]);

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
                            <li>
                                <LogoutButton />
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
                                    <div className="text-2xl font-bold">{revenue.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">Gross order value (excl. cancelled)</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{pendingOrders}</div>
                                    <p className="text-xs text-muted-foreground">Orders awaiting action</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{productCount}</div>
                                    <p className="text-xs text-muted-foreground">In your catalog</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{customerCount}</div>
                                    <p className="text-xs text-muted-foreground">Total customers</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs for different sections */}
                        <Tabs defaultValue="orders" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                                <TabsTrigger value="customers">Customers</TabsTrigger>
                                <TabsTrigger value="products">Products</TabsTrigger>
                            </TabsList>
                            <TabsContent value="orders">
                                <OrdersTab onStatsChange={({ pending, revenue }) => { setPendingOrders(pending); setRevenue(revenue); }} />
                            </TabsContent>
                            <TabsContent value="customers">
                                <CustomersTab onCountChange={setCustomerCount} />
                            </TabsContent>
                            <TabsContent value="products">
                                <ProductsTab onCountChange={setProductCount} />
                            </TabsContent>
                        </Tabs>

                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payments</CardTitle>
                                <CardDescription>Payment tracking is coming soon.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Recording payments against orders will be available in a future update.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
