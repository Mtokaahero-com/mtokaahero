'use server';

import { PrismaService } from '../prisma';

export async function getRoles() {
    return await PrismaService.roles.findMany({});
}
