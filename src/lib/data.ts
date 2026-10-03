export type Category = 'Stocks' | 'ETFs' | 'Crypto' | 'Cash';

export interface AssetMeta {
    t: string;
    name: string;
    cat: Category;
    price: number;
    day: number;
    seed: number;
    exchange?: string;
}

export interface Holding extends AssetMeta {
    shares: number;
    avg: number;
}

export interface EnrichedHolding extends Holding {
    value: number;
    invested: number;
    pl: number;
    plPct: number;
}

export interface Transaction {
    id: number;
    date: string;
    t: string;
    name: string;
    type: 'buy' | 'sell';
    qty: number;
    price: number;
}

export const TODAY = '2026-08-11';

export const CATEGORY_COLORS: Record<Category, string> = {
    Stocks: '#15151A',
    ETFs: '#0C6B4F',
    Crypto: '#B08A3E',
    Cash: '#D6D2CB',
};

export const INITIAL_HOLDINGS: Holding[] = [
    {
        t: 'AAPL',
        name: 'Apple Inc.',
        cat: 'Stocks',
        shares: 42,
        avg: 168.4,
        price: 231.5,
        seed: 11,
        day: 0.84,
    },
    {
        t: 'MSFT',
        name: 'Microsoft Corp.',
        cat: 'Stocks',
        shares: 18,
        avg: 320.1,
        price: 428.9,
        seed: 12,
        day: -0.32,
    },
    {
        t: 'NVDA',
        name: 'NVIDIA Corp.',
        cat: 'Stocks',
        shares: 65,
        avg: 45.2,
        price: 138.75,
        seed: 13,
        day: 2.14,
    },
    {
        t: 'GOOGL',
        name: 'Alphabet Inc.',
        cat: 'Stocks',
        shares: 30,
        avg: 128.6,
        price: 179.2,
        seed: 14,
        day: -0.11,
    },
    {
        t: 'AMZN',
        name: 'Amazon.com Inc.',
        cat: 'Stocks',
        shares: 22,
        avg: 145.3,
        price: 198.4,
        seed: 15,
        day: 0.47,
    },
    {
        t: 'VWCE',
        name: 'Vanguard FTSE All-World',
        cat: 'ETFs',
        shares: 150,
        avg: 98.4,
        price: 118.6,
        seed: 16,
        day: 0.22,
    },
    {
        t: 'IWDA',
        name: 'iShares Core MSCI World',
        cat: 'ETFs',
        shares: 210,
        avg: 78.2,
        price: 92.15,
        seed: 17,
        day: 0.19,
    },
    {
        t: 'BTC',
        name: 'Bitcoin',
        cat: 'Crypto',
        shares: 0.42,
        avg: 38500,
        price: 61200,
        seed: 18,
        day: 3.62,
    },
    {
        t: 'ETH',
        name: 'Ethereum',
        cat: 'Crypto',
        shares: 4.8,
        avg: 2100,
        price: 3380,
        seed: 19,
        day: 1.95,
    },
];

export const INITIAL_CASH = 8450.32;

export const INITIAL_WATCHLIST: AssetMeta[] = [
    {
        t: 'TSLA',
        name: 'Tesla Inc.',
        cat: 'Stocks',
        price: 264.3,
        day: 1.42,
        seed: 31,
    },
    {
        t: 'META',
        name: 'Meta Platforms',
        cat: 'Stocks',
        price: 612.8,
        day: -0.68,
        seed: 32,
    },
    {
        t: 'ASML',
        name: 'ASML Holding',
        cat: 'Stocks',
        price: 812.1,
        day: 0.91,
        seed: 33,
    },
    {
        t: 'NFLX',
        name: 'Netflix Inc.',
        cat: 'Stocks',
        price: 940.55,
        day: -1.24,
        seed: 34,
    },
    {
        t: 'SOL',
        name: 'Solana',
        cat: 'Crypto',
        price: 178.6,
        day: 4.03,
        seed: 35,
    },
];

