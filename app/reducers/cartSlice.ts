import { CartItem, CartState } from '@/types/internalTypes';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '@/app/features/cartActions';

const calculateTotalItems = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
};

const initialState: CartState = {
    items: [],
    totalItems: 0,
};

export const cartReducer = (state = initialState, action: any): CartState => {
    switch (action.type) {
        case ADD_TO_CART:
            const existingItem = state.items.find((item) => item.id === action.payload.id);
            if (existingItem) {
                const updatedItems = state.items.map((item) =>
                    item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
                );
                return {
                    ...state,
                    items: updatedItems,
                    totalItems: calculateTotalItems(updatedItems),
                };
            }
            const newItems = [...state.items, { ...action.payload, quantity: 1 }];
            return {
                ...state,
                items: newItems,
                totalItems: calculateTotalItems(newItems),
            };

        case REMOVE_FROM_CART:
            const filteredItems = state.items.filter((item) => item.id !== action.payload);
            return {
                ...state,
                items: filteredItems,
                totalItems: calculateTotalItems(filteredItems),
            };

        case UPDATE_QUANTITY:
            const updatedItems = state.items.map((item) =>
                item.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item,
            );
            return {
                ...state,
                items: updatedItems,
                totalItems: calculateTotalItems(updatedItems),
            };

        default:
            return state;
    }
};
