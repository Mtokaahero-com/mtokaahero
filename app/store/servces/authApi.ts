import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_TOKEN, AUTH_REFRESH_TOKEN, setAuthCookie, getAuthCookie, removeCookies } from '@/lib/cookies';

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
export interface LoginResponse {
  profile: ProfileResponse;
  tokens: AuthTokens;
}

// Structure for profile data
interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  address: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Structure for authentication tokens
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Define the structure for an error response
export interface ErrorResponse {
  response: {
    message: string;
    error: string;
    statusCode: number;
  };
  status: number;
  message: string;
  name: string;
}

// A union type to handle both success and error cases
export type AuthApiResponse = LoginResponse | ErrorResponse;
