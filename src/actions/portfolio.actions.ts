'use server';

import { requirePortfolio } from '@/lib/auth-helpers';
import { getAssetByTicker } from '@/lib/repositories/asset.repository';
import { buyAsset, sellAsset } from '@/lib/repositories/holding.repository';
import { addFundsToPortfolio } from '@/lib/repositories/portfolio.repository';
import {
    addFundsSchema,
    tradeSchema,
} from '@/lib/validations/portfolio';
import { revalidatePath } from 'next/cache';

type AddFundsState = {
    success: boolean;
    error?: string;
};

export async function addFundsAction(balance: number): Promise<AddFundsState> {
    const result = addFundsSchema.safeParse({ balance });

    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0]?.message ?? 'Invalid amount',
        };
    }

    let portfolioId: string;
    try {
        const portfolio = await requirePortfolio();
        portfolioId = portfolio.id;
    } catch {
        return {
            success: false,
            error: 'Unauthorized',
        };
    }

    try {
        await addFundsToPortfolio(portfolioId, result.data.balance);

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
    const parsed = tradeSchema.safeParse({ ticker, quantity, price });
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? 'Invalid trade');
    }

    const [portfolio, asset] = await Promise.all([
        requirePortfolio(),
        getAssetByTicker(parsed.data.ticker),
    ]);

    await buyAsset(portfolio.id, asset.id, parsed.data.quantity, parsed.data.price);

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath(`/asset/${parsed.data.ticker}`);
}

export async function sellAction(
    ticker: string,
    quantity: number,
    price: number,
) {
    const parsed = tradeSchema.safeParse({ ticker, quantity, price });
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? 'Invalid trade');
    }

    const [portfolio, asset] = await Promise.all([
        requirePortfolio(),
        getAssetByTicker(parsed.data.ticker),
    ]);

    await sellAsset(
        portfolio.id,
        asset.id,
        parsed.data.quantity,
        parsed.data.price,
    );

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath(`/asset/${parsed.data.ticker}`);
}
