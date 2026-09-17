'use client';

import * as React from 'react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Delta } from '@/components/delta';
import { RangeTabs } from './range-tabs';
import { getAssetHistoryAction } from '@/actions/asset.actions';
import { fmtEUR } from '@/lib/format';
import type { Range } from '@/lib/data';

type Point = { i: number; v: number; date: string };

export function AssetPerformanceChart({
    ticker,
    initialRange,
    initialData,
}: {
    ticker: string;
    initialRange: Range;
    initialData: Point[];
}) {
    const [range, setRange] = React.useState<Range>(initialRange);
    const [data, setData] = React.useState<Point[]>(initialData);
    const [isPending, startTransition] = React.useTransition();

    function handleRangeChange(next: Range) {
        setRange(next);
        startTransition(async () => {
            const points = await getAssetHistoryAction(ticker, next);
            setData(points);
        });
    }

    const endValue = data.at(-1)?.v ?? 0;
    const startValue = data[0]?.v ?? endValue;
    const changePct = startValue
        ? ((endValue - startValue) / startValue) * 100
        : 0;
    const positive = endValue >= startValue;
    const stroke = positive ? 'var(--positive)' : 'var(--destructive)';

    return (
        <Card className='p-5'>
            <div className='mb-1.5 flex flex-wrap items-start justify-between gap-3'>
                <div>
                    <div className='font-mono text-2xl font-bold tracking-tight'>
                        {fmtEUR(endValue)}
                    </div>
                    <Delta value={changePct} />
                </div>
                <RangeTabs value={range} onChange={handleRangeChange} />
            </div>
            <div
                style={{
                    height: 300,
                    opacity: isPending ? 0.5 : 1,
                    transition: 'opacity 150ms',
                }}>
                <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart
                        data={data}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient
                                id={`grad-${ticker}`}
                                x1='0'
                                y1='0'
                                x2='0'
                                y2='1'>
                                <stop
                                    offset='0%'
                                    stopColor={stroke}
                                    stopOpacity={0.16}
                                />
                                <stop
                                    offset='100%'
                                    stopColor={stroke}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey='i' hide />
                        <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip
                            content={({ active, payload }) =>
                                active && payload?.length ? (
                                    <div className='rounded-md bg-foreground px-2.5 py-1.5 font-mono text-xs font-semibold text-background'>
                                        {fmtEUR(payload[0].value as number)}
                                    </div>
                                ) : null
                            }
                        />
                        <Area
                            type='monotone'
                            dataKey='v'
                            stroke={stroke}
                            strokeWidth={2}
                            fill={`url(#grad-${ticker})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
