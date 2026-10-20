import 'server-only';
import { prisma } from '@/lib/prisma';
import {
    fetchYahooHistory,
    fetchYahooQuote,
    searchYahooEquities,
    yahooFinance,
} from '@/lib/market-data/yahoo';
import type { AssetModel as Asset } from '../../../generated/prisma/models';
import type { AssetCategory } from '../../../generated/prisma/enums';
import {
    CRYPTO_CURRENCY,
    cryptoTicker,
    fetchCoinHistory,
    fetchCoinMarkets,
    primaryCoinIdBySymbol,
    rememberCoinTicker,
    resolveCoinByTicker,
    searchCoins,
    type CoinMarket,
} from '@/lib/market-data/coingecko';
import { unstable_cache } from 'next/cache';
import type { Range } from '@/lib/market-data/range';
import { RANGE_REVALIDATE_SECONDS } from '../market-data/range-config';

const STALE_AFTER_MS = 5 * 60 * 1000;
const MAX_CRYPTO_RESULTS = 5;
const MAX_SEARCH_RESULTS = 25;
const COINGECKO_MARKETS_BATCH = 250;

export interface AssetSearchResult {
    t: string;
    name: string;
    cat: 'Stocks' | 'ETFs' | 'Crypto';
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
        cat:
            a.category === 'ETF'
                ? 'ETFs'
                : a.category === 'CRYPTO'
                  ? 'Crypto'
                  : 'Stocks',
        currency: a.currency,
        price: a.lastPrice != null ? Number(a.lastPrice) : null,
        day: a.dayChangePercent ? Number(a.dayChangePercent) : 0,
    };
}

function cryptoQuoteFields(market: CoinMarket & { price: number }) {
    return {
        lastPrice: market.price,
        lastPriceAt: new Date(),
        dayChangePercent: market.dayChangePercent ?? 0,
    };
}

async function getOrCreateCryptoAsset(
    ticker: string,
    existing: Asset | null,
): Promise<Asset | null> {
    const market = existing?.coinGeckoId
        ? ((await fetchCoinMarkets([existing.coinGeckoId]))[0] ?? null)
        : await resolveCoinByTicker(ticker);
    if (!market) return null;
    if (market.price == null) {
        throw new Error(`No market price for coin "${market.id}"`);
    }
    const quote = cryptoQuoteFields({ ...market, price: market.price });

    return prisma.asset.upsert({
        where: { ticker },
        create: {
            ticker,
            name: market.name,
            category: 'CRYPTO',
            currency: CRYPTO_CURRENCY,
            coinGeckoId: market.id,
            externalSymbol: market.symbol.toUpperCase(),
            ...quote,
        },
        update: quote,
    });
}

/**
 * Wyszukuje kryptowaluty w CoinGecko i nadaje im tickery zgodne z
 * `cryptoTicker`. Moneta już zapisana w bazie zachowuje swój ticker.
 */
async function searchCrypto(query: string): Promise<AssetSearchResult[]> {
    // Ticker jest parsowany po pierwszym "-", więc pomijamy nietypowe symbole.
    const hits = (await searchCoins(query))
        .filter((h) => /^[A-Za-z0-9]+$/.test(h.symbol))
        .slice(0, MAX_CRYPTO_RESULTS);
    if (hits.length === 0) return [];

    const markets = new Map(
        (await fetchCoinMarkets(hits.map((h) => h.id))).map((m) => [m.id, m]),
    );
    const primaryIds = primaryCoinIdBySymbol(hits);
    const candidates = hits.map((h) =>
        cryptoTicker(
            h.symbol,
            h.id,
            primaryIds.get(h.symbol.toUpperCase()) === h.id,
        ),
    );

    const stored = await prisma.asset.findMany({
        where: {
            OR: [
                { coinGeckoId: { in: hits.map((h) => h.id) } },
                { ticker: { in: candidates } },
            ],
        },
        select: { ticker: true, coinGeckoId: true },
    });
    const tickerByCoinId = new Map(
        stored.filter((a) => a.coinGeckoId).map((a) => [a.coinGeckoId, a.ticker]),
    );
    const takenTickers = new Set(stored.map((a) => a.ticker));

    return hits.flatMap((hit, i): AssetSearchResult[] => {
        const market = markets.get(hit.id);
        if (!market || market.price == null) return [];

        const ticker =
            tickerByCoinId.get(hit.id) ??
            (takenTickers.has(candidates[i])
                ? cryptoTicker(hit.symbol, hit.id, false)
                : candidates[i]);
        rememberCoinTicker(ticker, market);

        return [
            {
                t: ticker,
                name: market.name,
                cat: 'Crypto',
                currency: CRYPTO_CURRENCY,
                price: market.price,
                day: market.dayChangePercent ?? 0,
            },
        ];
    });
}

