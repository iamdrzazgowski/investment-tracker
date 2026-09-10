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

import { AvatarBadge } from '@/components/avatar-badge';

import { CATALOG } from '@/lib/data';
import { fmtEUR } from '@/lib/format';

export function NewOrderDialog() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleSelect = (ticker: string) => {
        setOpen(false);
        router.push(`/asset/${ticker}`);
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

            <DialogContent className='max-w-95 rounded-[14px] p-0'>
                <DialogHeader className='border-b px-4 py-3.5'>
                    <DialogTitle className='text-[13.5px] font-semibold'>
                        New order — choose an asset
                    </DialogTitle>
                </DialogHeader>

                <div className='p-2'>
                    <div className='flex max-h-96 flex-col overflow-y-auto'>
                        {CATALOG.map((asset) => (
                            <button
                                key={asset.t}
                                type='button'
                                onClick={() => handleSelect(asset.t)}
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
