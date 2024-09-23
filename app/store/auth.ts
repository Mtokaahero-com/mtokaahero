import { createSlice } from '@reduxjs/toolkit';
import {setCookie } from 'cookies-next';

export type LoginResponse = {
    token: string;
    userEmail: string;
    userName: string;
    userRole: string;
    id: string;
}

const setAuthCookie = (token: string, role: string) => {
    const tobase64 = Buffer.from(token).toString('base64');
}


const initialState: Partial<LoginResponse> = {}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {}
})

export const authReducer = slice.reducer;