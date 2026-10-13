import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Delta } from '@/components/shared/delta';
import { CATEGORY_COLORS, type Category, type EnrichedHolding } from '@/lib/data';
import { fmtEUR } from '@/lib/format';

export function CategoryBreakdown({
    enriched,
    cash,
    totalValue,
}: {
    enriched: EnrichedHolding[];
    cash: number;
    totalValue: number;
}) {
    const cats = (['Stocks', 'ETFs', 'Crypto', 'Cash'] as Category[]).map(
        (cat) => {
            const rows =
                cat === 'Cash' ? [] : enriched.filter((h) => h.cat === cat);
            const value =
                cat === 'Cash'
                    ? cash
                    : rows.reduce((s: number, h) => s + h.value, 0);
            const invested =
                cat === 'Cash'
                    ? cash
                    : rows.reduce((s: number, h) => s + h.invested, 0);
            const pl = value - invested;
            const plPct = invested ? (pl / invested) * 100 : 0;
            return {
                cat,
                value,
                plPct,
                pct: totalValue ? (value / totalValue) * 100 : 0,
                count: rows.length,
            };
        },
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Breakdown by category</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                <ul className='divide-y divide-border'>
                    {cats.map((c) => (
                        <li key={c.cat} className='py-3 first:pt-0 last:pb-0'>
                            <div className='mb-2 flex items-center gap-2.5 text-[13px]'>
                                <span className='w-16 shrink-0 font-semibold'>
                                    {c.cat}
                                </span>
                                <span className='flex-1 text-xs text-muted-foreground'>
                                    {c.cat === 'Cash'
                                        ? 'Cash balance'
                                        : `${c.count} position${c.count === 1 ? '' : 's'}`}
                                </span>
                                <span className='font-mono font-semibold'>
                                    {fmtEUR(c.value)}
                                </span>
                                {c.cat !== 'Cash' ? (
                                    <Delta value={c.plPct} size='sm' />
                                ) : (
                                    <span className='text-xs text-muted-foreground'>
                                        —
                                    </span>
                                )}
                            </div>
                            <div className='h-1 overflow-hidden rounded-full bg-muted'>
                                <div
                                    className='h-full rounded-full'
                                    style={{
                                        width: `${c.pct}%`,
                                        background: CATEGORY_COLORS[c.cat],
                                    }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
