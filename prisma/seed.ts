import { PrismaService } from "@/lib/prisma";



async function main() {
    const seedRoles = await PrismaService.roles.createMany({
        data: [
            { name: 'mechanic' },
            { name: 'garage owner' },
            {name: 'shop owner'}
        ]
    })
}


main().catch((err)=> console.log(err))