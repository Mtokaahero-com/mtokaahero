export interface ExpectedProfileProps {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
    token: string;
}

export interface ExpectedAsCloudinaryResponse {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: [];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    original_filename: string;
    eager: [];
    eager_async: boolean;
    eager_notification_url: string;
    customCoordinates: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface ValidationAuthProps {
    payload: {
        email: string;
        role: string;
        id: number;
        iat: number;
        exp: number;
    } | null;
    error: string | null;
    message: string;
    statusCode: number;
}

export interface ExpectedAsProductTypes {
    id: number;
    productName: string;
    productDescription: string;
    productPrice: number;
    productImage: string;
    productCategory: string;
    productStatus: string;
    garageId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ExpectedMechanicProps {
    id: number;
    name: string;
    email?: string;
    specialty: string;
    image: string;
}
