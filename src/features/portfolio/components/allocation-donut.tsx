'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CATEGORY_COLORS, type Category } from '@/lib/data';

export interface AllocationSlice {
    name: Category;
    value: number;
    pct: number;
}

export function AllocationDonut({
    allocation,
}: {
    allocation: AllocationSlice[];
}) {
    if (allocation.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Asset allocation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='py-6 text-center text-sm text-muted-foreground'>
                        No allocation data yet.
                    </p>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Asset allocation</CardTitle>
            </CardHeader>

            <CardContent className='flex flex-col items-center gap-6 sm:flex-row'>
                <div style={{ width: 140, height: 140 }} className='shrink-0'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                            <Pie
                                data={allocation}
                                dataKey='value'
                                nameKey='name'
                                innerRadius={52}
                                outerRadius={68}
                                paddingAngle={1}
                                stroke='none'>
                                {allocation.map((a) => (
                                    <Cell
                                        key={a.name}
                                        fill={CATEGORY_COLORS[a.name]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <ul className='w-full flex-1 space-y-2.5'>
                    {allocation.map((a) => (
                        <li
                            key={a.name}
                            className='flex items-center gap-2.5 text-[13px]'>
                            <span
                                className='h-2.5 w-2.5 shrink-0 rounded-[2px]'
                                style={{
                                    background: CATEGORY_COLORS[a.name],
                                }}
                            />

                            <span className='flex-1'>{a.name}</span>

                            <span className='font-mono text-[12.5px] tabular-nums text-muted-foreground'>
                                {a.pct.toFixed(1)}%
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
