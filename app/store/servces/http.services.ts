import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_TOKEN, getAuthCookie } from '@/lib/cookies';
import { CloudinaryUploadResponse } from '@/types/responseTypes';



export const cloudinaryApi = createApi({
    reducerPath: 'cloudinaryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8900',
    }),
    endpoints: (builder) => ({
        upload: builder.mutation<CloudinaryUploadResponse, { file: File }>({
            query: ({ file }) => ({
                url: 'api/cloudinary/upload',
                method: 'POST',
                body: file,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        }),
        delete: builder.mutation<CloudinaryUploadResponse, { publicId: string }>({
            query: ({ publicId }) => ({
                url: `api/cloudinary/delete/${publicId}`,
                method: 'DELETE',
            })
        }),
    })
})