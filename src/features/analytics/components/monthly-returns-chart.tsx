'use client';

import * as React from 'react';
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
import { mulberry32 } from '@/lib/data';

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
                                    active && payload?.length ? (
                                        <ChartTooltipValue
                                            value={
                                                payload[0].value as number
                                            }
                                        />
                                    ) : null
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
