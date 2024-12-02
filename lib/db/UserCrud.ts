import { prisma } from '../prisma';



export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
    });
}

// export const getUserByEmail = async (email: string) => {
//     return await prisma.user.findFirst({
//         include: {
//             garageOwners: true,
//             mechanics: true,
//             shopOwners: true,
//         },
//         where: {
//             OR: [
//                 {
//                     garageOwners: {
//                         some: {
//                             supportEmail: email,
//                         },
//                     },
//                 },
//                 {
//                     mechanics: {
//                         some: {
//                             supportEmail: email,
//                         },
//                     },
//                 },
//                 {
//                     shopOwners: {
//                         some: {
//                             supportEmail: email,
//                         }
//                     },
//                 },
//             ],
//         },
//     });
// }


export const getUserByEmail = async(email: string)=>{
    return prisma.user.findUnique({
        where: {
            email
        }
    })
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