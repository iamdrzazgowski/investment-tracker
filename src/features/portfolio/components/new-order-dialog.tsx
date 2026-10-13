'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
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

export function NewOrderDialog() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleSelect = (asset: AssetSearchResult) => {
        setOpen(false);
        router.push(`/asset/${asset.t}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button
                        variant='outline'
                        className='h-9 px-3.5 text-[13.5px]'>
                        <Plus size={14} />
                        New order
                    </Button>
                }
            />

            <DialogContent
                placement='top'
                showCloseButton={false}
                className='gap-0 p-0'>
                <DialogHeader className='border-b px-4 py-3'>
                    <DialogTitle className='font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        New order — choose an asset
                    </DialogTitle>
                </DialogHeader>

                {open && (
                    <AssetSearchField
                        emptyMessage='No assets available.'
                        enterLabel='Choose'
                        actionIcon={
                            <Plus
                                size={14}
                                className='shrink-0 text-muted-foreground'
                            />
                        }
                        onSelect={handleSelect}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
