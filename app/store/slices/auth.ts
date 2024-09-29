import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setAuthCookie, removeCookies, AUTH_TOKEN, AUTH_REFRESH_TOKEN } from '@/lib/cookies';
import { authApi } from '../servces/authApi';
import { LoginResponse } from '@/types/authTypes';
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
                if (payload.response?.statusCode !== 200) {
                    return {
                        response: payload.response,
                    };
                } 
                setAuthCookie(payload.backendTokens.accessToken, AUTH_TOKEN);
                setAuthCookie(payload.backendTokens.refreshToken, AUTH_REFRESH_TOKEN);

            })
            .addMatcher(authApi.endpoints.register.matchFulfilled, (_state, { payload }) => {
                if (!payload) return initialState;
                if (payload.response?.error || payload.response?.statusCode != 201) {
                    return { response: payload.response };
                }
            })
            .addMatcher(authApi.endpoints.refreshAuthToken.matchFulfilled, (_state, { payload }) => {
                if (!payload) return initialState;

                setAuthCookie(payload.backendTokens.accessToken, AUTH_TOKEN);
                setAuthCookie(payload.backendTokens.refreshToken, AUTH_REFRESH_TOKEN);

                return payload;
            })
            .addMatcher(authApi.endpoints.getAuthData.matchRejected, (state, { error }) => {
                if (error?.code === '401') {
                    // Handle 401 unauthorized by logging out
                    removeCookies([AUTH_TOKEN, AUTH_REFRESH_TOKEN]);
                    return initialState;
                }
            });
    },
});

export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
