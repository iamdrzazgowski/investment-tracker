import { prisma } from '@/lib/prisma';
import {
    fetchYahooHistory,
    fetchYahooQuote,
    searchYahooEquities,
    yahooFinance,
} from '@/lib/market-data/yahoo';
import type { AssetModel as Asset } from '../../../generated/prisma/models';
import type { AssetCategory } from '../../../generated/prisma/enums';
import { unstable_cache } from 'next/cache';
import { Range } from '@/lib/data';
import { RANGE_REVALIDATE_SECONDS } from '../market-data/range-config';

const STALE_AFTER_MS = 5 * 60 * 1000;

export interface AssetSearchResult {
    t: string;
    name: string;
    cat: 'Stocks' | 'ETFs';
    currency: string;
    price: number | null;
    day: number;
}

function toResult(a: {
    ticker: string;
    name: string;
    category: AssetCategory;
    currency: string;
    lastPrice: unknown;
    dayChangePercent: unknown;
}): AssetSearchResult {
    return {
        t: a.ticker,
        name: a.name,
        cat: a.category === 'ETF' ? 'ETFs' : 'Stocks',
        currency: a.currency,
        price: a.lastPrice != null ? Number(a.lastPrice) : null,
        day: a.dayChangePercent ? Number(a.dayChangePercent) : 0,
    };
}

export async function getOrCreateAsset(ticker: string): Promise<Asset> {
    const existing = await prisma.asset.findUnique({ where: { ticker } });

    const isFresh =
        existing?.lastPriceAt &&
        Date.now() - existing.lastPriceAt.getTime() < STALE_AFTER_MS;
    if (existing && isFresh) return existing;

    const quote = await fetchYahooQuote(ticker);

    return prisma.asset.upsert({
        where: { ticker },
        create: {
            ticker,
            name: quote.name,
            category: quote.category,
            currency: quote.currency,
            exchange: quote.exchange,
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

export async function searchAssets(
    query: string,
): Promise<AssetSearchResult[]> {
    const trimmed = query.trim();

    if (!trimmed) {
        const recent = await prisma.asset.findMany({
            orderBy: { updatedAt: 'desc' },
            take: 10,
        });
        return recent.map(toResult);
    }

    const local = await prisma.asset.findMany({
        where: {
            OR: [
                { ticker: { contains: trimmed, mode: 'insensitive' } },
                { name: { contains: trimmed, mode: 'insensitive' } },
            ],
        },
        take: 10,
    });
    const localTickers = new Set(local.map((a) => a.ticker));

    let external: AssetSearchResult[] = [];
    try {
        const yahooResults = await searchYahooEquities(trimmed);
        external = yahooResults
            .filter((r) => !localTickers.has(r.symbol))
            .map((r) => ({
                t: r.symbol,
                name: r.name,
                cat:
                    r.category === 'ETF'
                        ? ('ETFs' as const)
                        : ('Stocks' as const),
                currency: r.currency,
                price: r.price,
                day: r.dayChangePercent ?? 0,
            }));
    } catch (err) {
        console.error('Yahoo search failed:', err);
    }

    return [...local.map(toResult), ...external].slice(0, 20);
}

export async function getAssetPriceHistory(asset: Asset, range: Range) {
    const cached = unstable_cache(
        async () => fetchYahooHistory(asset.ticker, range),
        ['asset-history', asset.ticker, range],
        { revalidate: RANGE_REVALIDATE_SECONDS[range] },
    );

    return cached();
}

export interface SyncResult {
    ticker: string;
    status: 'ok' | 'error';
    message?: string;
}

export async function syncAllAssetPrices(): Promise<SyncResult[]> {
    const assets = await prisma.asset.findMany();
    if (assets.length === 0) return [];

    let quoteBySymbol = new Map<
        string,
        { price: number; dayChangePercent: number }
    >();
    try {
        const symbols = assets.map((a) => a.ticker);
        const quotes = await yahooFinance.quote(symbols);
        const quoteArray = Array.isArray(quotes) ? quotes : [quotes];

        quoteBySymbol = new Map(
            quoteArray
                .filter((q) => typeof q.regularMarketPrice === 'number')
                .map((q) => [
                    q.symbol,
                    {
                        price: q.regularMarketPrice as number,
                        dayChangePercent:
                            typeof q.regularMarketChangePercent === 'number'
                                ? q.regularMarketChangePercent
                                : 0,
                    },
                ]),
        );
    } catch (err) {
        return assets.map((a) => ({
            ticker: a.ticker,
            status: 'error' as const,
            message: String(err),
        }));
    }

    const results: SyncResult[] = [];
    for (const asset of assets) {
        const quote = quoteBySymbol.get(asset.ticker);
        if (!quote) {
            results.push({
                ticker: asset.ticker,
                status: 'error',
                message: 'No quote returned by Yahoo',
            });
            continue;
        }

        await prisma.asset.update({
            where: { id: asset.id },
            data: {
                lastPrice: quote.price,
                lastPriceAt: new Date(),
                dayChangePercent: quote.dayChangePercent,
            },
        });
        await prisma.priceSnapshot.create({
            data: { assetId: asset.id, price: quote.price },
        });
        results.push({ ticker: asset.ticker, status: 'ok' });
    }
    return results;
}
