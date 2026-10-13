import { Delta } from '@/components/shared/delta';
import { fmtEUR, fmtPct, fmtSigned } from '@/lib/format';

export function StatRow({ totals: _totals }: { totals?: unknown }) {
    void _totals;
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
        <dl className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
            {stats.map((s) => (
                <div key={s.label} className='bg-card p-5 md:p-6'>
                    <dt className='mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        {s.label}
                    </dt>
                    <dd className='m-0'>
                        <div className='mb-1 font-mono text-xl font-medium tracking-tight tabular-nums md:text-2xl'>
                            {s.value}
                        </div>
                        {s.delta !== undefined && (
                            <Delta value={s.delta} size='sm' />
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
