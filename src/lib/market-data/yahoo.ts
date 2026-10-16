import 'server-only';
import YahooFinance from 'yahoo-finance2';
import { RANGE_TO_YAHOO, type YahooInterval } from './range-config';
import type { Range } from './range';

export const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey'],
});

export interface YahooSearchResult {
    symbol: string;
    name: string;
    category: 'STOCK' | 'ETF';
    currency: string;
    exchange: string | null;
    price: number | null;
    dayChangePercent: number | null;
}

interface YahooCandidate {
    symbol: string;
    name: string;
    category: 'STOCK' | 'ETF';
    exchange: string | null;
}

interface YahooQuote {
    name: string;
    category: 'STOCK' | 'ETF';
    currency: string;
    exchange: string | null;
    price: number;
    dayChangePercent: number;
}

export async function searchYahooEquities(
    query: string,
): Promise<YahooSearchResult[]> {
    const results = await yahooFinance.search(query, { quotesCount: 10 });

    const candidates: YahooCandidate[] = results.quotes
        .filter(
            (q): q is typeof q & { symbol: string; quoteType: string } =>
                'symbol' in q,
        )
        .filter((q) => q.quoteType === 'EQUITY' || q.quoteType === 'ETF')
        .map((q): YahooCandidate => {
            const raw = q;

            const name: string =
                typeof raw.longname === 'string' && raw.longname.trim()
                    ? raw.longname
                    : typeof raw.shortname === 'string' && raw.shortname.trim()
                      ? raw.shortname
                      : q.symbol;
            const cleanName = name.replace(/\s+/g, ' ').trim();

            const exchange: string | null =
                typeof raw.exchange === 'string' ? raw.exchange : null;

            return {
                symbol: q.symbol,
                name: cleanName,
                category: q.quoteType === 'ETF' ? 'ETF' : 'STOCK',
                exchange,
            };
        });

    if (candidates.length === 0) return [];

    let dataBySymbol = new Map<
        string,
        {
            price: number | null;
            dayChangePercent: number | null;
            currency: string;
        }
    >();
    try {
        const symbols = candidates.map((c) => c.symbol);
        const quotes = await yahooFinance.quote(symbols);
        const quoteArray = Array.isArray(quotes) ? quotes : [quotes];

        dataBySymbol = new Map(
            quoteArray.map((q) => [
                q.symbol,
                {
                    price:
                        typeof q.regularMarketPrice === 'number'
                            ? q.regularMarketPrice
                            : null,
                    dayChangePercent:
                        typeof q.regularMarketChangePercent === 'number'
                            ? q.regularMarketChangePercent
                            : null,
                    currency:
                        typeof q.currency === 'string' ? q.currency : 'USD',
                },
            ]),
        );
    } catch (err) {
        console.error('Yahoo batch quote failed:', err);
    }

    return candidates.map(
        (c): YahooSearchResult => ({
            symbol: c.symbol,
            name: c.name,
            category: c.category,
            exchange: c.exchange,
            currency: dataBySymbol.get(c.symbol)?.currency ?? 'USD',
            price: dataBySymbol.get(c.symbol)?.price ?? null,
            dayChangePercent:
                dataBySymbol.get(c.symbol)?.dayChangePercent ?? null,
        }),
    );
}

export async function fetchYahooQuote(symbol: string): Promise<YahooQuote> {
    const clean = symbol.trim().toUpperCase();
    if (!clean) throw new Error('Empty symbol');

    const q = await yahooFinance.quote(clean);
    if (!q || typeof q !== 'object' || !('symbol' in q)) {
        throw new Error(`No quote found for symbol "${clean}"`);
    }
    const rec = q as Record<string, unknown>;

    const name =
        (typeof rec.shortName === 'string' && rec.shortName.trim()
            ? rec.shortName.trim()
            : null) ??
        (typeof rec.longName === 'string' && rec.longName.trim()
            ? rec.longName.trim()
            : null) ??
        clean;
    const price =
        typeof rec.regularMarketPrice === 'number'
            ? rec.regularMarketPrice
            : null;
    if (price == null) {
        throw new Error(`No market price for symbol "${clean}"`);
    }

    return {
        name,
        category: rec.quoteType === 'ETF' ? 'ETF' : 'STOCK',
        currency:
            typeof rec.currency === 'string' && rec.currency
                ? rec.currency
                : 'USD',
        exchange:
            typeof rec.fullExchangeName === 'string' && rec.fullExchangeName
                ? rec.fullExchangeName
                : typeof rec.exchange === 'string'
                  ? rec.exchange
                  : null,
        price,
        dayChangePercent:
            typeof rec.regularMarketChangePercent === 'number'
                ? rec.regularMarketChangePercent
                : 0,
    };
}

export async function fetchYahooHistorySince(
    symbol: string,
    period1: Date,
    interval: YahooInterval,
) {
    const result = await yahooFinance.chart(symbol, {
        period1,
        period2: new Date(),
        interval,
    });

    return result.quotes
        .filter((q) => q.close != null)
        .map((q) => ({ date: q.date, price: q.close as number }));
}

export async function fetchYahooHistory(symbol: string, range: Range) {
    const { period1, interval } = RANGE_TO_YAHOO[range];

    const result = await yahooFinance.chart(symbol, {
        period1: period1(),
        period2: new Date(),
        interval: interval,
    });

    return result.quotes
        .filter((q) => q.close != null)
        .map((q) => ({ date: q.date, price: q.close as number }));
}
