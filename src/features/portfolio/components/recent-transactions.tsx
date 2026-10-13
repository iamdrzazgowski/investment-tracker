'use client';

import Link from 'next/link';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { CATALOG, INITIAL_TRANSACTIONS } from '@/lib/data';
import { fmtEUR, fmtNum } from '@/lib/format';

const PREVIEW_TRANSACTIONS = INITIAL_TRANSACTIONS.slice(0, 5);

export function RecentTransactions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent transactions</CardTitle>
                <CardAction>
                    <Link
                        href='/transactions'
                        className='text-[13px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'>
                        View all
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent className='pt-0'>
                <ul className='divide-y divide-border'>
                    {PREVIEW_TRANSACTIONS.map((tx) => {
                        const meta = CATALOG.find((c) => c.t === tx.t);
                        const isCrypto = meta?.cat === 'Crypto';

                        return (
                            <li
                                key={tx.id}
                                className='flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0'>
                                <div className='flex min-w-0 items-center gap-2.5'>
                                    <AvatarBadge
                                        t={tx.t}
                                        cat={meta?.cat ?? 'Stocks'}
                                        size='sm'
                                    />
                                    <div className='min-w-0'>
                                        <div className='truncate text-[13px] font-semibold'>
                                            {tx.name}
                                        </div>
                                        <div className='font-mono text-[11.5px] text-muted-foreground'>
                                            {tx.date} ·{' '}
                                            {fmtNum(tx.qty, isCrypto ? 2 : 0)}{' '}
                                            {tx.t}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex shrink-0 items-center gap-2'>
                                    <span className='font-mono text-[13px] font-semibold'>
                                        {fmtEUR(tx.qty * tx.price)}
                                    </span>
                                    <Badge
                                        variant={
                                            tx.type === 'buy'
                                                ? 'positive'
                                                : 'destructive'
                                        }>
                                        {tx.type === 'buy' ? 'Buy' : 'Sell'}
                                    </Badge>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}
