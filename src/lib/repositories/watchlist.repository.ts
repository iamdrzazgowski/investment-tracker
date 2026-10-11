import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getWatchlist(portfolioId: string) {
    return prisma.watchlistItem.findMany({
        where: { portfolioId },
        include: { asset: true },
        orderBy: { addedAt: 'desc' },
    });
}

export async function isOnWatchlist(portfolioId: string, assetId: string) {
    const item = await prisma.watchlistItem.findUnique({
        where: { portfolioId_assetId: { portfolioId, assetId } },
    });
    return Boolean(item);
}

export async function addToWatchlist(portfolioId: string, assetId: string) {
    return prisma.watchlistItem.upsert({
        where: { portfolioId_assetId: { portfolioId, assetId } },
        create: { portfolioId, assetId },
        update: {},
        include: { asset: true },
    });
}

export async function removeFromWatchlist(
    portfolioId: string,
    assetId: string,
) {
    return prisma.watchlistItem.delete({
        where: { portfolioId_assetId: { portfolioId, assetId } },
    });
}
