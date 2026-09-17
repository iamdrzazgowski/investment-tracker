import type { Range } from '@/lib/data';

type YahooInterval =
    | '1m'
    | '2m'
    | '5m'
    | '15m'
    | '30m'
    | '60m'
    | '90m'
    | '1h'
    | '1d'
    | '5d'
    | '1wk'
    | '1mo'
    | '3mo';

export const RANGE_TO_COINGECKO_DAYS: Record<Range, string> = {
    '1D': '1',
    '1W': '7',
    '1M': '30',
    '3M': '90',
    '1Y': '365',
    All: 'max',
};

export const RANGE_TO_YAHOO: Record<
    Range,
    { period1: () => Date; interval: YahooInterval }
> = {
    '1D': { period1: () => startOfToday(), interval: '5m' },
    '1W': { period1: () => daysAgo(7), interval: '30m' },
    '1M': { period1: () => daysAgo(30), interval: '1d' },
    '3M': { period1: () => daysAgo(90), interval: '1d' },
    '1Y': { period1: () => daysAgo(365), interval: '1wk' },
    All: { period1: () => daysAgo(365 * 5), interval: '1mo' },
};

export const RANGE_REVALIDATE_SECONDS: Record<Range, number> = {
    '1D': 60,
    '1W': 60 * 15,
    '1M': 60 * 60,
    '3M': 60 * 60 * 6,
    '1Y': 60 * 60 * 24,
    All: 60 * 60 * 24,
};

function daysAgo(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}
function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}
