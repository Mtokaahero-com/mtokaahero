import { apiFetch } from './http';

export interface Customer {
    id: string;
    name: string;
    phoneNumber?: string | null;
    vehicleInfo?: string | null;
    garageId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerInput {
    name: string;
    phoneNumber?: string;
    vehicleInfo?: string;
}

export const customersApi = {
    list: (token: string) => apiFetch<Customer[]>('/garage/customers', { token }),
    create: (token: string, body: CustomerInput) => apiFetch<Customer>('/garage/customers', { method: 'POST', body, token }),
    update: (token: string, id: string, body: Partial<CustomerInput>) =>
        apiFetch<Customer>(`/garage/customers/${id}`, { method: 'PATCH', body, token }),
    remove: (token: string, id: string) =>
        apiFetch<{ deleted: boolean }>(`/garage/customers/${id}`, { method: 'DELETE', token }),
};
