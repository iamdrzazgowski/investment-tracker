'use client';

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
import { ChartTooltipValue } from '@/components/shared/chart-tooltip';
import type { EnrichedHolding } from '@/lib/data';

export function CategoryPerformanceChart({
    enriched,
}: {
    enriched: EnrichedHolding[];
}) {
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
                                    active && payload?.length ? (
                                        <ChartTooltipValue
                                            value={
                                                payload[0].value as number
                                            }
                                        />
                                    ) : null
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
