import { PrismaService } from "../prisma";



export async function getRoles(){
    await PrismaService.roles.findMany({})
}