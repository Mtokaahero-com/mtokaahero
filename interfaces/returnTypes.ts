export interface RoleInterface {
    id: string;
    name: string;
}

export interface UserInterface {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    roleId: string;
}

export interface GarageInterface {
    id: string;
    garageName: string;
    ownerFullName: string;
    address: string;
    phoneNumber: string;
    email: string;
    garageDescription: string;
    specialties: string[];
    logo: string;
    garageOwnerId: string;
}
