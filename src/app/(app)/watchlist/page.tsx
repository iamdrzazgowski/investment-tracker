'use client';

import { useState } from 'react';
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

import { AddWatchlistDialog } from '@/components/add-watchlist-dialog';
import { AvatarBadge } from '@/components/avatar-badge';
import { Delta } from '@/components/delta';
import { PageHeader } from '@/components/page-header';
import { Sparkline } from '@/components/sparkline';

import { AssetMeta, INITIAL_WATCHLIST } from '@/lib/data';
import { fmtEUR } from '@/lib/format';

export default function WatchlistPage() {
    const router = useRouter();

    const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);

    const addToWatchlist = (asset: AssetMeta) => {
        setWatchlist((current) => [...current, asset]);
    };

    const removeFromWatchlist = (ticker: string) => {
        setWatchlist((current) =>
            current.filter((asset) => asset.t !== ticker),
        );
    };

    return (
        <>
            <PageHeader
                eyebrow='Following'
                title='Watchlist'
                action={
                    <AddWatchlistDialog
                        watchlist={watchlist}
                        addToWatchlist={addToWatchlist}
                    />
                }
            />

            <Card>
                <CardContent>
                    {watchlist.length === 0 ? (
                        <p className='py-8 text-center text-sm text-muted-foreground'>
                            Your watchlist is empty. Add an asset to start
                            tracking it.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>

                                    <TableHead className='text-right'>
                                        Price
                                    </TableHead>

                                    <TableHead className='text-right'>
                                        Today
                                    </TableHead>

                                    <TableHead className='text-right'>
                                        Trend
                                    </TableHead>

                                    <TableHead />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {watchlist.map((w) => (
                                    <TableRow
                                        key={w.t}
                                        className='cursor-pointer'
                                        onClick={() =>
                                            router.push(`/asset/${w.t}`)
                                        }>
                                        <TableCell>
                                            <div className='flex items-center gap-2.5'>
                                                <AvatarBadge
                                                    t={w.t}
                                                    cat={w.cat}
                                                />

                                                <div>
                                                    <div className='text-[13px] font-semibold'>
                                                        {w.name}
                                                    </div>

                                                    <div className='text-[11.5px] text-muted-foreground'>
                                                        {w.t}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className='text-right font-mono'>
                                            {fmtEUR(w.price)}
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
                                                className='inline-flex h-6.5 w-6.5 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromWatchlist(w.t);
                                                }}
                                                aria-label={`Remove ${w.t}`}>
                                                <X size={14} />
                                            </button>
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
