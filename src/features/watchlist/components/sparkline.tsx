'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';

export function Sparkline({
    values,
    up,
    width = 96,
    height = 32,
}: {
    values: number[];
    up: boolean;
    width?: number;
    height?: number;
}) {
    if (values.length === 0) {
        return (
            <span className='font-mono text-[12px] text-muted-foreground'>
                —
            </span>
        );
    }

    const data = values.map((v, i) => ({ i, v }));

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
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
