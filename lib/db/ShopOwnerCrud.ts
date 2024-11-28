import { prisma } from "../prisma";
import bcrypt  from 'bcryptjs'

interface CreateShopOwnerInput {
    fullNames: string;
    phoneNumber: string;
    address: string;
    email: string;
    password: string;
    profilePicture?: string;
}

export const createShopOwner = async (data: CreateShopOwnerInput) => {
    return await prisma.shopOwner.create({
        data: {
            fullNames: data.fullNames,
            phoneNumber: data.phoneNumber,
            address: data.address,
            email: data.email,
            password: await bcrypt.hash(data.password, 10),
            profilePicture: data.profilePicture,
            user: {
                create: {
                    role: 'SHOP_OWNER'
                }
            },
        },
    });
};