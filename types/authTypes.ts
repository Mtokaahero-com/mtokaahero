




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




export interface RegisterResponse extends Partial<LoginResponse> {}