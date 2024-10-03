export interface LoginResponse {
    profile: ProfileResponse;
    backendTokens: AuthTokens;
    response: {
        message: string;
        error: string;
        statusCode: number;
    };
    status: number;
    message: string;
    name: string;
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

export interface RegisterResponse {
        message: string;
        statusCode: number;
}

export interface CloudinaryUploadResponse {
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