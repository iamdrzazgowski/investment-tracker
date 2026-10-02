'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarBadge } from '@/components/avatar-badge';
import { Delta } from '@/components/delta';
import { mulberry32 } from '@/lib/data';
import { fmtPct } from '@/lib/format';

const tooltipBox = (v: number) => (
    <div className='rounded-md bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background'>
        {fmtPct(v)}
    </div>
);

export function CategoryPerformanceChart({ enriched }) {
    const totalsByCategory = new Map<string, { invested: number; pl: number }>();
    for (const h of enriched) {
        const entry = totalsByCategory.get(h.cat) ?? { invested: 0, pl: 0 };
        entry.invested += h.invested;
        entry.pl += h.pl;
        totalsByCategory.set(h.cat, entry);
    }
    const data = (['Stocks', 'ETFs', 'Crypto'] as const).map((cat) => {
        const totals = totalsByCategory.get(cat) ?? { invested: 0, pl: 0 };
        return {
            cat,
            plPct: totals.invested ? (totals.pl / totals.invested) * 100 : 0,
        };
    });
    return (
        <Card>
            <CardHeader>
                <CardTitle>Return by category</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                <div style={{ height: 200 }}>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                            data={data}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                            barSize={44}>
                            <CartesianGrid
                                vertical={false}
                                stroke='var(--border)'
                            />
                            <XAxis
                                dataKey='cat'
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    fontSize: 12,
                                    fill: 'var(--muted-foreground)',
                                }}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)' }}
                                content={({ active, payload }) =>
                                    active && payload?.length
                                        ? tooltipBox(payload[0].value as number)
                                        : null
                                }
                            />
                            <Bar dataKey='plPct' radius={[5, 5, 5, 5]}>
                                {data.map((d) => (
                                    <Cell
                                        key={d.cat}
                                        fill={
                                            d.plPct >= 0
                                                ? 'var(--positive)'
                                                : 'var(--destructive)'
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function MonthlyReturnsChart() {
    const data = React.useMemo(() => {
        const rand = mulberry32(77);
        return ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m) => ({
            m,
            r: (rand() - 0.35) * 9,
        }));
    }, []);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly returns</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                <div style={{ height: 200 }}>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                            data={data}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                            barSize={28}>
                            <CartesianGrid
                                vertical={false}
                                stroke='var(--border)'
                            />
                            <XAxis
                                dataKey='m'
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    fontSize: 12,
                                    fill: 'var(--muted-foreground)',
                                }}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)' }}
                                content={({ active, payload }) =>
                                    active && payload?.length
                                        ? tooltipBox(payload[0].value as number)
                                        : null
                                }
                            />
                            <Bar dataKey='r' radius={[5, 5, 5, 5]}>
                                {data.map((d, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            d.r >= 0
                                                ? 'var(--positive)'
                                                : 'var(--destructive)'
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function HoldingsRanked({ enriched }) {
    const router = useRouter();
    const sorted = enriched.toSorted((a, b) => b.plPct - a.plPct);
    let maxAbs = 1;
    for (const h of sorted) {
        const abs = Math.abs(h.plPct);
        if (abs > maxAbs) maxAbs = abs;
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Holdings ranked by return</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                <ul className='divide-y divide-border'>
                    {sorted.map((h) => (
                        <li
                            key={h.t}
                            className='grid cursor-pointer grid-cols-[110px_1fr_74px] items-center gap-3 py-2.5 first:pt-0 last:pb-0'
                            onClick={() => router.push(`/asset/${h.t}`)}>
                            <div className='flex items-center gap-2'>
                                <AvatarBadge t={h.t} cat={h.cat} />
                                <span className='text-[13px] font-semibold'>
                                    {h.t}
                                </span>
                            </div>
                            <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
                                <div
                                    className='h-full rounded-full'
                                    style={{
                                        width: `${(Math.abs(h.plPct) / maxAbs) * 100}%`,
                                        background:
                                            h.plPct >= 0
                                                ? 'var(--positive)'
                                                : 'var(--destructive)',
                                    }}
                                />
                            </div>
                            <Delta value={h.plPct} size='sm' />
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
