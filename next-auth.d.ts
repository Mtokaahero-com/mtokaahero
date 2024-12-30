import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            userName: string;
            phoneNumber: string;
            role: {
                id: string;
                name: string;
            };
            mechanic?: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
                experienceYears: number;
                address: string;
                location: string;
                profilePicture?: string;
            };
            shopOwner?: {
                id: string;
                firstName: string;
                lastName: string;
                address: string;
                profilePicture?: string;
            };
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        userName: string;
        phoneNumber: string;
        roleId: string;
        role: {
            id: string;
            name: string;
        };
        garageOwner?: {
            id: string;
            firstName: string;
            lastName: string;
            address: string;
            profilePicture?: string;
        };
        mechanic?: {
            id: string;
            firstName: string;
            lastName: string;
            specialization: string;
            experienceYears: number;
            address: string;
            location: string;
            profilePicture?: string;
        };
        shopOwner?: {
            id: string;
            firstName: string;
            lastName: string;
            address: string;
            profilePicture?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        userName: string;
        phoneNumber: string;
        roleId: string;
        role: {
            id: string;
            name: string;
        };
        garageOwner?: {
            id: string;
            firstName: string;
            lastName: string;
            address: string;
            profilePicture?: string;
        };
        mechanic?: {
            id: string;
            firstName: string;
            lastName: string;
            specialization: string;
            experienceYears: number;
            address: string;
            location: string;
            profilePicture?: string;
        };
        shopOwner?: {
            id: string;
            firstName: string;
            lastName: string;
            address: string;
            profilePicture?: string;
        };
    }
}
