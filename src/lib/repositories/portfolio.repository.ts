import { prisma } from '../prisma';

export async function createPortfolio(userId: string) {
    return prisma.portfolio.create({
        data: { userId },
    });
}
