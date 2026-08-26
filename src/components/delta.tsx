import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
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
                'inline-flex items-center gap-0.5 font-semibold',
                size === 'sm' ? 'text-xs' : 'text-[13.5px]',
                positive ? 'text-positive' : 'text-destructive',
            )}>
            {positive ? (
                <ArrowUpRight size={size === 'sm' ? 12 : 14} />
            ) : (
                <ArrowDownRight size={size === 'sm' ? 12 : 14} />
            )}
            {pct ? fmtPct(value) : fmtSigned(value)}
        </span>
    );
}
