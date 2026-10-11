import { AppShell } from '@/components/shared/app-shell';
import { AddWatchlistDialog } from '@/features/watchlist/components/add-watchlist-dialog';
import {
    WatchlistTable,
    type WatchlistRow,
} from '@/features/watchlist/components/watchlist-table';
import { PageHeader } from '@/components/shared/page-header';
import { requirePortfolio } from '@/lib/auth-helpers';
import { getWatchlist } from '@/lib/repositories/watchlist.repository';

function seedFromTicker(ticker: string): number {
    return ticker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export default async function WatchlistPage() {
    const portfolio = await requirePortfolio();
    const items = await getWatchlist(portfolio.id);

    const rows: WatchlistRow[] = items.map((item) => ({
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
        seed: seedFromTicker(item.asset.ticker),
    }));

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
