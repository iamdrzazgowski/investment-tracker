'use client';

import { BenchmarkChart } from '@/features/analytics/components/benchmark-chart';

import { CategoryPerformanceChart } from '@/features/analytics/components/category-performance-chart';
import { HoldingsRanked } from '@/features/analytics/components/holdings-ranked';
import { MonthlyReturnsChart } from '@/features/analytics/components/monthly-returns-chart';

import { Delta } from '@/components/shared/delta';
import { PageHeader } from '@/components/shared/page-header';
import { fmtEUR, fmtPct } from '@/lib/format';

import { INITIAL_CASH, INITIAL_HOLDINGS, type Category, type EnrichedHolding } from '@/lib/data';

const Stat = ({
    label,
    value,
    delta,
    sub,
}: {
    label: string;
    value: string;
    delta?: number;
    sub?: string;
}) => (
    <div className='bg-card p-4'>
        <div className='mb-1.5 text-xs text-muted-foreground'>{label}</div>

        <div className='mb-1 text-[17px] font-semibold tracking-tight'>
            {value}
        </div>

        {delta !== undefined && <Delta value={delta} size='sm' />}

        {sub && (
            <div className='text-[11.5px] text-muted-foreground'>{sub}</div>
        )}
    </div>
);

export default function AnalyticsPage() {
    const enriched: EnrichedHolding[] = INITIAL_HOLDINGS.map((holding) => {
        const value = holding.shares * holding.price;
        const invested = holding.shares * holding.avg;
        const pl = value - invested;
        const plPct = invested > 0 ? (pl / invested) * 100 : 0;

        return {
            ...holding,
            value,
            invested,
            pl,
            plPct,
        };
    });

    let holdingsValue = 0;
    let totalInvested = 0;
    let inProfit = 0;
    let best: (typeof enriched)[number] | null = null;
    let worst: (typeof enriched)[number] | null = null;
    let largest: (typeof enriched)[number] | null = null;
    const valueByCategory = new Map<Category, number>();

    for (const holding of enriched) {
        holdingsValue += holding.value;
        totalInvested += holding.invested;
        if (holding.pl >= 0) inProfit += 1;
        if (!best || holding.plPct > best.plPct) best = holding;
        if (!worst || holding.plPct < worst.plPct) worst = holding;
        if (!largest || holding.value > largest.value) largest = holding;
        valueByCategory.set(
            holding.cat,
            (valueByCategory.get(holding.cat) ?? 0) + holding.value,
        );
    }

    const totalValue = holdingsValue + INITIAL_CASH;

    const totalPL = holdingsValue - totalInvested;

    const totalPLPct = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

    const totals = {
        totalValue,
        holdingsValue,
        cash: INITIAL_CASH,
        totalPL,
        totalPLPct,
    };

    const allocation = (['Stocks', 'ETFs', 'Crypto', 'Cash'] as Category[]).map(
        (category) => {
            const value =
                category === 'Cash'
                    ? INITIAL_CASH
                    : (valueByCategory.get(category) ?? 0);

            return {
                category,
                value,
                pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
            };
        },
    );

    const diversification = allocation.filter((a) => a.value > 0).length;

    const largestPct = largest ? (largest.value / totals.totalValue) * 100 : 0;

    const cashRatio = (totals.cash / totals.totalValue) * 100;

    const winRate = enriched.length ? (inProfit / enriched.length) * 100 : 0;

    return (
        <>
            <PageHeader eyebrow='Insights' title='Analytics' />

            <div className='mb-1 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
                <Stat
                    label='Best performer'
                    value={best ? best.t : '—'}
                    delta={best?.plPct}
                />

                <Stat
                    label='Weakest performer'
                    value={worst ? worst.t : '—'}
                    delta={worst?.plPct}
                />

                <Stat
                    label='Asset classes held'
                    value={`${diversification} / 4`}
                />

                <Stat label='Total return' value={fmtPct(totals.totalPLPct)} />
            </div>

            <div className='mb-5 mt-px grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
                <Stat
                    label='Largest position'
                    value={largest ? largest.t : '—'}
                    sub={`${largestPct.toFixed(1)}% of portfolio`}
                />

                <Stat
                    label='Cash ratio'
                    value={`${cashRatio.toFixed(1)}%`}
                    sub={`${fmtEUR(totals.cash)} available`}
                />

                <Stat
                    label='Win rate'
                    value={`${winRate.toFixed(0)}%`}
                    sub={`${inProfit} of ${enriched.length} in profit`}
                />

                <Stat label='Open positions' value={`${enriched.length}`} />
            </div>

            <div className='mb-5'>
                <BenchmarkChart seed={5} />
            </div>

            <div className='mb-5 grid gap-5 lg:grid-cols-2'>
                <CategoryPerformanceChart enriched={enriched} />
                <MonthlyReturnsChart />
            </div>

            <HoldingsRanked enriched={enriched} />
        </>
    );
}
