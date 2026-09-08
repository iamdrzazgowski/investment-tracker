'use client';

import * as React from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { AvatarBadge } from '@/components/avatar-badge';

import { WATCHLIST_POOL, type AssetMeta } from '@/lib/data';

import { fmtEUR } from '@/lib/format';

type AddWatchlistDialogProps = {
    watchlist: AssetMeta[];
    addToWatchlist: (asset: AssetMeta) => void;
};

export function AddWatchlistDialog({
    watchlist,
    addToWatchlist,
}: AddWatchlistDialogProps) {
    const [open, setOpen] = React.useState(false);

    const available = WATCHLIST_POOL.filter(
        (asset) => !watchlist.some((item) => item.t === asset.t),
    );

    const handleAdd = (asset: AssetMeta) => {
        addToWatchlist(asset);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button
                        variant='outline'
                        className='h-8.75 rounded-lg px-3.5 text-[13.5px] font-semibold'>
                        <Plus size={14} />
                        Add asset
                    </Button>
                }
            />

            <DialogContent className='max-w-95 rounded-[14px] p-0'>
                <DialogHeader className='border-b px-4 py-3.5'>
                    <DialogTitle className='text-[13.5px] font-semibold'>
                        Add to watchlist
                    </DialogTitle>
                </DialogHeader>

                <div className='p-2'>
                    {available.length === 0 ? (
                        <p className='px-2 py-8 text-center text-[12px] text-muted-foreground'>
                            All suggested assets are already on your watchlist.
                        </p>
                    ) : (
                        <div className='flex max-h-96 flex-col overflow-y-auto'>
                            {available.map((asset) => (
                                <button
                                    key={asset.t}
                                    type='button'
                                    onClick={() => handleAdd(asset)}
                                    className='flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-accent'>
                                    <AvatarBadge t={asset.t} cat={asset.cat} />

                                    <div className='min-w-0 flex-1'>
                                        <div className='truncate text-[13px] font-semibold'>
                                            {asset.name}
                                        </div>

                                        <div className='text-[11.5px] text-muted-foreground'>
                                            {asset.t} ·{' '}
                                            <span className='font-mono'>
                                                {fmtEUR(asset.price)}
                                            </span>
                                        </div>
                                    </div>

                                    <Plus
                                        size={14}
                                        className='shrink-0 text-muted-foreground'
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
