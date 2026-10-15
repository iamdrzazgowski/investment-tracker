'use client';

import * as React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoldingsTable } from '@/features/portfolio/components/holdings-table';
import type { Category, EnrichedHolding } from '@/lib/data';

export function PortfolioHoldingsFilter({
    enriched,
}: {
    enriched: EnrichedHolding[];
}) {
    const [filter, setFilter] = React.useState<Category | 'All'>('All');

    const rows =
        filter === 'All' ? enriched : enriched.filter((h) => h.cat === filter);

    return (
        <>
            <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as Category | 'All')}
                className='mb-6'>
                <TabsList>
                    {(['All', 'Stocks', 'ETFs', 'Crypto'] as const).map((c) => (
                        <TabsTrigger key={c} value={c}>
                            {c}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <HoldingsTable rows={rows} />
        </>
    );
}
