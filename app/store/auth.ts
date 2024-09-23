import { createSlice } from '@reduxjs/toolkit';
import {setCookie } from 'cookies-next';

export type LoginResponse = {
    token: string;
    userEmail: string;
    userName: string;
    userRole: string;
    id: string;
}

const setAuthCookie = (token: string, userRole: string) => {
    const tobase64 = Buffer.from(token).toString('base64');

    setCookie(userRole, tobase64, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: true,
        httpOnly: true
    });

}


const initialState: Partial<LoginResponse> = {}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {}
})

export const authReducer = slice.reducer;