'use server'

import { prisma } from '../prisma';
import { UserRole } from '@prisma/client/edge';


interface User {
    password: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
}


export const createUser = async (user: User) => {
    return prisma.user.create({
        data: {
            email: user.email,
            password: user.password,
            phoneNumber: user.phoneNumber,
            role: user.role
        }
    });
}


export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email
        }, 
        include: {
            garageOwners: true,
            mechanics: true,
            shopOwners: true
        }
    });
}



export const fetchUsersByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    });
}