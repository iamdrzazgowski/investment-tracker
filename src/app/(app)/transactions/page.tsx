'use client';

import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { PageHeader } from '@/components/shared/page-header';

import { CATALOG, INITIAL_TRANSACTIONS } from '@/lib/data';
import { fmtEUR, fmtNum } from '@/lib/format';

export default function TransactionsPage() {
    const [filter, setFilter] = React.useState<'all' | 'buy' | 'sell'>('all');

    const rows = INITIAL_TRANSACTIONS.filter(
        (t) => filter === 'all' || t.type === filter,
    );

    return (
        <>
            <PageHeader eyebrow='History' title='Transactions' />

            <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as 'all' | 'buy' | 'sell')}
                className='mb-4'>
                <TabsList>
                    <TabsTrigger value='all'>All</TabsTrigger>
                    <TabsTrigger value='buy'>Buys</TabsTrigger>
                    <TabsTrigger value='sell'>Sells</TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardContent className='pt-5'>
                    {rows.length === 0 ? (
                        <p className='py-8 text-center text-sm text-muted-foreground'>
                            No transactions in this view.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className='text-right'>
                                        Quantity
                                    </TableHead>
                                    <TableHead className='text-right'>
                                        Price
                                    </TableHead>
                                    <TableHead className='text-right'>
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {rows.map((tx) => {
                                    const meta = CATALOG.find(
                                        (c) => c.t === tx.t,
                                    );

                                    return (
                                        <TableRow key={tx.id}>
                                            <TableCell className='font-mono text-muted-foreground'>
                                                {tx.date}
                                            </TableCell>

                                            <TableCell>
                                                <div className='flex items-center gap-2.5'>
                                                    <AvatarBadge
                                                        t={tx.t}
                                                        cat={
                                                            meta?.cat ??
                                                            'Stocks'
                                                        }
                                                    />

                                                    <div>
                                                        <div className='text-[13px] font-semibold'>
                                                            {tx.name}
                                                        </div>

                                                        <div className='text-[11.5px] text-muted-foreground'>
                                                            {tx.t}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        tx.type === 'buy'
                                                            ? 'positive'
                                                            : 'destructive'
                                                    }>
                                                    {tx.type === 'buy'
                                                        ? 'Buy'
                                                        : 'Sell'}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className='text-right font-mono'>
                                                {fmtNum(
                                                    tx.qty,
                                                    tx.t === 'BTC' ||
                                                        tx.t === 'ETH'
                                                        ? 2
                                                        : 0,
                                                )}
                                            </TableCell>

                                            <TableCell className='text-right font-mono'>
                                                {fmtEUR(tx.price)}
                                            </TableCell>

                                            <TableCell className='text-right font-mono'>
                                                {fmtEUR(tx.qty * tx.price)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
