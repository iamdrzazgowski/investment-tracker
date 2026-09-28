import AssetPriceChart from '@/components/asset-price-chart';
import {
    getOrCreateAsset,
    getAssetPriceHistory,
} from '@/lib/repositories/asset.repository';

const DEFAULT_RANGE = '1M' as const;

export default async function AssetDetailPage({
    params,
}: {
    params: { ticker: string };
}) {
    const ticker = decodeURIComponent(params.ticker);
    const asset = await getOrCreateAsset(ticker);

    const initialPoints = await getAssetPriceHistory(asset, DEFAULT_RANGE);
    const initialData = initialPoints.map((p, i) => ({
        i,
        v: p.price,
        date: p.date.toISOString(),
    }));

    return (
        <>
            {/* nagłówek aktywa */}
            <div className='mb-5'>
                <AssetPriceChart
                    ticker={asset.ticker}
                    initialRange={DEFAULT_RANGE}
                    initialData={initialData}
                />
            </div>
            {/* BuySellPanel itd. */}
        </>
    );
}
