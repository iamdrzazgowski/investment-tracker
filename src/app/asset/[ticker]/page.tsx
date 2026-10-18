import { AppShell } from '@/components/shared/app-shell';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { BuySellPanel } from '@/features/asset/components/buy-sell-panel';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fmtCurrency, fmtNum, fmtSignedCurrency } from '@/lib/format';
import { requirePortfolio } from '@/lib/auth-helpers';
import { getHoldingForAsset } from '@/lib/repositories/holding.repository';
import { getFxRate } from '@/lib/market-data/fx';
import {
    getOrCreateAsset,
    getAssetPriceHistory,
} from '@/lib/repositories/asset.repository';
import { isOnWatchlist } from '@/lib/repositories/watchlist.repository';
import AssetPriceChart from '@/features/asset/components/asset-price-chart';
import { WatchlistToggle } from '@/features/watchlist/components/watchlist-toggle';

const DEFAULT_RANGE = '1M' as const;

export default async function AssetDetailPage({
    params,
}: {
    params: Promise<{ ticker: string }>;
}) {
    const { ticker: rawTicker } = await params;
    const ticker = decodeURIComponent(rawTicker).trim().toUpperCase();

    let asset;
    try {
        asset = await getOrCreateAsset(ticker);
    } catch (err) {
        console.error(`Failed to resolve asset "${ticker}":`, err);
        notFound();
    }
    if (!asset) notFound();

    const portfolioPromise = requirePortfolio();
    const historyPromise = getAssetPriceHistory(asset, DEFAULT_RANGE);
    const [portfolio, initialPoints] = await Promise.all([
        portfolioPromise,
        historyPromise,
    ]);

    // FX rate: 1 unit of asset currency -> portfolio (cash) currency.
    // Null when unavailable (offline / unknown pair) — panel falls back
    // to the no-conversion warning.
    // Cheap sync guard first: identical currencies never need the remote rate.
    const fxRatePromise =
        asset.currency === portfolio.baseCurrency
            ? Promise.resolve(1)
            : getFxRate(asset.currency, portfolio.baseCurrency);

    // Holding, watchlist state and FX are independent of one another —
    // fetch them concurrently instead of one round trip at a time.
    const [holding, watched, fxRate] = await Promise.all([
        getHoldingForAsset(portfolio.id, asset.id),
        isOnWatchlist(portfolio.id, asset.id),
        fxRatePromise,
    ]);
    const initialData = initialPoints.map((p, i) => ({
        i,
        v: p.price,
        date: new Date(p.date).toISOString(),
    }));

    const owned = Boolean(holding);
    const marketPrice = asset.lastPrice ? Number(asset.lastPrice) : 0;
    const dayChange = asset.dayChangePercent
        ? Number(asset.dayChangePercent)
        : 0;
    const cat = asset.category === 'ETF' ? 'ETFs' : 'Stocks';
    const holdingShares = holding ? holding.shares.toNumber() : 0;
    const holdingAvgCost = holding ? holding.avgCost.toNumber() : 0;
    const holdingInvested = holdingShares * holdingAvgCost;
    const holdingValue = holdingShares * marketPrice;
    const holdingPL = holdingValue - holdingInvested;
    const holdingPLPct = holdingInvested ? (holdingPL / holdingInvested) * 100 : 0;

    return (
        <AppShell>
            <div className='mb-6 flex items-center justify-between gap-4'>
                <Link
                    href='/portfolio'
                    className='inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground'>
                    <ChevronLeft size={15} /> Back
                </Link>
                <WatchlistToggle
                    ticker={asset.ticker}
                    initialWatched={watched}
                />
            </div>

            <div className='mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-start md:justify-between md:gap-8'>
                <div className='flex min-w-0 items-start gap-4'>
                    <AvatarBadge t={asset.ticker} cat={cat} size='lg' />
                    <div className='min-w-0'>
                        <h1 className='text-[28px] font-semibold leading-none tracking-[-0.03em] md:text-[40px]'>
                            {asset.ticker}
                        </h1>
                        <div className='mt-2 text-[13px] text-muted-foreground'>
                            {asset.name} · {cat}
                            {asset.exchange && ` · ${asset.exchange}`}
                        </div>

                    </div>
                </div>
                <div className='shrink-0 md:text-right'>
                    <div className='mb-1 font-mono text-3xl font-medium tracking-tight tabular-nums md:text-4xl'>
                        {fmtCurrency(marketPrice, asset.currency)}
                    </div>
                    <Delta value={dayChange} />
                </div>
            </div>

            <div className='mb-6 md:mb-8'>
                <AssetPriceChart
                    ticker={asset.ticker}
                    currency={asset.currency}
                    initialRange={DEFAULT_RANGE}
                    initialData={initialData}
                />
            </div>

            <div className='mb-6 grid gap-6 md:mb-8 md:grid-cols-2 md:gap-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {owned ? 'Your position' : 'Market details'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                        {owned && holding ? (
                            <ul className='divide-y divide-border text-[13px]'>
                                <li className='flex items-center justify-between py-2.5 first:pt-0'>
                                    <span className='text-muted-foreground'>
                                        Shares
                                    </span>
                                    <span className='font-mono'>
                                        {fmtNum(holdingShares, 0)}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between py-2.5'>
                                    <span className='text-muted-foreground'>
                                        Average purchase price
                                    </span>
                                    <span className='font-mono'>
                                        {fmtCurrency(
                                            holdingAvgCost,
                                            asset.currency,
                                        )}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between py-2.5'>
                                    <span className='text-muted-foreground'>
                                        Total invested
                                    </span>
                                    <span className='font-mono'>
                                        {fmtCurrency(
                                            holdingInvested,
                                            asset.currency,
                                        )}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between py-2.5'>
                                    <span className='text-muted-foreground'>
                                        Current value
                                    </span>
                                    <span className='font-mono'>
                                        {fmtCurrency(
                                            holdingValue,
                                            asset.currency,
                                        )}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between py-2.5'>
                                    <span className='text-muted-foreground'>
                                        Total return
                                    </span>
                                    <Delta value={holdingPLPct} size='sm' />
                                </li>
                                <li className='flex items-center justify-between py-2.5 last:pb-0'>
                                    <span className='text-muted-foreground'>
                                        Unrealized P/L
                                    </span>
                                    <span className='font-mono'>
                                        {fmtSignedCurrency(
                                            holdingPL,
                                            asset.currency,
                                        )}
                                    </span>
                                </li>
                            </ul>
                        ) : (
                            <ul className='divide-y divide-border text-[13px]'>
                                <li className='flex items-center justify-between py-2.5 first:pt-0'>
                                    <span className='text-muted-foreground'>
                                        Current price
                                    </span>
                                    <span className='font-mono'>
                                        {fmtCurrency(
                                            marketPrice,
                                            asset.currency,
                                        )}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between py-2.5'>
                                    <span className='text-muted-foreground'>
                                        Today&apos;s change
                                    </span>
                                    <Delta value={dayChange} size='sm' />
                                </li>
                                <li className='flex items-center justify-between py-2.5 last:pb-0'>
                                    <span className='text-muted-foreground'>
                                        In your portfolio
                                    </span>
                                    <span>No</span>
                                </li>
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <BuySellPanel
                    ticker={asset.ticker}
                    marketPrice={marketPrice}
                    currency={asset.currency}
                    owned={owned}
                    ownedShares={holding ? holding.shares.toNumber() : 0}
                    cash={portfolio.cashBalance.toNumber()}
                    cashCurrency={portfolio.baseCurrency}
                    fxRate={fxRate}
                />
            </div>
        </AppShell>
    );
}
