import { apiFetch } from './client';

export interface SupportMessageInput {
    name: string;
    email: string;
    topic: 'RESCUE' | 'ORDER' | 'PARTNER' | 'ACCOUNT' | 'OTHER';
    message: string;
}

export const supportApi = {
    send: (input: SupportMessageInput) =>
        apiFetch<{ id: string; ticket: string }>('/support/messages', { method: 'POST', body: input }),
};
