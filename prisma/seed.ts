import { PrismaService } from '@/lib/prisma';

async function main() {
    try {
        const seedDemoGarage = await PrismaService.garage.create({
            data: {
                garageName: 'KInungi Garage',
                // ownerFullName: 'John Doe',
                ownerFirstName: 'John',
                ownerLastName: 'Doe',
                address: 'KInungi',
                phoneNumber: '0712345678',
                email: 'kinungi@garage.com',
                garageDescription: 'We are the best garage in town',
                specialties: ['Engine Repair', 'Body Works', 'Painting'],
                logo: 'https://www.google.com',
                garageOwnerId: '9b706873-9b12-45fd-a5be-dccbe0917143',
            },
        });
    } catch (error) {
        console.log(error);
    }
}

main().catch((err) => console.log(err));
