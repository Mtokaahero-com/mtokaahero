export interface customerObject {
    httpStatus: number
    access_token: string
    customer: {
        id: number
        firstName: string
        role: string
        lastName: string
        email: string
        phone: string
        profilePicture: string | null
        address: string
        isActive: boolean
        createdAt: string
        updatedAt: string
    }
}

export interface defaultLoginObject {
    //?  applies to customer, mechanic and garage login
    message: string
    httpStatus: number
    accessToken: string
}

export interface defaultValidateObject {
    error: string
    message: string
    statucCode: number
    payload: {
        id: number
        email: string
        role: string
        iat: number
    }
}
