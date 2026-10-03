'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { sparkline } from '@/lib/data';

export function Sparkline({
    seed,
    up,
    width = 96,
    height = 32,
}: {
    seed: number;
    up: boolean;
    width?: number;
    height?: number;
}) {
    const data = React.useMemo(() => sparkline(seed, up), [seed, up]);
    return (
        <div style={{ width, height }}>
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={data}>
                    <Line
                        type='monotone'
                        dataKey='v'
                        stroke={up ? 'var(--positive)' : 'var(--destructive)'}
                        strokeWidth={1.6}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
