import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}