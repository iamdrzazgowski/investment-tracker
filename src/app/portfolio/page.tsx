import { AppShell } from '@/components/shared/app-shell';
import { CategoryBreakdown } from '@/features/portfolio/components/category-breakdown';
import { NewOrderDialog } from '@/features/portfolio/components/new-order-dialog';
import { PortfolioHoldingsFilter } from '@/features/portfolio/components/portfolio-holdings-filter';
import { PageHeader } from '@/components/shared/page-header';
import { requirePortfolio } from '@/lib/auth-helpers';
import { getHoldingsByPortfolio } from '@/lib/repositories/holding.repository';
import type { Category, EnrichedHolding } from '@/lib/data';

function toCategory(category: string): Category {
    if (category === 'ETF') return 'ETFs';
    if (category === 'CRYPTO') return 'Crypto';
    return 'Stocks';
}

export default async function PortfolioPage() {
    const portfolio = await requirePortfolio();
    const dbHoldings = await getHoldingsByPortfolio(portfolio.id);

    const enriched: EnrichedHolding[] = dbHoldings.map((h, i) => {
        const shares = h.shares.toNumber();
        const avg = h.avgCost.toNumber();
        const price =
            h.asset.lastPrice != null ? Number(h.asset.lastPrice) : avg;
        const value = shares * price;
        const invested = shares * avg;
        const pl = value - invested;
        const plPct = invested > 0 ? (pl / invested) * 100 : 0;

        return {
            t: h.asset.ticker,
            name: h.asset.name,
            cat: toCategory(h.asset.category),
            price,
            day: h.asset.dayChangePercent
                ? Number(h.asset.dayChangePercent)
                : 0,
            seed: i,
            shares,
            avg,
            value,
            invested,
            pl,
            plPct,
        };
    });

    const cash = portfolio.cashBalance.toNumber();

    const holdingsValue = enriched.reduce(
        (sum, holding) => sum + holding.value,
        0,
    );

    const totalValue = holdingsValue + cash;

    return (
        <AppShell>
            <PageHeader
                eyebrow='Manage holdings'
                title='Portfolio'
                action={<NewOrderDialog />}
            />

            <div className='mb-8'>
                <CategoryBreakdown
                    enriched={enriched}
                    cash={cash}
                    totalValue={totalValue}
                />
            </div>

            <PortfolioHoldingsFilter enriched={enriched} />
        </AppShell>
    );
}
