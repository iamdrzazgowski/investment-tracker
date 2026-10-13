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
import { Delta } from '@/components/shared/delta';
import { genSeries, RANGE_CHANGE, type Range } from '@/lib/data';
import { fmtEUR } from '@/lib/format';
import { RangeTabs } from '@/components/shared/range-tabs';

export function PerformanceChart({
    seed,
    endValue,
    height = 320,
    showValue = true,
}: {
    seed: number;
    endValue: number;
    height?: number;
    /** Hide the headline value when the page already shows it (e.g. dashboard hero). */
    showValue?: boolean;
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
        <Card className='gap-5 p-5 md:p-6'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                    {showValue && (
                        <div className='mb-1 font-mono text-2xl font-semibold tracking-tight tabular-nums'>
                            {fmtEUR(endValue)}
                        </div>
                    )}
                    <div className='flex items-center gap-2'>
                        <Delta value={changePct} />
                        <span className='font-mono text-[11.5px] uppercase tracking-wider text-muted-foreground'>
                            {range}
                        </span>
                    </div>
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
                                    stopOpacity={0.1}
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
                                    <div className='rounded-md bg-foreground px-2.5 py-1.5 font-mono text-xs font-medium tabular-nums text-background'>
                                        {fmtEUR(payload[0].value as number)}
                                    </div>
                                ) : null
                            }
                        />
                        <Area
                            type='monotone'
                            dataKey='v'
                            stroke={stroke}
                            strokeWidth={1.5}
                            fill={`url(#${gradId})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
