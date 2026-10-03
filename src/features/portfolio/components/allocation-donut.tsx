'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CATEGORY_COLORS, type Category } from '@/lib/data';

const ALLOCATION = [
    {
        name: 'Stocks' as Category,
        value: 18500,
        pct: 48.2,
    },
    {
        name: 'ETFs' as Category,
        value: 11200,
        pct: 29.2,
    },
    {
        name: 'Crypto' as Category,
        value: 4550,
        pct: 11.8,
    },
    {
        name: 'Cash' as Category,
        value: 4140,
        pct: 10.8,
    },
];

export function AllocationDonut() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Asset allocation</CardTitle>
            </CardHeader>

            <CardContent className='flex items-center gap-5'>
                <div style={{ width: 140, height: 140 }} className='shrink-0'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                            <Pie
                                data={ALLOCATION}
                                dataKey='value'
                                nameKey='name'
                                innerRadius={50}
                                outerRadius={68}
                                paddingAngle={2}
                                stroke='none'>
                                {ALLOCATION.map((a) => (
                                    <Cell
                                        key={a.name}
                                        fill={CATEGORY_COLORS[a.name]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <ul className='flex-1 space-y-1.5'>
                    {ALLOCATION.map((a) => (
                        <li
                            key={a.name}
                            className='flex items-center gap-2 text-[12.5px]'>
                            <span
                                className='h-2 w-2 shrink-0 rounded-sm'
                                style={{
                                    background: CATEGORY_COLORS[a.name],
                                }}
                            />

                            <span className='flex-1'>{a.name}</span>

                            <span className='font-semibold text-muted-foreground'>
                                {a.pct.toFixed(1)}%
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
