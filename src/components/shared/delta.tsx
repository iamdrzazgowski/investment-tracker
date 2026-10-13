import { cn } from '@/lib/utils';
import { fmtPct, fmtSigned } from '@/lib/format';

export function Delta({
    value,
    pct = true,
    size = 'md',
}: {
    value: number;
    pct?: boolean;
    size?: 'sm' | 'md';
}) {
    const positive = value >= 0;
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-mono font-medium tabular-nums',
                size === 'sm' ? 'text-xs' : 'text-[13.5px]',
                positive ? 'text-positive' : 'text-destructive',
            )}>
            <span aria-hidden className='text-[0.7em] leading-none'>
                {positive ? '▲' : '▼'}
            </span>
            {pct ? fmtPct(value) : fmtSigned(value)}
        </span>
    );
}
