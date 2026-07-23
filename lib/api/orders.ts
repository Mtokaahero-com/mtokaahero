import { apiFetch } from './http';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface OrderListItem {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    customer: { id: string; name: string };
    itemCount: number;
}

export interface OrderItemInput {
    productId?: string;
    serviceId?: string;
    description: string;
    quantity: number;
    unitPrice?: number;
}

export interface OrderDetail {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    customer: { id: string; name: string; phoneNumber?: string | null; vehicleInfo?: string | null };
    items: Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        product?: { id: string; name: string } | null;
        service?: { id: string; description: string } | null;
    }>;
}

export interface CreateOrderInput {
    customerId: string;
    status?: OrderStatus;
    items: OrderItemInput[];
}

export const ordersApi = {
    list: (token: string) => apiFetch<OrderListItem[]>('/garage/orders', { token }),
    get: (token: string, id: string) => apiFetch<OrderDetail>(`/garage/orders/${id}`, { token }),
    create: (token: string, body: CreateOrderInput) => apiFetch<OrderDetail>('/garage/orders', { method: 'POST', body, token }),
    update: (token: string, id: string, body: { status?: OrderStatus; items?: OrderItemInput[] }) =>
        apiFetch<OrderDetail>(`/garage/orders/${id}`, { method: 'PATCH', body, token }),
    remove: (token: string, id: string) =>
        apiFetch<{ deleted: boolean }>(`/garage/orders/${id}`, { method: 'DELETE', token }),
};
