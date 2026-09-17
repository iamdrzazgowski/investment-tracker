import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { fetchYahooQuote, fetchYahooHistory } from '@/lib/market-data/yahoo';
import {
    fetchCoinGeckoQuote,
    fetchCoinGeckoHistory,
} from '@/lib/market-data/coingecko';
import { RANGE_REVALIDATE_SECONDS } from '@/lib/market-data/range-config';
import type { Asset, AssetCategory } from '../../../generated/prisma/client';
import type { Range } from '@/lib/data';

const STALE_AFTER_MS = 5 * 60 * 1000;

export async function getOrCreateAsset(
    ticker: string,
    category: AssetCategory,
): Promise<Asset> {
    const existing = await prisma.asset.findUnique({ where: { ticker } });

    const isFresh =
        existing?.lastPriceAt &&
        Date.now() - existing.lastPriceAt.getTime() < STALE_AFTER_MS;
    if (existing && isFresh) return existing;

    return category === 'CRYPTO'
        ? syncFromCoinGecko(ticker, existing?.externalSymbol)
        : syncFromYahoo(ticker, existing?.externalSymbol, category);
}

async function syncFromYahoo(
    ticker: string,
    knownSymbol: string | undefined,
    category: AssetCategory,
): Promise<Asset> {
    const symbol = knownSymbol ?? ticker;
    const quote = await fetchYahooQuote(symbol);

    return prisma.asset.upsert({
        where: { ticker },
        create: {
            ticker,
            name: quote.name,
            category: quote.category,
            currency: quote.currency,
            exchange: quote.exchange,
            externalSymbol: symbol,
            lastPrice: quote.price,
            lastPriceAt: new Date(),
            dayChangePercent: quote.dayChangePercent,
        },
        update: {
            lastPrice: quote.price,
            lastPriceAt: new Date(),
            dayChangePercent: quote.dayChangePercent,
        },
    });
}

async function syncFromCoinGecko(
    ticker: string,
    knownSlug: string | undefined,
): Promise<Asset> {
    const slug = knownSlug ?? ticker.toLowerCase();
    const quote = await fetchCoinGeckoQuote(slug);

    return prisma.asset.upsert({
        where: { ticker },
        create: {
            ticker,
            name: ticker,
            category: 'CRYPTO',
            currency: 'USD',
            externalSymbol: slug,
            lastPrice: quote.price,
            lastPriceAt: new Date(),
            dayChangePercent: quote.dayChangePercent,
        },
        update: {
            lastPrice: quote.price,
            lastPriceAt: new Date(),
            dayChangePercent: quote.dayChangePercent,
        },
    });
}

export async function getAssetPriceHistory(asset: Asset, range: Range) {
    const cached = unstable_cache(
        async () => {
            return asset.category === 'CRYPTO'
                ? fetchCoinGeckoHistory(asset.externalSymbol, range)
                : fetchYahooHistory(asset.externalSymbol, range);
        },
        ['asset-history', asset.ticker, range],
        { revalidate: RANGE_REVALIDATE_SECONDS[range] },
    );

    return cached();
}

export function searchAssets(query: string) {
    return prisma.asset.findMany({
        where: {
            OR: [
                { ticker: { contains: query, mode: 'insensitive' } },
                { name: { contains: query, mode: 'insensitive' } },
            ],
        },
        take: 20,
    });
}
