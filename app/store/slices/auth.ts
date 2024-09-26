import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setAuthCookie, removeCookies, AUTH_TOKEN, AUTH_REFRESH_TOKEN } from '@/lib/cookies';
import { authApi } from '../servces/authApi';
import { LoginResponse } from '../servces/authApi';

const initialState: Partial<LoginResponse> = {};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            removeCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (_state, { payload }) => {
                if (!payload) return initialState;

                setAuthCookie(payload.tokens.accessToken, AUTH_TOKEN);
                setAuthCookie(payload.tokens.refreshToken, AUTH_REFRESH_TOKEN);

                return payload;
            })
            .addMatcher(authApi.endpoints.refreshAuthToken.matchFulfilled, (_state, { payload }) => {
                if (!payload) return initialState;

                setAuthCookie(payload.tokens.accessToken, AUTH_TOKEN);
                setAuthCookie(payload.tokens.refreshToken, AUTH_REFRESH_TOKEN);

                return payload;
            })
            .addMatcher(authApi.endpoints.getAuthData.matchRejected, (state, { error }) => {
                if (error?.code === "401") {
                    // Handle 401 unauthorized by logging out
                    removeCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
                    return initialState;
                }
            });
    },
});

export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