function isExactCryptoMatch(query: string, results: AssetSearchResult[]) {
    const q = query.trim().toLowerCase();
    return results.some(
        (r) =>
            r.name.toLowerCase() === q ||
            r.t.toLowerCase().split('-')[0] === q,
    );
}

export function getAssetByTicker(ticker: string) {
    return prisma.asset.findUniqueOrThrow({ where: { ticker } });
}

export async function getOrCreateAsset(ticker: string): Promise<Asset> {
    const clean = ticker.trim().toUpperCase();
    if (!clean || clean === 'UNDEFINED' || clean === 'NULL') {
        throw new Error(`Invalid ticker "${ticker}"`);
    }

    const existing = await prisma.asset.findUnique({ where: { ticker: clean } });

    const isFresh =
        existing?.lastPriceAt &&
        Date.now() - existing.lastPriceAt.getTime() < STALE_AFTER_MS;
    if (existing && isFresh) return existing;

    // Krypto mają tickery z myślnikiem ("BTC-USD"); akcje z myślnikiem
    // ("BRK-B") nie znajdą dopasowania w CoinGecko i pójdą dalej do Yahoo.
    if (existing?.category === 'CRYPTO' || (!existing && clean.includes('-'))) {
        try {
            const crypto = await getOrCreateCryptoAsset(clean, existing);
            if (crypto) return crypto;
        } catch (err) {
            if (existing) {
                console.error(`CoinGecko refresh failed for ${clean}:`, err);
                return existing;
            }
            console.error(`CoinGecko lookup failed for ${clean}:`, err);
        }
        if (existing) return existing;
    }

    const quote = await fetchYahooQuote(clean);

    return prisma.asset.upsert({
        where: { ticker: clean },
        create: {
            ticker: clean,
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

    const localPromise = prisma.asset.findMany({
        where: {
            OR: [
                { ticker: { contains: trimmed, mode: 'insensitive' } },
                { name: { contains: trimmed, mode: 'insensitive' } },
            ],
        },
        take: 10,
    });
    const yahooPromise = searchYahooEquities(trimmed).catch((err) => {
        console.error('Yahoo search failed:', err);
        return [];
    });
    const cryptoPromise = searchCrypto(trimmed).catch((err) => {
        console.error('CoinGecko search failed:', err);
        return [] as AssetSearchResult[];
    });

    const [local, yahooResults, cryptoResults] = await Promise.all([
        localPromise,
        yahooPromise,
        cryptoPromise,
    ]);
    const localTickers = new Set(local.map((a) => a.ticker));

    const external: AssetSearchResult[] = yahooResults
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

    const crypto = cryptoResults.filter((r) => !localTickers.has(r.t));
    // Zapytanie typu "bitcoin" ma pokazać monetę przed funduszami o podobnej
    // nazwie; "apple" odwrotnie — akcje przed egzotycznymi tokenami.
    const ordered = isExactCryptoMatch(trimmed, crypto)
        ? [...crypto, ...external]
        : [...external, ...crypto];

    return [...local.map(toResult), ...ordered].slice(0, MAX_SEARCH_RESULTS);
}

export async function getAssetPriceHistory(asset: Asset, range: Range) {
    const coinGeckoId =
        asset.category === 'CRYPTO' ? asset.coinGeckoId : null;

    const cached = unstable_cache(
        async () =>
            coinGeckoId
                ? fetchCoinHistory(coinGeckoId, range)
                : fetchYahooHistory(asset.ticker, range),
        ['asset-history', asset.ticker, range],
        { revalidate: RANGE_REVALIDATE_SECONDS[range] },
    );

    const points = await cached();
    // unstable_cache serializes to JSON: Date becomes ISO string on cache hits.
    // Normalize so callers always get Date instances.
    return points.map((p) => ({
        price: p.price,
        date: p.date instanceof Date ? p.date : new Date(p.date),
    }));
}

export interface SyncResult {
    ticker: string;
    status: 'ok' | 'error';
    message?: string;
}

type PriceQuote = { price: number; dayChangePercent: number };

/** Klucz wyniku: `Asset.ticker` dla Yahoo. */
async function fetchYahooQuotes(assets: Asset[]) {
    const quotes = await yahooFinance.quote(assets.map((a) => a.ticker));
    const quoteArray = Array.isArray(quotes) ? quotes : [quotes];

    return new Map<string, PriceQuote>(
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
}

/** Klucz wyniku: `Asset.coinGeckoId`. */
async function fetchCryptoQuotes(assets: Asset[]) {
    const ids = assets.flatMap((a) => (a.coinGeckoId ? [a.coinGeckoId] : []));
    const quotes = new Map<string, PriceQuote>();

    for (let i = 0; i < ids.length; i += COINGECKO_MARKETS_BATCH) {
        const markets = await fetchCoinMarkets(
            ids.slice(i, i + COINGECKO_MARKETS_BATCH),
        );
        for (const m of markets) {
            if (m.price == null) continue;
            quotes.set(m.id, {
                price: m.price,
                dayChangePercent: m.dayChangePercent ?? 0,
            });
        }
    }
    return quotes;
}

export async function syncAllAssetPrices(): Promise<SyncResult[]> {
    const assets = await prisma.asset.findMany();
    if (assets.length === 0) return [];

    const cryptoAssets = assets.filter((a) => a.category === 'CRYPTO');
    const marketAssets = assets.filter((a) => a.category !== 'CRYPTO');

    // Każdy dostawca zawodzi niezależnie — awaria CoinGecko nie blokuje Yahoo.
    const [yahoo, coingecko] = await Promise.all([
        marketAssets.length > 0
            ? fetchYahooQuotes(marketAssets).then(
                  (quotes) => ({ quotes }),
                  (err: unknown) => ({ error: String(err) }),
              )
            : { quotes: new Map<string, PriceQuote>() },
        cryptoAssets.length > 0
            ? fetchCryptoQuotes(cryptoAssets).then(
                  (quotes) => ({ quotes }),
                  (err: unknown) => ({ error: String(err) }),
              )
            : { quotes: new Map<string, PriceQuote>() },
    ]);

    const results: SyncResult[] = await Promise.all(
        assets.map(async (asset) => {
            const isCrypto = asset.category === 'CRYPTO';
            const provider = isCrypto ? coingecko : yahoo;
            const source = isCrypto ? 'CoinGecko' : 'Yahoo';

            if ('error' in provider) {
                return {
                    ticker: asset.ticker,
                    status: 'error' as const,
                    message: provider.error,
                };
            }

            const quote = provider.quotes.get(
                isCrypto ? (asset.coinGeckoId ?? '') : asset.ticker,
            );
            if (!quote) {
                return {
                    ticker: asset.ticker,
                    status: 'error' as const,
                    message: `No quote returned by ${source}`,
                };
            }

            await Promise.all([
                prisma.asset.update({
                    where: { id: asset.id },
                    data: {
                        lastPrice: quote.price,
                        lastPriceAt: new Date(),
                        dayChangePercent: quote.dayChangePercent,
                    },
                }),
                prisma.priceSnapshot.create({
                    data: { assetId: asset.id, price: quote.price },
                }),
            ]);
            return { ticker: asset.ticker, status: 'ok' as const };
        }),
    );
    return results;
}
