'use server';

import { getAssetByTicker, getAssetPriceHistory } from '@/lib/repositories/asset.repository';
import type { Range } from '@/lib/market-data/range';

export async function getAssetHistoryAction(ticker: string, range: Range) {
    const asset = await getAssetByTicker(ticker);
    const points = await getAssetPriceHistory(asset, range);

    return points.map((p, i) => ({
        i,
        v: p.price,
        date: p.date.toISOString(),
    }));
}
