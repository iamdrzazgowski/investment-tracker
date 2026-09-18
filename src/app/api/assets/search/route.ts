import { NextRequest, NextResponse } from 'next/server';
import { searchAssets } from '@/lib/repositories/asset.repository';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('q') ?? '';

    try {
        const results = await searchAssets(query);
        return NextResponse.json({ results });
    } catch (err) {
        console.error('Asset search failed:', err);
        return NextResponse.json({ results: [] });
    }
}
