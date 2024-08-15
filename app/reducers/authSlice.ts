import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    user: any;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    loading: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; user: any }>) {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        validateAuthToken(state, action: PayloadAction<{ token: string; user: any }>) {},
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        logout(state) {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});
