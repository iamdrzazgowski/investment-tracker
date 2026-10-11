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
import { addWatchlistAction } from '@/actions/watchlist.actions';

type AddWatchlistDialogProps = {
    excludeTickers: string[];
};

export function AddWatchlistDialog({ excludeTickers }: AddWatchlistDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleAdd = async (asset: AssetSearchResult) => {
        setPending(true);
        setError(null);
        try {
            // Persist to the database — the server resolves the ticker
            // against real market data (Yahoo) and creates the Asset +
            // WatchlistItem rows.
            await addWatchlistAction(asset.t);
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add asset');
        } finally {
            setPending(false);
        }
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

                {error && (
                    <p className='border-b px-4 py-2 text-[12px] text-destructive'>
                        {error}
                    </p>
                )}

                {open && (
                    <div className={pending ? 'pointer-events-none opacity-60' : undefined}>
                        <AssetSearchField
                            excludeTickers={excludeTickers}
                            emptyMessage='All suggested assets are already on your watchlist.'
                            actionIcon={
                                <Plus
                                    size={14}
                                    className='shrink-0 text-muted-foreground'
                                />
                            }
                            onSelect={(asset) => void handleAdd(asset)}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
