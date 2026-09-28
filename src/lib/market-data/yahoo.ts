import YahooFinance from 'yahoo-finance2';
import { RANGE_TO_YAHOO } from './range-config';
import { Range } from '@/lib/data';

export const yahooFinance = new YahooFinance();

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
    const q = await yahooFinance.quote(symbol);
    return {
        name: q.shortName ?? q.longName ?? symbol,
        category: q.quoteType === 'ETF' ? 'ETF' : 'STOCK',
        currency: q.currency ?? 'USD',
        exchange: q.fullExchangeName ?? q.exchange ?? null,
        price: q.regularMarketPrice,
        dayChangePercent: q.regularMarketChangePercent ?? 0,
    };
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
