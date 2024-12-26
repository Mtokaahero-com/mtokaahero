'use server';


import { PrismaService as prisma } from "../prisma";


export async function getUserByid(Id: string) {
    const user = await prisma.user.findUnique({ where: { id: Id } })
    
    if (user) {
        const {password, ...rest} = user;
        return rest;
    }
    return null;
}


export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({where: {email}, include: {Role: true}});
}