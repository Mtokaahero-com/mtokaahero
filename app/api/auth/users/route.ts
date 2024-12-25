import { PrismaService } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { UserRole } from '@prisma/client/edge';
import 

interface userProps {
    password: string;
    email: string;
    phoneNumber: string;
    role: UserRole
}


export async function POST(req: NextRequest, ) {
    const {password, email, phoneNumber, role}: userProps = await req.json()

    if(!email || !phoneNumber || !role || !password) {
        return NextResponse.json({"error": "missing fields"}, { status: 400 });
    }

    const uniqueEmail = await PrismaService.user.findUnique({where:{ email}})
    const uniquePhone = await PrismaService.user.findUnique({where:{ phoneNumber}})
    


    if (uniqueEmail || uniquePhone) {
        return NextResponse.json({error: "Phone or Email already registered"}, {status: 400})
    }
    const user = await PrismaService.user.create({
        data: {
            password
        }
    })
}
