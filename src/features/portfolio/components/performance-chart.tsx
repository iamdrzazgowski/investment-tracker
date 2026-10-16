'use client';

import { useId, useMemo, useState } from 'react';
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
import { fmtCurrency } from '@/lib/format';
import { RangeTabs } from '@/components/shared/range-tabs';
import type { Range } from '@/lib/market-data/range';
import { RANGE_WINDOW_MS } from '@/lib/market-data/range-config';
import { downsample } from '@/lib/analytics/downsample';

export interface PerformancePoint {
    /** Unix ms */
    t: number;
    v: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_FLAT_SPAN_MS = 30 * DAY_MS;


const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

export function PerformanceChart({
    points,
    currency,
    height = 320,
    showValue = true,
}: {
    /** Snapshoty wartości portfela rosnąco po czasie; ostatni punkt = "teraz". */
    points: PerformancePoint[];
    currency: string;
    height?: number;
    /** Hide the headline value when the page already shows it (e.g. dashboard hero). */
    showValue?: boolean;
}) {
    const [range, setRange] = useState<Range>('1M');
    const gradId = `grad-${useId().replace(/:/g, '')}`;

    const { data, isFlat } = useMemo(() => {
        if (points.length === 0) return { data: [], isFlat: false };
        const window = RANGE_WINDOW_MS[range];
        const current = points[points.length - 1];
        const inRange =
            window == null
                ? points
                : points.filter((p) => p.t >= current.t - window);
        if (inRange.length >= 2) {
            return { data: downsample(inRange), isFlat: false };
        }
        // Za mało snapshotów w zakresie — stała linia z bieżącą wartością.
        return {
            data: [
                { t: current.t - (window ?? DEFAULT_FLAT_SPAN_MS), v: current.v },
                current,
            ],
            isFlat: true,
        };
    }, [points, range]);

    const hasData = data.length >= 2;
    const first = data[0]?.v ?? 0;
    const last = data[data.length - 1]?.v ?? 0;
    const changePct = hasData && first > 0 ? ((last - first) / first) * 100 : 0;
    const positive = last >= first;
    const stroke = positive ? 'var(--positive)' : 'var(--destructive)';

    return (
        <Card className='gap-5 p-5 md:p-6'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                    {showValue && (
                        <div className='mb-1 font-mono text-2xl font-semibold tracking-tight tabular-nums'>
                            {fmtCurrency(last, currency)}
                        </div>
                    )}
                    <div className='flex items-center gap-2'>
                        {hasData && <Delta value={changePct} />}
                        <span className='font-mono text-[11.5px] uppercase tracking-wider text-muted-foreground'>
                            {range}
                        </span>
                    </div>
                </div>
                <RangeTabs value={range} onChange={setRange} />
            </div>
            <div style={{ height }}>
                {hasData ? (
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
                            <XAxis
                                dataKey='t'
                                type='number'
                                scale='time'
                                domain={['dataMin', 'dataMax']}
                                hide
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 5', 'dataMax + 5']}
                            />
                            <Tooltip
                                cursor={{
                                    stroke: 'var(--border)',
                                    strokeWidth: 1,
                                }}
                                content={({ active, payload }) =>
                                    active && payload && payload.length ? (
                                        <div className='rounded-md bg-foreground px-2.5 py-1.5 font-mono text-xs font-medium tabular-nums text-background'>
                                            <div>
                                                {fmtCurrency(
                                                    payload[0].value as number,
                                                    currency,
                                                )}
                                            </div>
                                            {!isFlat && (
                                                <div className='opacity-70'>
                                                    {dateFormatter.format(
                                                        payload[0].payload.t,
                                                    )}
                                                </div>
                                            )}
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
                ) : (
                    <div className='flex h-full items-center justify-center font-mono text-[12px] uppercase tracking-wider text-muted-foreground'>
                        No portfolio data yet
                    </div>
                )}
            </div>
        </Card>
    );
}
