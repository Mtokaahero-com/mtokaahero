'use client';

import { configureStore, combineReducers, applyMiddleware } from '@reduxjs/toolkit';
import { cartReducer } from '@/app/reducers/cartSlice';

const rootReducer = combineReducers({
    cart: cartReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
