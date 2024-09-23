import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginResponse } from './auth';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: typeof window === 'undefined' ? 'http://localhost:8900' : window.location.origin
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, { email: string, password: string }>({
            query: ({ email, password }) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: { email, password }
            })
        }),
        getAuthData: builder.query<LoginResponse, { token: string }>({
        query: ({ token }) => ({
            url: '/api/auth/getAuthData',
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
            })  
        })
    }),
})

export const { useLoginMutation, useGetAuthDataQuery } = authApi;