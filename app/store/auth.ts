import { createSlice } from '@reduxjs/toolkit';
import {setCookie } from 'cookies-next';
import { authApi } from './authApi';

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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (_state, { payload }) => {
                // set the token in the cookies
                setAuthCookie(payload.token, 'auth_token');
                return payload;
            })
            .addMatcher(authApi.endpoints.getAuthData.matchFulfilled, (_state, { payload }) => {
                // in case we receive a new token when refetching the details
                setAuthCookie(payload.token, 'auth_token');
                return payload;
            });
    },
});

export const authReducer = slice.reducer;