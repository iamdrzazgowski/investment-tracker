import { prisma } from '@/lib/prisma';
import { searchYahooEquities } from '@/lib/market-data/yahoo';
import type { AssetCategory } from '../../../generated/prisma/enums';

export interface AssetSearchResult {
    t: string;
    name: string;
    cat: 'Stocks' | 'ETFs' | 'Crypto';
    price: number;
    day: number;
    seed: number;
}

function categoryToDisplay(cat: AssetCategory): 'Stocks' | 'ETFs' | 'Crypto' {
    if (cat === 'ETF') return 'ETFs';
    if (cat === 'CRYPTO') return 'Crypto';
    return 'Stocks';
}

function seedFromTicker(ticker: string): number {
    let hash = 0;
    for (let i = 0; i < ticker.length; i++)
        hash = (hash * 31 + ticker.charCodeAt(i)) | 0;
    return Math.abs(hash) % 1000;
}

function toResult(a: {
    ticker: string;
    name: string;
    category: AssetCategory;
    lastPrice: unknown;
    dayChangePercent: unknown;
}): AssetSearchResult {
    return {
        t: a.ticker,
        name: a.name,
        cat: categoryToDisplay(a.category),
        price: a.lastPrice ? Number(a.lastPrice) : 0,
        day: a.dayChangePercent ? Number(a.dayChangePercent) : 0,
        seed: seedFromTicker(a.ticker),
    };
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
                price: r.price ?? 0,
                day: r.dayChangePercent ?? 0,
                seed: seedFromTicker(r.symbol),
                exchange: r.exchange,
            }));
    } catch (err) {
        console.error('Yahoo search failed:', err);
    }

    return [...local.map(toResult), ...external].slice(0, 20);
}
