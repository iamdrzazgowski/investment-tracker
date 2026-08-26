import { Delta } from '@/components/delta';
import { fmtEUR, fmtPct, fmtSigned } from '@/lib/format';

export function StatRow({ totals }: { totals: any }) {
    const stats = [
        { label: 'Total invested', value: fmtEUR(4000) },
        {
            label: 'Total profit / loss',
            value: fmtSigned(1000),
            delta: -10,
        },
        {
            label: "Today's change",
            value: fmtSigned(1000),
            delta: 7,
        },
        { label: 'Total return', value: fmtPct(7) },
    ];

    return (
        <div className='mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
            {stats.map((s) => (
                <div key={s.label} className='bg-card p-4'>
                    <div className='mb-1.5 text-xs text-muted-foreground'>
                        {s.label}
                    </div>
                    <div className='mb-1 font-mono text-[17px] font-semibold tracking-tight'>
                        {s.value}
                    </div>
                    {s.delta !== undefined && (
                        <Delta value={s.delta} size='sm' />
                    )}
                </div>
            ))}
        </div>
    );
}
