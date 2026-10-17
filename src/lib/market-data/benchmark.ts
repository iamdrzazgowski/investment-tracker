import 'server-only';
import { unstable_cache } from 'next/cache';
import { fetchYahooHistorySince } from './yahoo';
import {
    RANGE_REVALIDATE_SECONDS,
    RANGE_WINDOW_MS,
    type YahooInterval,
} from './range-config';
import { RANGES, type Range } from './range';

/**
 * iShares MSCI ACWI ETF (ticker ACWI, USD). Do porównań liczy się tylko
 * zmiana procentowa, więc waluta nie ma znaczenia.
 */
export const BENCHMARK = {
    symbol: 'ACWI',
    label: 'iShares MSCI ACWI',
} as const;

export interface BenchmarkPoint {
    /** Unix ms */
    t: number;
    price: number;
}

export type BenchmarkHistory = Record<Range, BenchmarkPoint[]>;

const DAY_MS = 24 * 60 * 60 * 1000;
// Zapas przed początkiem okna: potrzebny punkt SPRZED startu portfela, żeby
// dało się wyliczyć wartość benchmarku dokładnie w momencie startu (weekendy,
// święta), a nie na najbliższym późniejszym punkcie.
const START_BUFFER_MS = 5 * DAY_MS;
const DEFAULT_ALL_SPAN_MS = 5 * 365 * DAY_MS;

// Yahoo: 30m/5m tylko do ~60 dni wstecz, 1h do ~730 dni.
function intervalForSpan(spanMs: number): YahooInterval {
    if (spanMs <= 8 * DAY_MS) return '30m';
    if (spanMs <= 59 * DAY_MS) return '1h';
    if (spanMs <= 700 * DAY_MS) return '1d';
    return '1wk';
}

async function getBenchmarkRange(
    range: Range,
    since: number | null,
): Promise<BenchmarkPoint[]> {
    const now = Date.now();
    const window = RANGE_WINDOW_MS[range];

    // Okno wykresu, ale nie wcześniej niż start historii portfela — przy
    // krótkiej historii portfela benchmark dostaje tę samą rozdzielczość.
    let start = window == null ? now - DEFAULT_ALL_SPAN_MS : now - window;
    if (since != null) {
        start = window == null ? since : Math.max(start, since);
    }
    // Zaokrąglenie do doby, żeby klucz cache był stabilny w ciągu dnia.
    const bucketStart =
        Math.floor((start - START_BUFFER_MS) / DAY_MS) * DAY_MS;
    const interval = intervalForSpan(now - bucketStart);

    const cached = unstable_cache(
        async () => {
            const points = await fetchYahooHistorySince(
                BENCHMARK.symbol,
                new Date(bucketStart),
                interval,
            );
            return points.map((p) => ({
                t: new Date(p.date).getTime(),
                price: p.price,
            }));
        },
        ['benchmark-history', BENCHMARK.symbol, range, String(bucketStart)],
        { revalidate: RANGE_REVALIDATE_SECONDS[range] },
    );

    try {
        return await cached();
    } catch (err) {
        console.error(`Benchmark ${BENCHMARK.symbol} ${range} failed:`, err);
        return [];
    }
}

/**
 * @param since Unix ms pierwszego snapshotu portfela (null = brak historii).
 */
export async function getBenchmarkHistory(
    since: number | null,
): Promise<BenchmarkHistory> {
    const entries = await Promise.all(
        RANGES.map(
            async (r) => [r, await getBenchmarkRange(r, since)] as const,
        ),
    );
    return Object.fromEntries(entries) as BenchmarkHistory;
}
