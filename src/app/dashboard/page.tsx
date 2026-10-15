import { AppShell } from '@/components/shared/app-shell';
import { AddFundsDialog } from '@/features/portfolio/components/add-funds-dialog';
import { AllocationDonut } from '@/features/portfolio/components/allocation-donut';
import { Delta } from '@/components/shared/delta';
import { HoldingsPreview } from '@/features/portfolio/components/holdings-preview';
import { PerformanceChart } from '@/features/portfolio/components/performance-chart';
import { RecentTransactions } from '@/features/portfolio/components/recent-transactions';
import { StatRow } from '@/features/portfolio/components/stat-row';
import { TopMovers } from '@/features/portfolio/components/top-movers';
import { fmtEUR, fmtSigned } from '@/lib/format';
import { requirePortfolio } from '@/lib/auth-helpers';
import { getHoldingsByPortfolio } from '@/lib/repositories/holding.repository';
import { getTransactionsForPortfolio } from '@/lib/repositories/transaction.repository';
import type { Category } from '@/lib/data';
import type { HoldingPreviewItem } from '@/features/portfolio/components/holdings-preview';
import type { RecentTransactionItem } from '@/features/portfolio/components/recent-transactions';
import type { TopMoverItem } from '@/features/portfolio/components/top-movers';
import type { AllocationSlice } from '@/features/portfolio/components/allocation-donut';

function toCategory(category: string): Category {
    if (category === 'ETF') return 'ETFs';
    if (category === 'CRYPTO') return 'Crypto';
    return 'Stocks';
}

export default async function DashboardPage() {
    const portfolio = await requirePortfolio();
    const [dbHoldings, dbTransactions] = await Promise.all([
        getHoldingsByPortfolio(portfolio.id),
        getTransactionsForPortfolio(portfolio.id, 5),
    ]);

    const previewHoldings: HoldingPreviewItem[] = dbHoldings
        .map((h) => {
            const shares = h.shares.toNumber();
            const avg = h.avgCost.toNumber();
            const price =
                h.asset.lastPrice != null
                    ? Number(h.asset.lastPrice)
                    : avg;
            const value = shares * price;
            const invested = shares * avg;
            const pl = value - invested;
            const plPct = invested > 0 ? (pl / invested) * 100 : 0;
            return {
                t: h.asset.ticker,
                name: h.asset.name,
                cat: toCategory(h.asset.category),
                value,
                pl,
                plPct,
            };
        })
        .toSorted((a, b) => b.value - a.value)
        .slice(0, 5);

    const previewTransactions: RecentTransactionItem[] = dbTransactions.map(
        (tx) => ({
            id: tx.id,
            date: tx.executedAt.toISOString(),
            t: tx.asset.ticker,
            name: tx.asset.name,
            cat: toCategory(tx.asset.category),
            type: tx.type === 'BUY' ? 'buy' : 'sell',
            qty: tx.quantity.toNumber(),
            price: tx.price.toNumber(),
        }),
    );

    const topMovers: TopMoverItem[] = dbHoldings.map((h) => ({
        t: h.asset.ticker,
        cat: toCategory(h.asset.category),
        price:
            h.asset.lastPrice != null
                ? Number(h.asset.lastPrice)
                : h.avgCost.toNumber(),
        day: h.asset.dayChangePercent
            ? Number(h.asset.dayChangePercent)
            : 0,
    }));

    const cash = portfolio.cashBalance.toNumber();
    const valueByCat = new Map<Category, number>();
    for (const h of dbHoldings) {
        const shares = h.shares.toNumber();
        const price =
            h.asset.lastPrice != null
                ? Number(h.asset.lastPrice)
                : h.avgCost.toNumber();
        const cat = toCategory(h.asset.category);
        valueByCat.set(cat, (valueByCat.get(cat) ?? 0) + shares * price);
    }
    valueByCat.set('Cash', cash);
    const allocationTotal = [...valueByCat.values()].reduce(
        (s, v) => s + v,
        0,
    );
    const allocation: AllocationSlice[] = (
        ['Stocks', 'ETFs', 'Crypto', 'Cash'] as Category[]
    )
        .map((name) => {
            const value = valueByCat.get(name) ?? 0;
            return {
                name,
                value,
                pct: allocationTotal > 0 ? (value / allocationTotal) * 100 : 0,
            };
        })
        .filter((a) => a.value > 0);
    return (
        <AppShell>
            <section
                aria-labelledby='portfolio-value-label'
                className='mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 md:mb-10'>
                <div>
                    <h1
                        id='portfolio-value-label'
                        className='mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        Portfolio value
                    </h1>
                    <div className='text-[44px] font-medium leading-none tracking-[-0.04em] tabular-nums md:text-[64px]'>
                        {fmtEUR(3000)}
                    </div>
                    <div className='mt-4 flex items-center gap-3'>
                        <Delta value={10} />
                        <span className='font-mono text-[13px] text-muted-foreground'>
                            {fmtSigned(10)} today
                        </span>
                    </div>
                </div>
                <AddFundsDialog />
            </section>

            <div className='space-y-6 md:space-y-8'>
                <PerformanceChart seed={1} endValue={5000} showValue={false} />

                <StatRow totals={0} />

                <div className='grid gap-6 md:gap-8 lg:grid-cols-[1.55fr_1fr]'>
                    <HoldingsPreview holdings={previewHoldings} />
                    <AllocationDonut allocation={allocation} />
                </div>

                <div className='grid gap-6 md:gap-8 lg:grid-cols-[1.55fr_1fr]'>
                    <RecentTransactions transactions={previewTransactions} />
                    <TopMovers movers={topMovers} />
                </div>
            </div>
        </AppShell>
    );
}
