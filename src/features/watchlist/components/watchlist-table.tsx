'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import { Delta } from '@/components/shared/delta';
import { Sparkline } from '@/features/watchlist/components/sparkline';
import { fmtCurrency } from '@/lib/format';
import { removeWatchlistAction } from '@/actions/watchlist.actions';

export interface WatchlistRow {
    ticker: string;
    name: string;
    cat: 'Stocks' | 'ETFs' | 'Crypto';
    price: number | null;
    day: number;
    currency: string;
    seed: number;
}

export function WatchlistTable({ initialRows }: { initialRows: WatchlistRow[] }) {
    const router = useRouter();
    const [removedTickers, setRemovedTickers] = React.useState<Set<string>>(
        new Set(),
    );
    const [pendingTicker, setPendingTicker] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const rows = initialRows.filter((r) => !removedTickers.has(r.ticker));

    const handleRemove = async (ticker: string) => {
        setError(null);
        setPendingTicker(ticker);
        setRemovedTickers((prev) => new Set(prev).add(ticker));
        try {
            await removeWatchlistAction(ticker);
            router.refresh();
        } catch (err) {
            setRemovedTickers((prev) => {
                const next = new Set(prev);
                next.delete(ticker);
                return next;
            });
            setError(
                err instanceof Error ? err.message : 'Failed to remove asset',
            );
        } finally {
            setPendingTicker(null);
        }
    };

    if (rows.length === 0) {
        return (
            <Card>
                <CardContent>
                    <p className='py-8 text-center text-sm text-muted-foreground'>
                        Your watchlist is empty. Add an asset to start
                        tracking it.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                {error && (
                    <p className='pb-2 text-center text-[12px] text-destructive'>
                        {error}
                    </p>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead className='text-right'>Price</TableHead>
                            <TableHead className='text-right'>Today</TableHead>
                            <TableHead className='text-right'>Trend</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((w) => (
                            <TableRow
                                key={w.ticker}
                                className='cursor-pointer'
                                onClick={() => router.push(`/asset/${w.ticker}`)}>
                                <TableCell>
                                    <div className='flex items-center gap-2.5'>
                                        <AvatarBadge t={w.ticker} cat={w.cat} />
                                        <div>
                                            <div className='text-[13px] font-semibold'>
                                                {w.name}
                                            </div>
                                            <div className='text-[11.5px] text-muted-foreground'>
                                                {w.ticker}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className='text-right font-mono'>
                                    {w.price != null
                                        ? fmtCurrency(w.price, w.currency)
                                        : '—'}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <Delta value={w.day} size='sm' />
                                </TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex justify-end'>
                                        <Sparkline
                                            seed={w.seed}
                                            up={w.day >= 0}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <button
                                        className='inline-flex h-6.5 w-6.5 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-50'
                                        disabled={pendingTicker === w.ticker}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            void handleRemove(w.ticker);
                                        }}
                                        aria-label={`Remove ${w.ticker}`}>
                                        <X size={14} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
