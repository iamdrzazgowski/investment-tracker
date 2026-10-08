'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Search } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AssetSearchField } from '@/components/shared/asset-search-field';
import type { AssetSearchResult } from '@/lib/repositories/asset.repository';
import { cn } from '@/lib/utils';

export function SearchTrigger({ variant }: { variant: 'bar' | 'icon' }) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleSelect = (asset: AssetSearchResult) => {
        setOpen(false);
        router.push(`/asset/${encodeURIComponent(asset.t)}`);
    };

    return (
        <>
            {variant === 'bar' ? (
                <button
                    type='button'
                    onClick={() => setOpen(true)}
                    className='mb-3 flex w-full items-center gap-2.5 rounded-lg border border-border bg-background px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground'>
                    <Search size={14} className='shrink-0' />
                    <span className='flex-1 truncate text-left'>
                        Search assets…
                    </span>
                    <kbd className='rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium'>
                        ⌘K
                    </kbd>
                </button>
            ) : (
                <button
                    type='button'
                    onClick={() => setOpen(true)}
                    aria-label='Search assets'
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg border border-border',
                    )}>
                    <Search size={17} />
                </button>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='max-w-95 gap-0 rounded-[14px] p-0'>
                    <DialogHeader className='border-b px-4 py-3.5'>
                        <DialogTitle className='text-[13.5px] font-semibold'>
                            Search assets
                        </DialogTitle>
                    </DialogHeader>

                    {open && (
                        <AssetSearchField
                            emptyMessage='Start typing to search stocks and ETFs.'
                            actionIcon={
                                <ChevronRight
                                    size={14}
                                    className='shrink-0 text-muted-foreground'
                                />
                            }
                            onSelect={handleSelect}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
