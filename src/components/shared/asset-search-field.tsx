'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AvatarBadge } from '@/components/shared/avatar-badge';
import type { AssetSearchResult } from '@/lib/repositories/asset.repository';
import { fmtCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

type SearchFormValues = { query: string };

type AssetSearchFieldProps = {
    excludeTickers?: string[];
    emptyMessage: string;
    actionIcon: React.ReactNode;
    /** Label for the Enter key hint in the footer, e.g. "Open" or "Add". */
    enterLabel?: string;
    onSelect: (asset: AssetSearchResult) => void;
};

type SearchStatus =
    | { type: 'loading' }
    | { type: 'error'; message: string }
    | { type: 'ok'; results: AssetSearchResult[] };

const CATEGORY_LABEL: Record<string, string> = {
    Stocks: 'Stock',
    ETFs: 'ETF',
    Crypto: 'Crypto',
};

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className='rounded border border-border bg-muted px-1 py-px font-mono text-[10px] text-muted-foreground'>
            {children}
        </kbd>
    );
}

export function AssetSearchField({
    excludeTickers = [],
    emptyMessage,
    actionIcon,
    enterLabel = 'Select',
    onSelect,
}: AssetSearchFieldProps) {
    const listId = useId();
    const { register, control } = useForm<SearchFormValues>({
        defaultValues: { query: '' },
    });
    const queryField = register('query');
    const query = useWatch({ control, name: 'query', defaultValue: '' });
    const [status, setStatus] = useState<SearchStatus>({ type: 'loading' });
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        const trimmed = query.trim();

        const timeout = window.setTimeout(
            async () => {
                try {
                    const params = new URLSearchParams();
                    if (trimmed) params.set('q', trimmed);

                    const response = await fetch(
                        `/api/assets/search?${params.toString()}`,
                        {
                            signal: controller.signal,
                        },
                    );
                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error(
                                'You need to log in to search assets.',
                            );
                        }
                        throw new Error('Search failed');
                    }

                    const contentType =
                        response.headers.get('content-type') ?? '';
                    if (!contentType.includes('application/json')) {
                        throw new Error(
                            'Search returned a non-JSON response.',
                        );
                    }

                    const data = (await response.json()) as {
                        results?: AssetSearchResult[];
                    };
                    if (!Array.isArray(data.results)) {
                        throw new Error('Search returned bad data.');
                    }
                    setStatus({ type: 'ok', results: data.results });
                } catch (err) {
                    if (controller.signal.aborted) return;
                    console.error('Asset search failed:', err);
                    setStatus({
                        type: 'error',
                        message:
                            err instanceof Error && err.message
                                ? err.message
                                : 'Could not search assets. Try again.',
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

    const active = Math.min(activeIndex, Math.max(visible.length - 1, 0));
    const optionId = (index: number) => `${listId}-option-${index}`;

    const moveActive = (next: number) => {
        setActiveIndex(next);
        listRef.current
            ?.querySelector(`#${CSS.escape(optionId(next))}`)
            ?.scrollIntoView({ block: 'nearest' });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (visible.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            moveActive((active + 1) % visible.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            moveActive((active - 1 + visible.length) % visible.length);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            onSelect(visible[active]);
        }
    };

    const trimmedQuery = query.trim();

    return (
        <>
            <form
                className='flex items-center gap-3 border-b px-4'
                onSubmit={(event) => event.preventDefault()}>
                <Search
                    size={16}
                    aria-hidden
                    className='shrink-0 text-muted-foreground'
                />
                <Input
                    {...queryField}
                    onChange={(event) => {
                        setActiveIndex(0);
                        return queryField.onChange(event);
                    }}
                    onKeyDown={handleKeyDown}
                    role='combobox'
                    aria-label='Search assets'
                    aria-expanded={visible.length > 0}
                    aria-controls={listId}
                    aria-activedescendant={
                        visible.length > 0 ? optionId(active) : undefined
                    }
                    autoComplete='off'
                    autoCorrect='off'
                    spellCheck={false}
                    placeholder='Search ticker, company or crypto'
                    autoFocus
                    className='h-14 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground/70 focus-visible:border-0 focus-visible:ring-0 md:text-[15px] dark:bg-transparent'
                />
            </form>

            <div className='p-2'>
                {status.type === 'error' ? (
                    <p
                        role='alert'
                        className='px-2 py-10 text-center text-[13px] text-destructive'>
                        {status.message}
                    </p>
                ) : status.type === 'loading' ? (
                    <div className='flex items-center justify-center gap-2 px-2 py-10 text-[13px] text-muted-foreground'>
                        <Loader2 size={14} className='animate-spin' />
                        Searching…
                    </div>
                ) : visible.length === 0 ? (
                    <p className='px-2 py-10 text-center text-[13px] text-muted-foreground'>
                        {trimmedQuery
                            ? `No assets match "${trimmedQuery}".`
                            : emptyMessage}
                    </p>
                ) : (
                    <>
                        <div className='px-2.5 pt-1 pb-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                            {trimmedQuery
                                ? `Results · ${visible.length}`
                                : 'Suggested'}
                        </div>
                        <ul
                            ref={listRef}
                            id={listId}
                            role='listbox'
                            aria-label='Assets'
                            className='flex max-h-[min(24rem,55svh)] flex-col gap-px overflow-y-auto'>
                            {visible.map((asset, index) => (
                                <li
                                    key={asset.t}
                                    id={optionId(index)}
                                    role='option'
                                    aria-selected={index === active}>
                                    <button
                                        type='button'
                                        tabIndex={-1}
                                        onClick={() => onSelect(asset)}
                                        onMouseMove={() =>
                                            index !== active &&
                                            setActiveIndex(index)
                                        }
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors duration-150',
                                            index === active && 'bg-muted',
                                        )}>
                                        <AvatarBadge
                                            t={asset.t}
                                            cat={asset.cat}
                                        />
                                        <div className='min-w-0 flex-1'>
                                            <div className='flex items-baseline gap-2'>
                                                <span className='font-mono text-[13px] font-semibold'>
                                                    {asset.t}
                                                </span>
                                                <span className='font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground'>
                                                    {CATEGORY_LABEL[
                                                        asset.cat
                                                    ] ?? asset.cat}
                                                </span>
                                            </div>
                                            <div className='truncate text-[12.5px] text-muted-foreground'>
                                                {asset.name}
                                            </div>
                                        </div>
                                        <span className='font-mono text-[12.5px] tabular-nums'>
                                            {asset.price != null
                                                ? fmtCurrency(
                                                      asset.price,
                                                      asset.currency,
                                                  )
                                                : '—'}
                                        </span>
                                        {actionIcon}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className='hidden items-center gap-4 border-t px-4 py-2.5 text-[11.5px] text-muted-foreground sm:flex'>
                <span className='flex items-center gap-1.5'>
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    Navigate
                </span>
                <span className='flex items-center gap-1.5'>
                    <Kbd>↵</Kbd>
                    {enterLabel}
                </span>
                <span className='ml-auto flex items-center gap-1.5'>
                    <Kbd>Esc</Kbd>
                    Close
                </span>
            </div>
        </>
    );
}
