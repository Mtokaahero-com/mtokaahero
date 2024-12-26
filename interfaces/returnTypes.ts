

export interface RoleInterface {
    id: string;
    name: string;
}


export interface UserInterface{
    id: string;
    userName: string;
    email: string
    phoneNumber: string;
    roleId: string;
}