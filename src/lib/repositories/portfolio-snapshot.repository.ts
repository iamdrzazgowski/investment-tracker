import 'server-only';
import { prisma } from '@/lib/prisma';
import { getFxRate } from '@/lib/market-data/fx';

export interface PortfolioSnapshotResult {
    portfolioId: string;
    status: 'ok' | 'error';
    totalValue?: number;
    message?: string;
}

export async function snapshotAllPortfolios(): Promise<
    PortfolioSnapshotResult[]
> {
    const portfolios = await prisma.portfolio.findMany({
        include: { holdings: { include: { asset: true } } },
    });
    if (portfolios.length === 0) return [];

    const capturedAt = new Date();
    const fxCache = new Map<string, Promise<number | null>>();
    const fx = (from: string, to: string) => {
        const key = `${from}->${to}`;
        let rate = fxCache.get(key);
        if (!rate) {
            rate = getFxRate(from, to);
            fxCache.set(key, rate);
        }
        return rate;
    };

    const results: PortfolioSnapshotResult[] = [];

    for (const portfolio of portfolios) {
        try {
            const cashValue = portfolio.cashBalance.toNumber();
            let holdingsValue = 0;
            let investedValue = 0;

            for (const holding of portfolio.holdings) {
                const { asset } = holding;
                const rate = await fx(asset.currency, portfolio.baseCurrency);
                if (rate == null || rate <= 0) {
                    throw new Error(
                        `Exchange rate unavailable for ${asset.currency} to ${portfolio.baseCurrency}`,
                    );
                }

                const shares = holding.shares.toNumber();
                const price =
                    asset.lastPrice?.toNumber() ?? holding.avgCost.toNumber();

                holdingsValue += shares * price * rate;
                investedValue += shares * holding.avgCost.toNumber() * rate;
            }

            const totalValue = holdingsValue + cashValue;

            await prisma.portfolioSnapshot.create({
                data: {
                    portfolioId: portfolio.id,
                    totalValue,
                    investedValue,
                    cashValue,
                    capturedAt,
                },
            });

            results.push({
                portfolioId: portfolio.id,
                status: 'ok',
                totalValue,
            });
        } catch (err) {
            console.error(`Snapshot failed for portfolio ${portfolio.id}:`, err);
            results.push({
                portfolioId: portfolio.id,
                status: 'error',
                message: err instanceof Error ? err.message : String(err),
            });
        }
    }

    return results;
}
