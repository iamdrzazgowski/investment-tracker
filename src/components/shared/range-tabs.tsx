import { RANGES, type Range } from '@/lib/market-data/range';
import { cn } from '@/lib/utils';

export function RangeTabs({
    value,
    onChange,
}: {
    value: Range;
    onChange: (r: Range) => void;
}) {
    return (
        <div className='inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted p-1'>
            {RANGES.map((r) => (
                <button
                    key={r}
                    onClick={() => onChange(r)}
                    className={cn(
                        'rounded-md px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors',
                        value === r && 'bg-card text-foreground shadow-sm',
                    )}>
                    {r}
                </button>
            ))}
        </div>
    );
}
