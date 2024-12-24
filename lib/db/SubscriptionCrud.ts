import { prisma } from "../prisma";



interface createSubscriptionInput {
    userId: string;
    planId: string;
}

function calculateEndDateFromNow(months: number) {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
}


export const createSubscription = async (data: createSubscriptionInput) => {
    return await prisma.subscription.create({
        data: {
            startDate: new Date(),
            endDate: calculateEndDateFromNow(1),
            user: {
                connect: {
                    id: data.userId
                }
            },
            Plan: {
                connect: {
                    id: data.planId
                }
            }
        }
    });
}


export const getSubscriptionById = async (id: string) => {
    return await prisma.subscription.findUnique({
        where: { id }
    });
}


export const getSubscriptions = async () => {
    return await prisma.subscription.findMany({
        include: {
            user: true,
            Plan: true
        }
    });
}
