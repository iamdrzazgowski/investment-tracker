'use client';

const PAD = 2;
const STROKE_WIDTH = 1.6;

/**
 * Fritsch–Carlson monotone cubic tangents — reproduces the `type='monotone'`
 * curve recharts drew for the trend column, rendered as a single SVG path
 * instead of a full recharts chart instance per table row.
 */
function buildSparklinePath(
    values: number[],
    width: number,
    height: number,
): string {
    const n = values.length;
    const innerW = width - PAD * 2;
    const innerH = height - PAD * 2;

    let min = Infinity;
    let max = -Infinity;
    for (const v of values) {
        if (v < min) min = v;
        if (v > max) max = v;
    }
    const spanY = max - min || 1;

    const x = (i: number) => PAD + (i / (n - 1)) * innerW;
    const y = (v: number) => PAD + innerH - ((v - min) / spanY) * innerH;

    // Slopes between consecutive points (uniform spacing, index space).
    const d: number[] = [];
    for (let i = 0; i < n - 1; i++) d.push(values[i + 1] - values[i]);

    // Tangents: zero at sign changes, harmonic-weighted average otherwise,
    // clamped so the curve never overshoots the data.
    const m: number[] = [d[0]];
    for (let i = 1; i < n - 1; i++) {
        if (d[i - 1] * d[i] <= 0) {
            m.push(0);
        } else {
            const avg = (d[i - 1] + d[i]) / 2;
            const clamp = 3 * Math.min(Math.abs(d[i - 1]), Math.abs(d[i]));
            m.push(Math.max(-clamp, Math.min(clamp, avg)));
        }
    }
    m.push(d[n - 2]);

    // Terminal tangents are halved toward zero (recharts-like easing).
    m[0] = d[0] / 2;
    m[n - 1] = d[n - 2] / 2;

    const dx = innerW / (n - 1);
    const seg = dx / 3;
    const parts: string[] = [`M ${x(0).toFixed(1)} ${y(values[0]).toFixed(1)}`];

    for (let i = 0; i < n - 1; i++) {
        const c1x = x(i) + seg;
        const c1y = y(values[i] + m[i] * seg);
        const c2x = x(i + 1) - seg;
        const c2y = y(values[i + 1] - m[i + 1] * seg);
        parts.push(
            `C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x(i + 1).toFixed(1)} ${y(values[i + 1]).toFixed(1)}`,
        );
    }

    return parts.join(' ');
}

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

    const stroke = up ? 'var(--positive)' : 'var(--destructive)';

    // A single data point drew nothing visible in recharts; show a dot instead.
    if (values.length === 1) {
        return (
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                role='presentation'
                aria-hidden>
                <circle
                    cx={width / 2}
                    cy={height / 2}
                    r={STROKE_WIDTH}
                    fill={stroke}
                />
            </svg>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role='presentation'
            aria-hidden>
            <path
                d={buildSparklinePath(values, width, height)}
                fill='none'
                stroke={stroke}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap='round'
            />
        </svg>
    );
}
