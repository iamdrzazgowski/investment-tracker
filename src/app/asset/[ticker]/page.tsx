import { AppShell } from '@/components/shared/app-shell';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { BuySellPanel } from '@/features/asset/components/buy-sell-panel';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fmtEUR, fmtNum, fmtSigned } from '@/lib/format';
import { requirePortfolio } from '@/lib/auth-helpers';
import { getHoldingForAsset } from '@/lib/repositories/holding.repository';
import {
    getOrCreateAsset,
    getAssetPriceHistory,
} from '@/lib/repositories/asset.repository';
import AssetPriceChart from '@/features/asset/components/asset-price-chart';

const DEFAULT_RANGE = '1M' as const;

export default async function AssetDetailPage({
    params,
}: {
    params: { ticker: string };
}) {
    const ticker = decodeURIComponent(params.ticker);

    let asset;
    try {
        asset = await getOrCreateAsset(ticker);
    } catch (err) {
        console.error(`Failed to resolve asset "${ticker}":`, err);
        notFound();
    }

    const portfolioPromise = requirePortfolio();
    const historyPromise = getAssetPriceHistory(asset, DEFAULT_RANGE);
    const [portfolio, initialPoints] = await Promise.all([
        portfolioPromise,
        historyPromise,
    ]);
    const holding = await getHoldingForAsset(portfolio.id, asset.id);
    const initialData = initialPoints.map((p, i) => ({
        i,
        v: p.price,
        date: p.date.toISOString(),
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
            <Link
                href='/portfolio'
                className='mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground'>
                <ChevronLeft size={15} /> Back
            </Link>

            <div className='mb-5 flex items-center gap-3.5'>
                <AvatarBadge t={asset.ticker} cat={cat} />
                <div>
                    <div className='text-lg font-bold'>{asset.name}</div>
                    <div className='text-[12.5px] text-muted-foreground'>
                        {asset.ticker} · {cat}
                        {asset.exchange && ` · ${asset.exchange}`}
                    </div>
                </div>
                <div className='ml-auto text-right'>
                    <div className='font-mono text-xl font-bold'>
                        {fmtEUR(marketPrice)}
                    </div>
                    <Delta value={dayChange} />
                </div>
            </div>

            <div className='mb-5'>
                <AssetPriceChart
                    ticker={asset.ticker}
                    currency={asset.currency}
                    initialRange={DEFAULT_RANGE}
                    initialData={initialData}
                />
            </div>

            <div className='mb-5 grid gap-5 md:grid-cols-2'>
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
                                        {fmtEUR(holdingAvgCost)}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between py-2.5'>
                                    <span className='text-muted-foreground'>
                                        Total invested
                                    </span>
                                    <span className='font-mono'>
                                        {fmtEUR(holdingInvested)}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between py-2.5'>
                                    <span className='text-muted-foreground'>
                                        Current value
                                    </span>
                                    <span className='font-mono'>
                                        {fmtEUR(holdingValue)}
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
                                        {fmtSigned(holdingPL)}
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
                                        {fmtEUR(marketPrice)}
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
                />
            </div>
        </AppShell>
    );
}
