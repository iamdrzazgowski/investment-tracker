import { fmtPct } from '@/lib/format';

export function ChartTooltipValue({ value }: { value: number }) {
    return (
        <div className='rounded-md bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background'>
            {fmtPct(value)}
        </div>
    );
}
