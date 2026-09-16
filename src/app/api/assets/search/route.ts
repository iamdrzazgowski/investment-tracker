import { NextResponse } from 'next/server';

import { CATALOG } from '@/lib/data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().toLowerCase() ?? '';

    const results = CATALOG.filter((asset) => {
        if (!query) {
            return true;
        }

        return (
            asset.t.toLowerCase().includes(query) ||
            asset.name.toLowerCase().includes(query)
        );
    }).slice(0, 20);

    return NextResponse.json({ results });
}
