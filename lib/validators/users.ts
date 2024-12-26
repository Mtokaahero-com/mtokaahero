'use server'

import { PrismaService as prisma } from "../prisma";

export const validateEmail= async(email: string): Promise<Boolean> =>{
    const user = await prisma.user.findUnique({ where: { email } }); 

    if (user) {
        return false;
    } 
    return true;
}


export async function getRole(roleId: string) {
    return await prisma.roles.findUnique({
        where: {id: roleId}, 
    })
}