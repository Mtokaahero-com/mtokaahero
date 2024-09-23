import { createSlice } from '@reduxjs/toolkit';

type LoginResponse = {
    token: string;
    userEmail: string;
    userName: string;
    userRole: string;
    id: string;
}


const initialState: Partial<LoginResponse> = {}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {}
})