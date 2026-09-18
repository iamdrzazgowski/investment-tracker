'use client';

import { useState, useEffect } from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { Loader2, Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

import { AvatarBadge } from '@/components/avatar-badge';

import type { AssetMeta } from '@/lib/data';
import { fmtEUR } from '@/lib/format';

type SearchFormValues = {
    query: string;
};

type AssetSearchFieldProps = {
    excludeTickers?: string[];
    emptyMessage: string;
    actionIcon: React.ReactNode;
    onSelect: (asset: AssetMeta) => void;
};

type SearchStatus =
    | { type: 'loading' }
    | { type: 'error'; message: string }
    | { type: 'ok'; results: AssetMeta[] };

export function AssetSearchField({
    excludeTickers = [],
    emptyMessage,
    actionIcon,
    onSelect,
}: AssetSearchFieldProps) {
    const { register, control } = useForm<SearchFormValues>({
        defaultValues: { query: '' },
    });

    const query = useWatch({
        control,
        name: 'query',
        defaultValue: '',
    });

    const [status, setStatus] = useState<SearchStatus>({
        type: 'loading',
    });

    useEffect(() => {
        const controller = new AbortController();
        const trimmed = query.trim();

        const timeout = window.setTimeout(
            async () => {
                try {
                    const params = new URLSearchParams();

                    if (trimmed) {
                        params.set('q', trimmed);
                    }

                    const response = await fetch(
                        `/api/assets/search?${params.toString()}`,
                        { signal: controller.signal },
                    );

                    if (!response.ok) {
                        throw new Error('Search failed');
                    }

                    const data = (await response.json()) as {
                        results: AssetMeta[];
                    };
                    setStatus({ type: 'ok', results: data.results });
                } catch (err) {
                    if (controller.signal.aborted) {
                        return;
                    }

                    console.error(err);
                    setStatus({
                        type: 'error',
                        message: 'Could not search assets. Try again.',
                    });
                }
            },
            trimmed ? 250 : 0,
        );

        return () => {
            controller.abort();
            window.clearTimeout(timeout);
        };
    }, [query]);

    const visible =
        status.type === 'ok'
            ? status.results.filter(
                  (asset) => !excludeTickers.includes(asset.t),
              )
            : [];

    return (
        <>
            <form
                className='border-b px-3 py-2.5'
                onSubmit={(event) => event.preventDefault()}>
                <div className='relative'>
                    <Search
                        size={14}
                        className='pointer-events-none absolute top-1/2 left-2.75 -translate-y-1/2 text-muted-foreground'
                    />

                    <Input
                        {...register('query')}
                        placeholder='Search ticker or name'
                        autoFocus
                        className='h-auto rounded-lg border-border bg-[#FAFAF8] py-2.25 pr-2.75 pl-8 font-sans text-[13px] shadow-none placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:ring-0'
                    />
                </div>
            </form>

            <div className='p-2'>
                {status.type === 'error' ? (
                    <p className='px-2 py-8 text-center text-[12px] text-destructive'>
                        {status.message}
                    </p>
                ) : status.type === 'loading' ? (
                    <div className='flex items-center justify-center gap-2 px-2 py-8 text-[12px] text-muted-foreground'>
                        <Loader2 size={14} className='animate-spin' />
                        Searching…
                    </div>
                ) : visible.length === 0 ? (
                    <p className='px-2 py-8 text-center text-[12px] text-muted-foreground'>
                        {query.trim()
                            ? `No assets match “${query.trim()}”.`
                            : emptyMessage}
                    </p>
                ) : (
                    <div className='flex max-h-96 flex-col overflow-y-auto'>
                        {visible.map((asset) => (
                            <button
                                key={asset.t}
                                type='button'
                                onClick={() => onSelect(asset)}
                                className='flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-accent'>
                                <AvatarBadge t={asset.t} cat={asset.cat} />

                                <div className='min-w-0 flex-1'>
                                    <div className='truncate text-[13px] font-semibold'>
                                        {asset.name}
                                    </div>

                                    <div className='text-[11.5px] text-muted-foreground'>
                                        {asset.t} ·{' '}
                                        {asset.exchange &&
                                            `${asset.exchange} · `}
                                        <span className='font-mono'>
                                            {asset.price != null
                                                ? fmtEUR(asset.price)
                                                : '—'}
                                        </span>
                                    </div>
                                </div>

                                {actionIcon}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
