'use client';

import * as React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryBreakdown } from '@/components/category-breakdown';
import { HoldingsTable } from '@/components/holdings-table';
import { NewOrderDialog } from '@/components/new-order-dialog';
import { PageHeader } from '@/components/page-header';

import { INITIAL_CASH, INITIAL_HOLDINGS, type Category } from '@/lib/data';

export default function PortfolioPage() {
    const [filter, setFilter] = React.useState<Category | 'All'>('All');

    // Temporary portfolio data
    const enriched = INITIAL_HOLDINGS.map((holding) => {
        const value = holding.shares * holding.price;
        const invested = holding.shares * holding.avg;
        const pl = value - invested;
        const plPct = invested > 0 ? (pl / invested) * 100 : 0;

        return {
            ...holding,
            value,
            invested,
            pl,
            plPct,
        };
    });

    const cash = INITIAL_CASH;

    const holdingsValue = enriched.reduce(
        (sum, holding) => sum + holding.value,
        0,
    );

    const totalValue = holdingsValue + cash;

    const totals = {
        totalValue,
        holdingsValue,
        cash,
    };

    const rows =
        filter === 'All' ? enriched : enriched.filter((h) => h.cat === filter);

    return (
        <>
            <PageHeader
                eyebrow='Manage holdings'
                title='Portfolio'
                action={<NewOrderDialog />}
            />

            <div className='mb-5'>
                <CategoryBreakdown
                    enriched={enriched}
                    cash={cash}
                    totalValue={totals.totalValue}
                />
            </div>

            <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as Category | 'All')}
                className='mb-4'>
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
