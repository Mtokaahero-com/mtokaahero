import { apiFetch } from './http';

export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    garageId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductInput {
    name: string;
    price: number;
    description?: string;
}

export const productsApi = {
    list: (token: string) => apiFetch<Product[]>('/garage/products', { token }),
    create: (token: string, body: ProductInput) => apiFetch<Product>('/garage/products', { method: 'POST', body, token }),
    update: (token: string, id: string, body: Partial<ProductInput>) =>
        apiFetch<Product>(`/garage/products/${id}`, { method: 'PATCH', body, token }),
    remove: (token: string, id: string) =>
        apiFetch<{ deleted: boolean }>(`/garage/products/${id}`, { method: 'DELETE', token }),
};
