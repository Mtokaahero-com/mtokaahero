import { PrismaService } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { generateSubscriptionString } from '@/services/jwt.service';

interface garageProps {
    garageName: string;
    ownerFullName: string;
    address: string;
    phoneNumber: string;
    email: string;
    garageDescription: string;
    specialties: string[];
    logo: string;
    garageOwnerId: string;
}

export async function POST(req: NextRequest) {
    try {
        const {
            garageName,
            ownerFullName,
            address,
            phoneNumber,
            email,
            garageDescription,
            specialties,
            logo,
            garageOwnerId,
        }: garageProps = await req.json();

        if (
            !garageName ||
            !ownerFullName ||
            !address ||
            !phoneNumber ||
            !email ||
            !garageDescription ||
            !specialties ||
            !logo ||
            !garageOwnerId
        ) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const validAdmin = await PrismaService.user.findFirst({
            where: {
                id: garageOwnerId,
            },
        });

        if (!validAdmin) {
            return NextResponse.json({ error: 'Admin not found.' }, { status: 401 });
        }

        const garage = await PrismaService.garage.create({
            data: {
                garageName,
                ownerFullName,
                address,
                phoneNumber,
                email,
                garageDescription,
                specialties: {
                    set: specialties,
                },
                logo,
                garageOwnerId,
            },
            include: {
                garageOwner: true,
            },
        });

        const subscriptionString = await generateSubscriptionString(garage.id, '30d');

        const subscription = await PrismaService.subscription.create({
            data: {
                subscriptionUniqueString: subscriptionString,
                garageId: garage.id,
            },
        });

        return NextResponse.json({
            message: 'Garage created successfully.',
            garage: {
                id: garage.id,
                garageName: garage.garageName,
                ownerFullName: garage.ownerFullName,
                address: garage.address,
                phoneNumber: garage.phoneNumber,
                email: garage.email,
                garageDescription: garage.garageDescription,
                specialties: garage.specialties,
                logo: garage.logo,
                garageOwnerId: garage.garageOwnerId,
            },

            subscription: {
                id: subscription.id,
                subscriptionUniqueString: subscription.subscriptionUniqueString,
                garageId: subscription.garageId,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
