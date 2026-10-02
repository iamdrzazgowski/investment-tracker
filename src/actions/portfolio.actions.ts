'use server';

import { auth } from '@/lib/auth';
import { requirePortfolio } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { buyAsset, sellAsset } from '@/lib/repositories/holding.repository';
import {
    addFundsToPortfolio,
    getPortfolioByUserId,
} from '@/lib/repositories/portfolio.repository';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

type AddFundsState = {
    success: boolean;
    error?: string;
};

const addFundsSchema = z.object({
    balance: z
        .number({
            error: 'Amount must be a number',
        })
        .positive('Amount must be greater than 0')
        .finite('Amount must be a valid number')
        .refine(
            (value) => Number.isInteger(value * 100),
            'Amount can have at most 2 decimal places',
        ),
});

export async function addFundsAction(balance: number): Promise<AddFundsState> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            success: false,
            error: 'Unauthorized',
        };
    }

    const result = addFundsSchema.safeParse({ balance });

    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0]?.message ?? 'Invalid amount',
        };
    }

    const portfolio = await getPortfolioByUserId(session.user.id);

    if (!portfolio) {
        return {
            success: false,
            error: 'Portfolio not found',
        };
    }

    try {
        await addFundsToPortfolio(portfolio.id, result.data.balance);

        return {
            success: true,
        };
    } catch (error) {
        console.error('Failed to add funds:', error);

        return {
            success: false,
            error: 'Failed to add funds',
        };
    }
}

export async function buyAction(
    ticker: string,
    quantity: number,
    price: number,
) {
    const [portfolio, asset] = await Promise.all([
        requirePortfolio(),
        prisma.asset.findUniqueOrThrow({ where: { ticker } }),
    ]);

    await buyAsset(portfolio.id, asset.id, quantity, price);

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath(`/asset/${ticker}`);
}

export async function sellAction(
    ticker: string,
    quantity: number,
    price: number,
) {
    const [portfolio, asset] = await Promise.all([
        requirePortfolio(),
        prisma.asset.findUniqueOrThrow({ where: { ticker } }),
    ]);

    await sellAsset(portfolio.id, asset.id, quantity, price);

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath(`/asset/${ticker}`);
}
