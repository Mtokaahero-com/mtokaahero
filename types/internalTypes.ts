import { ExpectedAsProductTypes as Product } from './foreignTypes';

export interface CartItem extends Product {
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
}
