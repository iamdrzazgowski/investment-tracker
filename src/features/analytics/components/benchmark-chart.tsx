'use client';

import * as React from 'react';
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RangeTabs } from '@/components/shared/range-tabs';
import { downsample } from '@/lib/analytics/downsample';
import type { IndexPoint } from '@/lib/analytics/performance';
import { fmtPct } from '@/lib/format';
import type { Range } from '@/lib/market-data/range';
import { RANGE_WINDOW_MS } from '@/lib/market-data/range-config';
import type { BenchmarkHistory } from '@/lib/market-data/benchmark';

interface Row {
    t: number;
    portfolio?: number;
    benchmark?: number;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
});

/** Rebase serii do 100 na pierwszym punkcie. */
function rebase(points: { t: number; v: number }[]) {
    const base = points[0]?.v;
    if (!base) return [];
    return points.map((p) => ({ t: p.t, v: (p.v / base) * 100 }));
}

/** Interpolacja liniowa serii w zadanych momentach (poza zakresem serii: undefined). */
function sampleAt(series: { t: number; v: number }[], times: number[]) {
    const out: (number | undefined)[] = [];
    let j = 0;
    for (const t of times) {
        if (
            series.length === 0 ||
            t < series[0].t ||
            t > series[series.length - 1].t
        ) {
            out.push(undefined);
            continue;
        }
        while (j + 1 < series.length && series[j + 1].t <= t) j++;
        const a = series[j];
        const b = series[j + 1] ?? a;
        out.push(
            b.t === a.t ? a.v : a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t),
        );
    }
    return out;
}

export function BenchmarkChart({
    portfolioIndex,
    benchmark,
    benchmarkLabel,
}: {
    /** Indeks wyników portfela (start = 100), rosnąco po czasie. */
    portfolioIndex: IndexPoint[];
    benchmark: BenchmarkHistory;
    benchmarkLabel: string;
}) {
    const [range, setRange] = React.useState<Range>('1Y');

    const { rows, portfolioReturn, benchmarkReturn } = React.useMemo(() => {
        const bench = benchmark[range].map((p) => ({ t: p.t, v: p.price }));
        const lastT = Math.max(
            portfolioIndex[portfolioIndex.length - 1]?.t ?? 0,
            bench[bench.length - 1]?.t ?? 0,
        );
        const window = RANGE_WINDOW_MS[range];
        const windowStart = window == null ? -Infinity : lastT - window;

        const portfolioInRange = portfolioIndex.filter(
            (p) => p.t >= windowStart,
        );
        const hasPortfolio = portfolioInRange.length >= 2;
        // Oba wykresy startują od tego samego momentu, żeby były porównywalne.
        const seriesStart = hasPortfolio ? portfolioInRange[0].t : windowStart;

        const p = hasPortfolio ? rebase(downsample(portfolioInRange)) : [];

        // Baza benchmarku = jego wartość dokładnie w momencie startu portfela
        // (interpolowana), a nie pierwszy późniejszy punkt — inaczej przy
        // rzadkich danych część ruchu byłaby gubiona.
        let benchSeries = bench;
        if (Number.isFinite(seriesStart)) {
            const atStart = sampleAt(bench, [seriesStart])[0];
            const after = bench.filter((x) => x.t > seriesStart);
            benchSeries =
                atStart != null ? [{ t: seriesStart, v: atStart }, ...after] : after;
        }
        const b = rebase(benchSeries);

        const times = [...new Set([...p, ...b].map((x) => x.t))].sort(
            (x, y) => x - y,
        );
        const pValues = sampleAt(p, times);
        const bValues = sampleAt(b, times);
        const rows: Row[] = times.map((t, i) => ({
            t,
            portfolio: pValues[i],
            benchmark: bValues[i],
        }));

        return {
            rows,
            portfolioReturn: p.length ? p[p.length - 1].v - 100 : null,
            benchmarkReturn: b.length ? b[b.length - 1].v - 100 : null,
        };
    }, [portfolioIndex, benchmark, range]);

    const hasData = rows.length >= 2;

    return (
        <Card>
            <CardHeader className='flex w-full flex-row items-start justify-between gap-3 space-y-0'>
                <div>
                    <CardTitle>Portfolio vs. benchmark</CardTitle>

                    <div className='mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1.5'>
                            <i className='inline-block h-2 w-2 rounded-sm bg-positive' />
                            Your portfolio
                            <b className='font-mono text-foreground'>
                                {portfolioReturn != null
                                    ? fmtPct(portfolioReturn)
                                    : '—'}
                            </b>
                        </span>

                        <span className='flex items-center gap-1.5'>
                            <i className='inline-block h-2 w-2 rounded-sm bg-muted-foreground/50' />
                            {benchmarkLabel}
                            <b className='font-mono text-foreground'>
                                {benchmarkReturn != null
                                    ? fmtPct(benchmarkReturn)
                                    : '—'}
                            </b>
                        </span>
                    </div>
                    {portfolioReturn == null && hasData && (
                        <p className='mt-1.5 text-[11.5px] text-muted-foreground'>
                            Portfolio history builds up as snapshots are
                            collected.
                        </p>
                    )}
                </div>

                <RangeTabs value={range} onChange={setRange} />
            </CardHeader>
            <CardContent>
                <div style={{ height: 220 }}>
                    {hasData ? (
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart
                                data={rows}
                                margin={{
                                    top: 8,
                                    right: 8,
                                    left: 0,
                                    bottom: 0,
                                }}>
                                <XAxis
                                    dataKey='t'
                                    type='number'
                                    scale='time'
                                    domain={['dataMin', 'dataMax']}
                                    hide
                                />
                                <YAxis
                                    hide
                                    domain={['dataMin - 2', 'dataMax + 2']}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length)
                                            return null;
                                        const row = payload[0].payload as Row;
                                        return (
                                            <div className='rounded-md bg-foreground px-2.5 py-1.5 font-mono text-xs font-medium tabular-nums text-background'>
                                                <div>
                                                    Portfolio{' '}
                                                    {row.portfolio != null
                                                        ? fmtPct(
                                                              row.portfolio -
                                                                  100,
                                                          )
                                                        : '—'}{' '}
                                                    · {benchmarkLabel}{' '}
                                                    {row.benchmark != null
                                                        ? fmtPct(
                                                              row.benchmark -
                                                                  100,
                                                          )
                                                        : '—'}
                                                </div>
                                                <div className='opacity-70'>
                                                    {dateFormatter.format(
                                                        row.t,
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                <Line
                                    type='monotone'
                                    dataKey='portfolio'
                                    stroke='var(--positive)'
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                />
                                <Line
                                    type='monotone'
                                    dataKey='benchmark'
                                    stroke='var(--muted-foreground)'
                                    strokeWidth={1.6}
                                    strokeDasharray='4 3'
                                    dot={false}
                                    connectNulls
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className='flex h-full items-center justify-center font-mono text-[12px] uppercase tracking-wider text-muted-foreground'>
                            No data for this range yet
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
