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
        <div
            role='group'
            aria-label='Time range'
            className='inline-flex items-center gap-0.5 rounded-lg border border-border p-0.5'>
            {RANGES.map((r) => (
                <button
                    key={r}
                    type='button'
                    aria-pressed={value === r}
                    onClick={() => onChange(r)}
                    className={cn(
                        'rounded-md px-2.5 py-1 font-mono text-[11.5px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
                        value === r &&
                            'bg-primary text-primary-foreground hover:text-primary-foreground',
                    )}>
                    {r}
                </button>
            ))}
        </div>
    );
}
