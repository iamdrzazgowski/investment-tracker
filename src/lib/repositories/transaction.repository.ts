import 'server-only';
import { prisma } from '@/lib/prisma';

export function getTransactionsForPortfolio(portfolioId: string, take = 200) {
    return prisma.transaction.findMany({
        where: { portfolioId },
        include: { asset: true },
        orderBy: { executedAt: 'desc' },
        take,
    });
}
