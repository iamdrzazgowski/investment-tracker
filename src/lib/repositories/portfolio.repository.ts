import 'server-only';
import { prisma } from '@/lib/prisma';

export async function createPortfolio(userId: string) {
    return prisma.portfolio.create({
        data: { userId },
    });
}

export async function getPortfolioByUserId(userId: string) {
    return prisma.portfolio.findUnique({
        where: { userId },
    });
}

export async function addFundsToPortfolio(
    portfolioId: string,
    balance: number,
) {
    return prisma.portfolio.update({
        where: { id: portfolioId },
        data: { cashBalance: { increment: balance } },
    });
}
