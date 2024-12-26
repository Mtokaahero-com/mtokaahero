import { PrismaService as prisma } from "../prisma";

export const validateEmail= async(email: string): Promise<Boolean> =>{
    const user = await prisma.user.findUnique({ where: { email } }); 

    if (user) {
        return false;
    } 
    return true;
}