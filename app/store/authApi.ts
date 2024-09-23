import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin
    }),
    endpoints: (builder) => ({})
})