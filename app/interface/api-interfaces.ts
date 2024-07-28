 

export interface customerObject{
    access_token: string;
    customer:{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profilePicture: string | null;
        address: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }
}
 

export interface defaultLoginObject{
    //?  applies to customer, mechanic and garage login
    message: string;
    httpStatus: number;
    accessToken: string;
}