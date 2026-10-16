import 'server-only';
import { prisma } from '@/lib/prisma';
import { valuePortfolio } from '@/lib/portfolio-valuation';

export interface PortfolioSnapshotResult {
    portfolioId: string;
    status: 'ok' | 'error';
    totalValue?: number;
    message?: string;
}

/**
 * Zapisuje snapshot wartości każdego portfela (wycena: `valuePortfolio`).
 *
 * Gdy brakuje kursu FX, snapshot tego portfela jest pomijany (zapis
 * zaniżonej/zawyżonej wartości zepsułby wykres), a błąd trafia do wyniku.
 * Błąd jednego portfela nie blokuje pozostałych.
 */
export async function snapshotAllPortfolios(): Promise<
    PortfolioSnapshotResult[]
> {
    const portfolios = await prisma.portfolio.findMany({
        include: { holdings: { include: { asset: true } } },
    });
    if (portfolios.length === 0) return [];

    const capturedAt = new Date();
    const results: PortfolioSnapshotResult[] = [];

    for (const portfolio of portfolios) {
        try {
            const { totalValue, investedValue, cashValue } =
                await valuePortfolio(portfolio);

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

export interface PortfolioSnapshotPoint {
    /** Unix ms */
    t: number;
    v: number;
}

export async function getSnapshotPoints(
    portfolioId: string,
): Promise<PortfolioSnapshotPoint[]> {
    const snapshots = await prisma.portfolioSnapshot.findMany({
        where: { portfolioId },
        orderBy: { capturedAt: 'asc' },
        select: { capturedAt: true, totalValue: true },
    });
    return snapshots.map((s) => ({
        t: s.capturedAt.getTime(),
        v: s.totalValue.toNumber(),
    }));
}
