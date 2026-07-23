'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { customersApi, type Customer } from '@/lib/api/customers';

export function CustomersTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [vehicleInfo, setVehicleInfo] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const list = await customersApi.list(token);
            setCustomers(list);
            onCountChange?.(list.length);
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to load customers');
        } finally {
            setLoading(false);
        }
    }, [token, onCountChange]);

    useEffect(() => {
        load();
    }, [load]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        if (!name) {
            toast.error('Name is required');
            return;
        }
        setSubmitting(true);
        try {
            await customersApi.create(token, { name, phoneNumber: phoneNumber || undefined, vehicleInfo: vehicleInfo || undefined });
            toast.success('Customer added');
            setName('');
            setPhoneNumber('');
            setVehicleInfo('');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to add customer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await customersApi.remove(token, id);
            toast.success('Customer deleted');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to delete customer');
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Add Customer</CardTitle>
                    <CardDescription>Record a walk-in customer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="custName">Name</Label>
                                <Input id="custName" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Mwangi" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="custPhone">Phone</Label>
                                <Input id="custPhone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+254..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="custVehicle">Vehicle Info</Label>
                            <Input id="custVehicle" value={vehicleInfo} onChange={(e) => setVehicleInfo(e.target.value)} placeholder="Toyota Corolla, KDA 123A" />
                        </div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add Customer
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>{customers.length} customer(s).</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : customers.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No customers yet. Add your first customer above.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{c.phoneNumber ?? '—'}</TableCell>
                                        <TableCell>{c.vehicleInfo ?? '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
