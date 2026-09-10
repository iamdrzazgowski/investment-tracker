'use client';

import { BenchmarkChart } from '@/components/benchmark-chart';

import {
    CategoryPerformanceChart,
    HoldingsRanked,
    MonthlyReturnsChart,
} from '@/components/analytics-charts';

import { Delta } from '@/components/delta';
import { PageHeader } from '@/components/page-header';
import { fmtEUR, fmtPct } from '@/lib/format';

import { INITIAL_CASH, INITIAL_HOLDINGS, type Category } from '@/lib/data';

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
    const enriched = INITIAL_HOLDINGS.map((holding) => {
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

    const holdingsValue = enriched.reduce(
        (sum, holding) => sum + holding.value,
        0,
    );

    const totalValue = holdingsValue + INITIAL_CASH;

    const totalInvested = enriched.reduce(
        (sum, holding) => sum + holding.invested,
        0,
    );

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
                    : enriched
                          .filter((holding) => holding.cat === category)
                          .reduce((sum, holding) => sum + holding.value, 0);

            return {
                category,
                value,
                pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
            };
        },
    );

    const best = enriched.length
        ? [...enriched].sort((a, b) => b.plPct - a.plPct)[0]
        : null;

    const worst = enriched.length
        ? [...enriched].sort((a, b) => a.plPct - b.plPct)[0]
        : null;

    const diversification = allocation.filter((a) => a.value > 0).length;

    const largest = enriched.length
        ? [...enriched].sort((a, b) => b.value - a.value)[0]
        : null;

    const largestPct = largest ? (largest.value / totals.totalValue) * 100 : 0;

    const cashRatio = (totals.cash / totals.totalValue) * 100;

    const inProfit = enriched.filter((h) => h.pl >= 0).length;

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
