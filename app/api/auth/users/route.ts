import { PrismaService } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import * as bcryptjs from 'bcryptjs';

interface userProps {
    userName: string;
    password: string;
    email: string;
    phoneNumber: string;
    roleId: string;
}

export async function POST(req: NextRequest) {
    const { password, email, phoneNumber, roleId, userName }: userProps = await req.json();

    if (!email || !phoneNumber || !roleId || !password || !userName) {
        return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const uniqueEmail = await PrismaService.user.findUnique({ where: { email } });
    const uniquePhone = await PrismaService.user.findUnique({ where: { phoneNumber } });

    if (uniqueEmail || uniquePhone) {
        return NextResponse.json({ error: 'Phone or Email already registered' }, { status: 400 });
    }
    const user = await PrismaService.user
        .create({
            data: {
                userName: userName,
                password: password,
                email: email,
                phoneNumber: (await bcryptjs.hashSync(password, 20)),
                roleId: roleId,
            },
        })
        .then((user) => {
            return user;
        })
        .catch((error) => {
            return NextResponse.json({ err: error }, { status: 400 });
        });
}
