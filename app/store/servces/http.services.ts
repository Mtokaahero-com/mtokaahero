import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CloudinaryUploadResponse } from '@/types/responseTypes';



export const cloudinaryApi = createApi({
    reducerPath: 'cloudinaryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8900',
    }),
    endpoints: (builder) => ({
        upload: builder.mutation<CloudinaryUploadResponse, { file: File }>({
            query: ({ file }) => ({
                url: '/api/image/upload',
                method: 'POST',
                body: file,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        }),
        delete: builder.mutation<CloudinaryUploadResponse, { publicId: string }>({
            query: ({ publicId }) => ({
                url: `/api/image/delete/${publicId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useUploadMutation, useDeleteMutation } = cloudinaryApi;