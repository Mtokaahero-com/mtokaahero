import { PrismaService } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import * as bcryptjs from 'bcryptjs';

interface UserProps {
    userName: string;
    password: string;
    email: string;
    phoneNumber: string;
    roleId: string;
}

export async function POST(req: NextRequest) {
    try {
        // Parse and validate request body
        const { password, email, phoneNumber, roleId, userName }: UserProps = await req.json();

        if (!email || !phoneNumber || !roleId || !password || !userName) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        // Check for existing user by email or phone number
        const existingUser = await PrismaService.user.findFirst({
            where: {
                OR: [{ email }, { phoneNumber }],
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email or phone number already registered.' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Create the new user
        const newUser = await PrismaService.user.create({
            data: {
                userName,
                email,
                phoneNumber,
                password: hashedPassword,
                roleId,
            },
            include: {
                Role: true,
            },
        });

        return NextResponse.json({
            message: 'User created successfully.',
            user: {
                id: newUser.id,
                userName: newUser.userName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                roleId: newUser.roleId,
            },
        });
    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user. Please try again later.' }, { status: 500 });
    }
}
