import { CloudinaryUploadResponse } from "@/types/responseTypes";
import { createSlice } from "@reduxjs/toolkit";
import { cloudinaryApi } from "../servces/http.services";


const initialState: Partial<CloudinaryUploadResponse> = {};


const httpSlice = createSlice({
    name: 'http',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addMatcher(cloudinaryApi.endpoints.upload.matchFulfilled, (_state, { payload }) => {
                console.log(payload);
                return payload;
            })
            .addMatcher(cloudinaryApi.endpoints.delete.matchFulfilled, (_state, { payload }) => {
                return payload;
            })
    }
})


export const httpReducer = httpSlice.reducer;
export const {} = httpSlice.actions;