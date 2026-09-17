import YahooFinance from 'yahoo-finance2';
import { RANGE_TO_YAHOO } from './range-config';
import type { Range } from '@/lib/data';

const yahooFinance = new YahooFinance();

function mapYahooQuoteType(quoteType: string | undefined): 'STOCK' | 'ETF' {
    switch (quoteType) {
        case 'ETF':
            return 'ETF';

        case 'EQUITY':
            return 'STOCK';

        default:
            throw new Error(`Unsupported Yahoo quote type: ${quoteType}`);
    }
}

export async function fetchYahooQuote(symbol: string) {
    const q = await yahooFinance.quote(symbol);

    return {
        ticker: q.symbol.split('.')[0],
        exchange: q.fullExchangeName ?? q.exchange ?? null,
        name: q.shortName ?? q.longName ?? symbol,
        category: mapYahooQuoteType(q.quoteType),
        currency: q.currency ?? 'USD',
        price: q.regularMarketPrice,
        dayChangePercent: q.regularMarketChangePercent ?? 0,
    };
}

export async function fetchYahooHistory(symbol: string, range: Range) {
    const { period1, interval } = RANGE_TO_YAHOO[range];

    const result = await yahooFinance.chart(symbol, {
        period1: period1(),
        period2: new Date(),
        interval,
    });

    return result.quotes
        .filter((q) => q.close != null)
        .map((q) => ({ date: q.date, price: q.close as number }));
}
