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

import { AssetSearchField } from '@/components/shared/asset-search-field';
import type { AssetSearchResult } from '@/lib/repositories/asset.repository';

import type { AssetMeta } from '@/lib/data';

type AddWatchlistDialogProps = {
    watchlist: AssetMeta[];
    addToWatchlist: (asset: AssetMeta) => void;
};

export function AddWatchlistDialog({
    watchlist,
    addToWatchlist,
}: AddWatchlistDialogProps) {
    const [open, setOpen] = React.useState(false);

    const handleAdd = (asset: AssetSearchResult) => {
        addToWatchlist({
            t: asset.t,
            name: asset.name,
            cat: asset.cat,
            price: asset.price ?? 0,
            day: asset.day,
            seed: asset.t
                .split('')
                .reduce((acc, c) => acc + c.charCodeAt(0), 0),
        });
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

            <DialogContent className='max-w-95 gap-0 rounded-[14px] p-0'>
                <DialogHeader className='border-b px-4 py-3.5'>
                    <DialogTitle className='text-[13.5px] font-semibold'>
                        Add to watchlist
                    </DialogTitle>
                </DialogHeader>

                {open && (
                    <AssetSearchField
                        excludeTickers={watchlist.map((asset) => asset.t)}
                        emptyMessage='All suggested assets are already on your watchlist.'
                        actionIcon={
                            <Plus
                                size={14}
                                className='shrink-0 text-muted-foreground'
                            />
                        }
                        onSelect={handleAdd}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
