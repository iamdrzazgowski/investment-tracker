'use server';

import { revalidatePath } from 'next/cache';
import { requirePortfolio } from '@/lib/auth-helpers';
import {
    getAssetByTicker,
    getOrCreateAsset,
} from '@/lib/repositories/asset.repository';
import {
    addToWatchlist,
    removeFromWatchlist,
} from '@/lib/repositories/watchlist.repository';
import { watchlistTickerSchema } from '@/lib/validations/watchlist';

export async function addWatchlistAction(ticker: string) {
    const parsed = watchlistTickerSchema.safeParse({ ticker });
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? 'Invalid ticker');
    }
    const clean = parsed.data.ticker;

    const portfolio = await requirePortfolio();

    // Resolve the asset against real market data (Yahoo) and persist it
    // so the watchlist row always points at a real `assets` record —
    // this also works for tickers found via external search that are not
    // yet in the database.
    const asset = await getOrCreateAsset(clean);

    await addToWatchlist(portfolio.id, asset.id);

    revalidatePath('/watchlist');
    revalidatePath(`/asset/${clean}`);
}

export async function removeWatchlistAction(ticker: string) {
    const parsed = watchlistTickerSchema.safeParse({ ticker });
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? 'Invalid ticker');
    }
    const clean = parsed.data.ticker;

    const portfolio = await requirePortfolio();
    const asset = await getAssetByTicker(clean);

    await removeFromWatchlist(portfolio.id, asset.id);

    revalidatePath('/watchlist');
    revalidatePath(`/asset/${clean}`);
}
