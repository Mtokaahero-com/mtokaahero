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
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ordersApi, type OrderListItem, type OrderStatus, type OrderItemInput } from '@/lib/api/orders';
import { productsApi, type Product } from '@/lib/api/products';
import { customersApi, type Customer } from '@/lib/api/customers';

const STATUSES: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

type DraftItem = { productId?: string; description: string; quantity: number; unitPrice?: number };

export function OrdersTab({ onStatsChange }: { onStatsChange?: (s: { pending: number; revenue: number }) => void }) {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // draft order state
    const [customerId, setCustomerId] = useState('');
    const [items, setItems] = useState<DraftItem[]>([{ description: '', quantity: 1 }]);

    const recomputeStats = useCallback((list: OrderListItem[]) => {
        const pending = list.filter((o) => o.status === 'PENDING').length;
        const revenue = list.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0);
        onStatsChange?.({ pending, revenue });
    }, [onStatsChange]);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [o, p, c] = await Promise.all([
                ordersApi.list(token),
                productsApi.list(token),
                customersApi.list(token),
            ]);
            setOrders(o);
            setProducts(p);
            setCustomers(c);
            recomputeStats(o);
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [token, recomputeStats]);

    useEffect(() => {
        load();
    }, [load]);

    const addItemRow = () => setItems((prev) => [...prev, { description: '', quantity: 1 }]);
    const updateItem = (idx: number, patch: Partial<DraftItem>) =>
        setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
    const removeItemRow = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

    // display-only running total (server is authoritative)
    const draftTotal = items.reduce((sum, it) => {
        const p = it.productId ? products.find((x) => x.id === it.productId) : undefined;
        const unit = p ? p.price : (it.unitPrice ?? 0);
        return sum + unit * (it.quantity || 0);
    }, 0);

    const handleCreate = async () => {
        if (!token) return;
        if (!customerId) {
            toast.error('Select a customer');
            return;
        }
        const payloadItems: OrderItemInput[] = items
            .filter((it) => it.description.trim().length > 0)
            .map((it) => {
                // guard against NaN / cleared inputs before sending to the server
                const quantity = Math.max(1, Math.floor(Number(it.quantity)) || 1);
                return it.productId
                    ? { productId: it.productId, description: it.description, quantity }
                    : { description: it.description, quantity, unitPrice: Math.max(0, Number(it.unitPrice) || 0) };
            });
        if (payloadItems.length === 0) {
            toast.error('Add at least one item with a description');
            return;
        }
        setSubmitting(true);
        try {
            await ordersApi.create(token, { customerId, items: payloadItems });
            toast.success('Order created');
            setDialogOpen(false);
            setCustomerId('');
            setItems([{ description: '', quantity: 1 }]);
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to create order');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatus = async (id: string, status: OrderStatus) => {
        if (!token) return;
        try {
            await ordersApi.update(token, id, { status });
            toast.success('Status updated');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await ordersApi.remove(token, id);
            toast.success('Order deleted');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to delete order');
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>{orders.length} order(s).</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={customers.length === 0}>
                            <Plus className="mr-2 h-4 w-4" /> New Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>New Order</DialogTitle>
                            <DialogDescription>Pick a customer and add line items.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Customer</Label>
                                <Select value={customerId} onValueChange={setCustomerId}>
                                    <SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Items</Label>
                                {items.map((it, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-4 space-y-1">
                                            <Label className="text-xs">Product (optional)</Label>
                                            <Select
                                                value={it.productId ?? 'adhoc'}
                                                onValueChange={(v) => {
                                                    if (v === 'adhoc') updateItem(idx, { productId: undefined });
                                                    else {
                                                        const p = products.find((x) => x.id === v);
                                                        updateItem(idx, { productId: v, description: it.description || p?.name || '' });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Ad-hoc" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="adhoc">Ad-hoc</SelectItem>
                                                    {products.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-xs">Description</Label>
                                            <Input value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })} />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Qty</Label>
                                            <Input type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Unit Price</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                disabled={!!it.productId}
                                                value={it.productId ? (products.find((x) => x.id === it.productId)?.price ?? 0) : (it.unitPrice ?? '')}
                                                onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Button variant="ghost" size="icon" onClick={() => removeItemRow(idx)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addItemRow}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Item
                                </Button>
                            </div>

                            <div className="text-right font-semibold">Estimated total: {draftTotal.toLocaleString()}</div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Create Order
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No orders yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.customer.name}</TableCell>
                                    <TableCell>{o.itemCount}</TableCell>
                                    <TableCell>{o.total.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Select value={o.status} onValueChange={(v) => handleStatus(o.id, v as OrderStatus)}>
                                            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {STATUSES.map((s) => (
                                                    <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)}>
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
    );
}
