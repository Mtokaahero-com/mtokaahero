import { prisma } from '../prisma';

interface CreateUserInput {
    fullNames: string;
    phoneNumber: string;
    address: string;
    supportEmail: string;
    password: string;
    profilePicture?: string;
}

export const createUser = async (data: CreateUserInput) => {
    return await prisma.user.create({
        data: {
            role: 'GARAGE_OWNER',
            garageOwners: {
                create: {
                    fullNames: data.fullNames,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    supportEmail: data.supportEmail,
                    password: data.password,
                    profilePicture: data.profilePicture,
                },
            },
        },
    });
};



export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
    });
}


export const getUsers = async () => {
    return await prisma.user.findMany({
        include: {
            garageOwners: true,
            mechanics: true,
            shopOwners: true
        }
    });
}