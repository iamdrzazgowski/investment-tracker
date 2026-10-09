'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { fmtCurrency, fmtNum } from '@/lib/format';

export interface TransactionRow {
    id: string;
    date: string;
    ticker: string;
    name: string;
    cat: 'Stocks' | 'ETFs' | 'Crypto';
    type: 'buy' | 'sell';
    qty: number;
    price: number;
    currency: string;
}

export function TransactionsTable({ rows }: { rows: TransactionRow[] }) {
    const [filter, setFilter] = React.useState<'all' | 'buy' | 'sell'>('all');

    const filtered = rows.filter(
        (t) => filter === 'all' || t.type === filter,
    );

    return (
        <>
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
                    {filtered.length === 0 ? (
                        <p className='py-8 text-center text-sm text-muted-foreground'>
                            {rows.length === 0 ? (
                                <>
                                    No transactions yet —{' '}
                                    <Link
                                        href='/portfolio'
                                        className='font-semibold text-foreground hover:underline'>
                                        buy your first asset
                                    </Link>{' '}
                                    to see it here.
                                </>
                            ) : (
                                'No transactions in this view.'
                            )}
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
                                {filtered.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className='font-mono text-muted-foreground'>
                                            {new Date(
                                                tx.date,
                                            ).toLocaleDateString('en-CA')}
                                        </TableCell>

                                        <TableCell>
                                            <div className='flex items-center gap-2.5'>
                                                <AvatarBadge
                                                    t={tx.ticker}
                                                    cat={tx.cat}
                                                />

                                                <div>
                                                    <div className='text-[13px] font-semibold'>
                                                        {tx.name}
                                                    </div>

                                                    <div className='text-[11.5px] text-muted-foreground'>
                                                        {tx.ticker}
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
                                                tx.cat === 'Crypto'
                                                    ? tx.qty < 1
                                                        ? 6
                                                        : 2
                                                    : 0,
                                            )}
                                        </TableCell>

                                        <TableCell className='text-right font-mono'>
                                            {fmtCurrency(
                                                tx.price,
                                                tx.currency,
                                            )}
                                        </TableCell>

                                        <TableCell className='text-right font-mono'>
                                            {fmtCurrency(
                                                tx.qty * tx.price,
                                                tx.currency,
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
