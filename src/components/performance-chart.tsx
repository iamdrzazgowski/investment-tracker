'use client';

import { useMemo, useState } from 'react';
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
import { genSeries, RANGE_CHANGE, type Range } from '@/lib/data';
import { fmtEUR } from '@/lib/format';
import { RangeTabs } from './range-tabs';

export function PerformanceChart({
    seed,
    endValue,
    height = 300,
}: {
    seed: number;
    endValue: number;
    height?: number;
}) {
    const [range, setRange] = useState<Range>('1M');
    const data = useMemo(
        () => genSeries(seed, endValue, range),
        [seed, endValue, range],
    );
    const changePct =
        RANGE_CHANGE[range] *
        (seed % 2 === 0 ? 1 : 0.7) *
        (seed % 3 === 0 ? -1 : 1);
    const positive = data[data.length - 1].v >= data[0].v;
    const stroke = positive ? 'var(--positive)' : 'var(--destructive)';
    const gradId = `grad-${seed}`;

    return (
        <Card className='p-5'>
            <div className='mb-1.5 flex flex-wrap items-start justify-between gap-3'>
                <div>
                    <div className='font-mono text-2xl font-bold tracking-tight'>
                        {fmtEUR(endValue)}
                    </div>
                    <Delta value={changePct} />
                </div>
                <RangeTabs value={range} onChange={setRange} />
            </div>
            <div style={{ height }}>
                <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart
                        data={data}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient
                                id={gradId}
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
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip
                            cursor={{
                                stroke: 'var(--border)',
                                strokeWidth: 1,
                            }}
                            content={({ active, payload }) =>
                                active && payload && payload.length ? (
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
                            fill={`url(#${gradId})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