export const WATCHLIST_POOL: AssetMeta[] = [
    {
        t: 'AMD',
        name: 'Advanced Micro Devices',
        cat: 'Stocks',
        price: 167.2,
        day: 1.08,
        seed: 41,
    },
    {
        t: 'PLTR',
        name: 'Palantir Technologies',
        cat: 'Stocks',
        price: 98.4,
        day: 2.65,
        seed: 42,
    },
    {
        t: 'SHOP',
        name: 'Shopify Inc.',
        cat: 'Stocks',
        price: 121.9,
        day: -0.44,
        seed: 43,
    },
    {
        t: 'CRWD',
        name: 'CrowdStrike Holdings',
        cat: 'Stocks',
        price: 384.7,
        day: 0.72,
        seed: 44,
    },
    {
        t: 'COIN',
        name: 'Coinbase Global',
        cat: 'Stocks',
        price: 289.1,
        day: 3.18,
        seed: 45,
    },
    {
        t: 'SPY',
        name: 'SPDR S&P 500 ETF',
        cat: 'ETFs',
        price: 612.4,
        day: 0.15,
        seed: 46,
    },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
    {
        id: 1,
        date: '2026-08-09',
        t: 'NVDA',
        name: 'NVIDIA Corp.',
        type: 'buy',
        qty: 5,
        price: 136.2,
    },
    {
        id: 2,
        date: '2026-08-07',
        t: 'VWCE',
        name: 'Vanguard FTSE All-World',
        type: 'buy',
        qty: 20,
        price: 117.9,
    },
    {
        id: 3,
        date: '2026-08-05',
        t: 'BTC',
        name: 'Bitcoin',
        type: 'buy',
        qty: 0.05,
        price: 59800,
    },
    {
        id: 4,
        date: '2026-08-02',
        t: 'AAPL',
        name: 'Apple Inc.',
        type: 'sell',
        qty: 8,
        price: 228.1,
    },
    {
        id: 5,
        date: '2026-07-29',
        t: 'MSFT',
        name: 'Microsoft Corp.',
        type: 'buy',
        qty: 3,
        price: 421.4,
    },
    {
        id: 6,
        date: '2026-07-24',
        t: 'ETH',
        name: 'Ethereum',
        type: 'buy',
        qty: 0.6,
        price: 3210,
    },
    {
        id: 7,
        date: '2026-07-18',
        t: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'buy',
        qty: 6,
        price: 174.8,
    },
    {
        id: 8,
        date: '2026-07-11',
        t: 'IWDA',
        name: 'iShares Core MSCI World',
        type: 'buy',
        qty: 40,
        price: 90.1,
    },
    {
        id: 9,
        date: '2026-07-03',
        t: 'AMZN',
        name: 'Amazon.com Inc.',
        type: 'sell',
        qty: 4,
        price: 191.6,
    },
    {
        id: 10,
        date: '2026-06-27',
        t: 'NVDA',
        name: 'NVIDIA Corp.',
        type: 'buy',
        qty: 10,
        price: 121.5,
    },
];

export const CATALOG: AssetMeta[] = [
    ...INITIAL_HOLDINGS,
    ...INITIAL_WATCHLIST,
    ...WATCHLIST_POOL,
].reduce(
    (acc: AssetMeta[], a) => (acc.find((x) => x.t === a.t) ? acc : [...acc, a]),
    [],
);

export function mulberry32(seed: number) {
    let a = seed;
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

import type { Range } from './market-data/range';
export type { Range } from './market-data/range';
export { RANGES } from './market-data/range';
export const RANGE_POINTS: Record<Range, number> = {
    '1D': 24,
    '1W': 7,
    '1M': 30,
    '3M': 60,
    '1Y': 52,
    All: 48,
};
export const RANGE_CHANGE: Record<Range, number> = {
    '1D': 0.006,
    '1W': 0.018,
    '1M': 0.041,
    '3M': 0.086,
    '1Y': 0.223,
    All: 0.412,
};

export function genSeries(seed: number, endValue: number, range: Range) {
    const n = RANGE_POINTS[range];
    const totalChange = RANGE_CHANGE[range] * (seed % 2 === 0 ? 1 : 0.7);
    const rand = mulberry32(seed * 97 + n);
    const start = endValue / (1 + totalChange);
    const pts: { i: number; v: number }[] = [];
    let v = start;
    for (let i = 0; i <= n; i++) {
        const progress = i / n;
        const target = start + (endValue - start) * progress;
        const noise = (rand() - 0.5) * endValue * 0.01;
        v = i === 0 ? start : i === n ? endValue : target + noise;
        pts.push({ i, v: Math.round(v * 100) / 100 });
    }
    return pts;
}

export function genCompareSeries(seed: number, range: Range) {
    const n = RANGE_POINTS[range];
    const totalChange = RANGE_CHANGE[range] * (seed % 2 === 0 ? 1 : 0.7);
    const benchChange = totalChange * 0.62;
    const randA = mulberry32(seed * 13 + n);
    const randB = mulberry32(seed * 29 + n + 3);
    const pts: { i: number; portfolio: number; benchmark: number }[] = [];
    for (let i = 0; i <= n; i++) {
        const progress = i / n;
        const a =
            100 * (1 + totalChange * progress) +
            (randA() - 0.5) * 1.2 * (i > 0 && i < n ? 1 : 0);
        const b =
            100 * (1 + benchChange * progress) +
            (randB() - 0.5) * 0.8 * (i > 0 && i < n ? 1 : 0);
        pts.push({
            i,
            portfolio: Math.round(a * 100) / 100,
            benchmark: Math.round(b * 100) / 100,
        });
    }
    pts[0].portfolio = 100;
    pts[0].benchmark = 100;
    return pts;
}

export function sparkline(seed: number, up: boolean) {
    const rand = mulberry32(seed);
    let v = 50;
    const pts: { i: number; v: number }[] = [];
    for (let i = 0; i < 16; i++) {
        v += (rand() - (up ? 0.42 : 0.58)) * 6;
        pts.push({ i, v });
    }
    return pts;
}
