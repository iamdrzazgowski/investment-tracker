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

import { AssetSearchField } from '@/components/asset-search-field';

import type { AssetMeta } from '@/lib/data';

export function NewOrderDialog() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleSelect = (asset: AssetMeta) => {
        setOpen(false);
        router.push(`/asset/${asset.t}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button
                        variant='outline'
                        className='h-8.75 rounded-lg px-3.5 text-[13.5px] font-semibold'>
                        <Plus size={14} />
                        New order
                    </Button>
                }
            />

            <DialogContent className='max-w-95 gap-0 rounded-[14px] p-0'>
                <DialogHeader className='border-b px-4 py-3.5'>
                    <DialogTitle className='text-[13.5px] font-semibold'>
                        New order — choose an asset
                    </DialogTitle>
                </DialogHeader>

                {open && (
                    <AssetSearchField
                        emptyMessage='No assets available.'
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
