import { NextResponse } from 'next/server';
import { syncAllAssetPrices } from '@/lib/repositories/asset.repository';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await syncAllAssetPrices();
    const okCount = results.filter((r) => r.status === 'ok').length;

    return NextResponse.json({
        synced: okCount,
        failed: results.length - okCount,
        results,
    });
}
