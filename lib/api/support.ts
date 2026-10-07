import { marketplaceFetch } from './client';

export interface SupportMessageInput {
    name: string;
    email: string;
    topic: 'RESCUE' | 'ORDER' | 'PARTNER' | 'ACCOUNT' | 'OTHER';
    message: string;
}

export const supportApi = {
    send: (input: SupportMessageInput) => marketplaceFetch<{ id: string; ticket: string }>('/support/messages', { method: 'POST', body: input }),
};
