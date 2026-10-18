import { AppShell } from '@/components/shared/app-shell';
import { BenchmarkChart } from '@/features/analytics/components/benchmark-chart';
import { CategoryPerformanceChart } from '@/features/analytics/components/category-performance-chart';
import { HoldingsRanked } from '@/features/analytics/components/holdings-ranked';
import { MonthlyReturnsChart } from '@/features/analytics/components/monthly-returns-chart';
import type { AnalyticsHolding } from '@/features/analytics/types';

import { Delta } from '@/components/shared/delta';
import { PageHeader } from '@/components/shared/page-header';
import {
    buildPerformanceIndex,
    monthlyReturns,
    type ValueSample,
} from '@/lib/analytics/performance';
import { toCategory } from '@/lib/asset-category';
import { requirePortfolio } from '@/lib/auth-helpers';
import type { Category } from '@/lib/data';
import { fmtCurrency, fmtPct } from '@/lib/format';
import { BENCHMARK, getBenchmarkHistory } from '@/lib/market-data/benchmark';
import { valuePortfolio } from '@/lib/portfolio-valuation';
import { getHoldingsByPortfolio } from '@/lib/repositories/holding.repository';
import { getSnapshotSamples } from '@/lib/repositories/portfolio-snapshot.repository';
import { getTransactionTimes } from '@/lib/repositories/transaction.repository';

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
    <div className='bg-card p-5 md:p-6'>
        <div className='mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
            {label}
        </div>

        <div className='mb-1 font-mono text-xl font-medium tracking-tight tabular-nums md:text-2xl'>
            {value}
        </div>

        {delta !== undefined && <Delta value={delta} size='sm' />}

        {sub && (
            <div className='text-[11.5px] text-muted-foreground'>{sub}</div>
        )}
    </div>
);

// Historia kończy się bieżącą wyceną, żeby indeks był aktualny także między
// uruchomieniami crona.
function withLiveSample(
    samples: ValueSample[],
    live: Omit<ValueSample, 't'>,
): ValueSample[] {
    return [...samples, { t: Date.now(), ...live }];
}

export default async function AnalyticsPage() {
    const portfolio = await requirePortfolio();

    // Dependency-based parallelization: every fetch starts at the earliest
    // possible moment — the two dependent chains (benchmark ← snapshots,
    // valuation ← holdings) kick off the instant their input resolves,
    // instead of waiting for the sibling fetches to finish.
    const snapshotPromise = getSnapshotSamples(portfolio.id);
    const holdingsPromise = getHoldingsByPortfolio(portfolio.id);
    const transactionTimesPromise = getTransactionTimes(portfolio.id);

    const benchmarkPromise = snapshotPromise.then((samples) =>
        getBenchmarkHistory(samples[0]?.t ?? null),
    );
    const valuationPromise = holdingsPromise.then((holdings) =>
        valuePortfolio({ ...portfolio, holdings }, { strictFx: false }),
    );

    const [dbHoldings, transactionTimes, benchmark, valuation] =
        await Promise.all([
            holdingsPromise,
            transactionTimesPromise,
            benchmarkPromise,
            valuationPromise,
        ]);
    const snapshotSamples = await snapshotPromise;
    const currency = portfolio.baseCurrency;

    const enriched: AnalyticsHolding[] = dbHoldings.map((h, i) => {
        const { value, invested } = valuation.positions[i];
        const pl = value - invested;
        return {
            t: h.asset.ticker,
            cat: toCategory(h.asset.category),
            value,
            invested,
            pl,
            plPct: invested > 0 ? (pl / invested) * 100 : 0,
        };
    });

    let inProfit = 0;
    let best: AnalyticsHolding | null = null;
    let worst: AnalyticsHolding | null = null;
    let largest: AnalyticsHolding | null = null;
    const valueByCategory = new Map<Category, number>();

    for (const holding of enriched) {
        if (holding.pl >= 0) inProfit += 1;
        if (!best || holding.plPct > best.plPct) best = holding;
        if (!worst || holding.plPct < worst.plPct) worst = holding;
        if (!largest || holding.value > largest.value) largest = holding;
        valueByCategory.set(
            holding.cat,
            (valueByCategory.get(holding.cat) ?? 0) + holding.value,
        );
    }

    const { totalValue, cashValue, holdingsValue, investedValue } = valuation;
    const totalPL = holdingsValue - investedValue;
    const totalPLPct = investedValue > 0 ? (totalPL / investedValue) * 100 : 0;

    const diversification = (
        ['Stocks', 'ETFs', 'Crypto'] as Category[]
    ).filter((c) => (valueByCategory.get(c) ?? 0) > 0).length + (cashValue > 0 ? 1 : 0);

    const largestPct =
        largest && totalValue > 0 ? (largest.value / totalValue) * 100 : 0;
    const cashRatio = totalValue > 0 ? (cashValue / totalValue) * 100 : 0;
    const winRate = enriched.length ? (inProfit / enriched.length) * 100 : 0;

    const performanceIndex = buildPerformanceIndex(
        withLiveSample(snapshotSamples, {
            holdingsValue,
            investedValue,
            cashValue,
        }),
        transactionTimes,
    );

    return (
        <AppShell>
            <PageHeader eyebrow='Insights' title='Analytics' />

            <div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
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

                <Stat label='Total return' value={fmtPct(totalPLPct)} />
            </div>

            <div className='mb-8 mt-px grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4'>
                <Stat
                    label='Largest position'
                    value={largest ? largest.t : '—'}
                    sub={`${largestPct.toFixed(1)}% of portfolio`}
                />

                <Stat
                    label='Cash ratio'
                    value={`${cashRatio.toFixed(1)}%`}
                    sub={`${fmtCurrency(cashValue, currency)} available`}
                />

                <Stat
                    label='Win rate'
                    value={`${winRate.toFixed(0)}%`}
                    sub={`${inProfit} of ${enriched.length} in profit`}
                />

                <Stat label='Open positions' value={`${enriched.length}`} />
            </div>

            <div className='mb-8'>
                <BenchmarkChart
                    portfolioIndex={performanceIndex}
                    benchmark={benchmark}
                    benchmarkLabel={BENCHMARK.label}
                />
            </div>

            <div className='mb-8 grid gap-6 md:gap-8 lg:grid-cols-2'>
                <CategoryPerformanceChart enriched={enriched} />
                <MonthlyReturnsChart data={monthlyReturns(performanceIndex)} />
            </div>

            <HoldingsRanked enriched={enriched} />
        </AppShell>
    );
}
