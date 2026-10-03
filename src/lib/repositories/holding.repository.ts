import 'server-only';
import { prisma } from '@/lib/prisma';

export function getHoldingForAsset(portfolioId: string, assetId: string) {
    return prisma.holding.findUnique({
        where: { portfolioId_assetId: { portfolioId, assetId } },
    });
}

export async function buyAsset(
    portfolioId: string,
    assetId: string,
    quantity: number,
    price: number,
) {
    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }
    if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Price must be greater than 0');
    }

    return prisma.$transaction(async (tx) => {
        const portfolio = await tx.portfolio.findUniqueOrThrow({
            where: { id: portfolioId },
        });
        const cost = quantity * price;
        if (portfolio.cashBalance.toNumber() < cost) {
            throw new Error('Insufficient funds');
        }

        const existing = await tx.holding.findUnique({
            where: { portfolioId_assetId: { portfolioId, assetId } },
        });

        if (existing) {
            const newShares = existing.shares.toNumber() + quantity;
            const newAvgCost =
                (existing.avgCost.toNumber() * existing.shares.toNumber() +
                    price * quantity) /
                newShares;

            await tx.holding.update({
                where: { id: existing.id },
                data: { shares: newShares, avgCost: newAvgCost },
            });
        } else {
            await tx.holding.create({
                data: {
                    portfolioId,
                    assetId,
                    shares: quantity,
                    avgCost: price,
                },
            });
        }

        await tx.portfolio.update({
            where: { id: portfolioId },
            data: { cashBalance: { decrement: quantity * price } },
        });

        return tx.transaction.create({
            data: { portfolioId, assetId, type: 'BUY', quantity, price },
        });
    });
}

export async function sellAsset(
    portfolioId: string,
    assetId: string,
    quantity: number,
    price: number,
) {
    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }
    if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Price must be greater than 0');
    }

    return prisma.$transaction(async (tx) => {
        const existing = await tx.holding.findUniqueOrThrow({
            where: { portfolioId_assetId: { portfolioId, assetId } },
        });

        const newShares = existing.shares.toNumber() - quantity;
        if (newShares < 0)
            throw new Error('Cannot sell more shares than owned');

        if (newShares === 0) {
            await tx.holding.delete({ where: { id: existing.id } });
        } else {
            await tx.holding.update({
                where: { id: existing.id },
                data: { shares: newShares },
            });
        }

        await tx.portfolio.update({
            where: { id: portfolioId },
            data: { cashBalance: { increment: quantity * price } },
        });

        return tx.transaction.create({
            data: { portfolioId, assetId, type: 'SELL', quantity, price },
        });
    });
}
