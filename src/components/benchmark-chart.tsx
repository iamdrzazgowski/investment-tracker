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
import { RangeTabs } from '@/components/range-tabs';
import { genCompareSeries, type Range } from '@/lib/data';
import { fmtPct } from '@/lib/format';

export function BenchmarkChart({ seed }: { seed: number }) {
    const [range, setRange] = React.useState<Range>('1Y');
    const data = React.useMemo(
        () => genCompareSeries(seed, range),
        [seed, range],
    );
    const last = data[data.length - 1];

    return (
        <Card>
            <CardHeader className='flex w-full flex-row items-start justify-between gap-3 space-y-0'>
                <div>
                    <CardTitle>Portfolio vs. benchmark</CardTitle>

                    <div className='mt-1.5 flex gap-4 text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1.5'>
                            <i className='inline-block h-2 w-2 rounded-sm bg-positive' />
                            Your portfolio
                            <b className='font-mono text-foreground'>
                                {fmtPct(last.portfolio - 100)}
                            </b>
                        </span>

                        <span className='flex items-center gap-1.5'>
                            <i className='inline-block h-2 w-2 rounded-sm bg-muted-foreground/50' />
                            MSCI World
                            <b className='font-mono text-foreground'>
                                {fmtPct(last.benchmark - 100)}
                            </b>
                        </span>
                    </div>
                </div>

                <RangeTabs value={range} onChange={setRange} />
            </CardHeader>
            <CardContent>
                <div style={{ height: 220 }}>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart
                            data={data}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <XAxis dataKey='i' hide />
                            <YAxis
                                hide
                                domain={['dataMin - 2', 'dataMax + 2']}
                            />
                            <Tooltip
                                content={({ active, payload }) =>
                                    active && payload && payload.length ? (
                                        <div className='rounded-md bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background'>
                                            Portfolio{' '}
                                            {fmtPct(
                                                (payload[0].payload as any)
                                                    .portfolio - 100,
                                            )}{' '}
                                            · Benchmark{' '}
                                            {fmtPct(
                                                (payload[0].payload as any)
                                                    .benchmark - 100,
                                            )}
                                        </div>
                                    ) : null
                                }
                            />
                            <Line
                                type='monotone'
                                dataKey='portfolio'
                                stroke='var(--positive)'
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type='monotone'
                                dataKey='benchmark'
                                stroke='var(--muted-foreground)'
                                strokeWidth={1.6}
                                strokeDasharray='4 3'
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
