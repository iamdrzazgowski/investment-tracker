import { AppShell } from '@/components/shared/app-shell';
import { AddWatchlistDialog } from '@/features/watchlist/components/add-watchlist-dialog';
import {
    WatchlistTable,
    type WatchlistRow,
} from '@/features/watchlist/components/watchlist-table';
import { PageHeader } from '@/components/shared/page-header';
import { requirePortfolio } from '@/lib/auth-helpers';
import {
    getAssetPriceHistory,
} from '@/lib/repositories/asset.repository';
import { getWatchlist } from '@/lib/repositories/watchlist.repository';

export default async function WatchlistPage() {
    const portfolio = await requirePortfolio();
    const items = await getWatchlist(portfolio.id);

    const rows: WatchlistRow[] = await Promise.all(
        items.map(async (item) => {
            let trend: number[] = [];
            try {
                const points = await getAssetPriceHistory(item.asset, '1M');
                trend = points.map((p) => p.price);
            } catch (err) {
                console.error(
                    `Watchlist trend failed for ${item.asset.ticker}:`,
                    err,
                );
            }

            return {
                ticker: item.asset.ticker,
                name: item.asset.name,
                cat:
                    item.asset.category === 'CRYPTO'
                        ? 'Crypto'
                        : item.asset.category === 'ETF'
                          ? 'ETFs'
                          : 'Stocks',
                price:
                    item.asset.lastPrice != null
                        ? Number(item.asset.lastPrice)
                        : null,
                day: item.asset.dayChangePercent
                    ? Number(item.asset.dayChangePercent)
                    : 0,
                currency: item.asset.currency,
                trend,
            };
        }),
    );

    return (
        <AppShell>
            <PageHeader
                eyebrow='Following'
                title='Watchlist'
                action={
                    <AddWatchlistDialog
                        excludeTickers={rows.map((r) => r.ticker)}
                    />
                }
            />

            <WatchlistTable initialRows={rows} />
        </AppShell>
    );
}
