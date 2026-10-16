import 'server-only';
import { prisma } from '@/lib/prisma';

/** Czasy wszystkich transakcji portfela (Unix ms, rosnąco). */
export async function getTransactionTimes(
    portfolioId: string,
): Promise<number[]> {
    const rows = await prisma.transaction.findMany({
        where: { portfolioId },
        select: { executedAt: true },
        orderBy: { executedAt: 'asc' },
    });
    return rows.map((r) => r.executedAt.getTime());
}

export function getTransactionsForPortfolio(portfolioId: string, take = 200) {
    return prisma.transaction.findMany({
        where: { portfolioId },
        include: { asset: true },
        orderBy: { executedAt: 'desc' },
        take,
    });
}
