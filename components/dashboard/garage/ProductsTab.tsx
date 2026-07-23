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
import { productsApi, type Product } from '@/lib/api/products';

export function ProductsTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const list = await productsApi.list(token);
            setProducts(list);
            onCountChange?.(list.length);
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to load products');
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
        if (!name || !price) {
            toast.error('Name and price are required');
            return;
        }
        setSubmitting(true);
        try {
            await productsApi.create(token, { name, price: Number(price), description: description || undefined });
            toast.success('Product added');
            setName('');
            setPrice('');
            setDescription('');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to add product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await productsApi.remove(token, id);
            toast.success('Product deleted');
            await load();
        } catch (e: any) {
            toast.error(e.message ?? 'Failed to delete product');
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                    <CardDescription>Add a product to your garage catalog.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name</Label>
                                <Input id="productName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Brake Pads" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productPrice">Price</Label>
                                <Input id="productPrice" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="productDescription">Description</Label>
                            <Input id="productDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
                        </div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add Product
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>{products.length} product(s) in your catalog.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : products.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No products yet. Add your first product above.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>{p.price.toLocaleString()}</TableCell>
                                        <TableCell>{p.description ?? '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
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
