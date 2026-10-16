import { Delta } from '@/components/shared/delta';
import { fmtCurrency, fmtPct, fmtSignedCurrency } from '@/lib/format';

export interface PortfolioTotals {
    invested: number;
    pl: number;
    plPct: number;
    dayChange: number;
    dayChangePct: number;
    currency: string;
}

export function StatRow({ totals }: { totals: PortfolioTotals }) {
    const { currency } = totals;
    const stats = [
        {
            label: 'Total invested',
            value: fmtCurrency(totals.invested, currency),
        },
        {
            label: 'Total profit / loss',
            value: fmtSignedCurrency(totals.pl, currency),
            delta: totals.plPct,
        },
        {
            label: "Today's change",
            value: fmtSignedCurrency(totals.dayChange, currency),
            delta: totals.dayChangePct,
        },
        { label: 'Total return', value: fmtPct(totals.plPct) },
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
