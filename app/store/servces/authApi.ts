import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_TOKEN, getAuthCookie, } from '@/lib/cookies';
import { LoginResponse, RegisterResponse } from '@/types/authTypes';
// API call structure
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8900',
        prepareHeaders: (headers) => {
            const token = getAuthCookie(AUTH_TOKEN);
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
  endpoints: (builder) => ({
  
        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: 'api/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    register: builder.mutation<RegisterResponse, { email: string; password:string }>({
            query: (credentials) => ({
                url: 'api/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        refreshAuthToken: builder.mutation<LoginResponse, { refreshToken: string }>({
            query: (refreshToken) => ({
                url: 'api/auth/refresh',
                method: 'POST',
                body: { refreshToken },
            }),
        }),
        getAuthData: builder.query<LoginResponse, void>({
            query: () => 'api/auth-details',
        }),
    }),
});

export const { useLoginMutation, useRefreshAuthTokenMutation, useGetAuthDataQuery } = authApi;


// Define the structure for a successful login response
