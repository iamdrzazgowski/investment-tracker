'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AssetSearchField } from '@/components/shared/asset-search-field';
import type { AssetSearchResult } from '@/lib/repositories/asset.repository';

type GlobalSearchContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const GlobalSearchContext =
    React.createContext<GlobalSearchContextValue | null>(null);

export function useGlobalSearch() {
    const ctx = React.useContext(GlobalSearchContext);
    if (!ctx) {
        throw new Error(
            'useGlobalSearch must be used inside <GlobalSearchProvider>',
        );
    }
    return ctx;
}

function isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return (
        target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    );
}

/**
 * Owns the single command-palette style search dialog for the whole app shell.
 * Triggers (`SearchBar`, the mobile tab) only flip `open`; the keyboard
 * shortcut (⌘K / Ctrl+K, or `/`) works from anywhere.
 */
export function GlobalSearchProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setOpen((prev) => !prev);
            } else if (
                event.key === '/' &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.altKey &&
                !isTypingTarget(event.target)
            ) {
                event.preventDefault();
                setOpen(true);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleSelect = (asset: AssetSearchResult) => {
        setOpen(false);
        router.push(`/asset/${encodeURIComponent(asset.t)}`);
    };

    const value = React.useMemo(() => ({ open, setOpen }), [open]);

    return (
        <GlobalSearchContext.Provider value={value}>
            {children}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    placement='top'
                    showCloseButton={false}
                    className='gap-0 p-0'>
                    <DialogTitle className='sr-only'>Search assets</DialogTitle>

                    {open && (
                        <AssetSearchField
                            emptyMessage='Start typing to search stocks and ETFs.'
                            enterLabel='Open'
                            actionIcon={
                                <ArrowUpRight
                                    size={14}
                                    aria-hidden
                                    className='hidden shrink-0 text-muted-foreground sm:block'
                                />
                            }
                            onSelect={handleSelect}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </GlobalSearchContext.Provider>
    );
}

const subscribeNoop = () => () => {};
const getIsMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

/** Wide search field shown inside the page content on tablet/desktop. */
export function SearchBar() {
    const { setOpen } = useGlobalSearch();
    const isMac = React.useSyncExternalStore(subscribeNoop, getIsMac, () => true);

    return (
        <button
            type='button'
            onClick={() => setOpen(true)}
            className='group flex h-10 w-full items-center gap-2.5 rounded-lg border border-border bg-card px-3 text-[13.5px] text-muted-foreground transition-colors duration-150 hover:border-input hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring'>
            <Search size={15} aria-hidden className='shrink-0' />
            <span className='flex-1 truncate text-left'>Search assets…</span>
            <kbd className='rounded border border-border bg-muted px-1.5 py-px font-mono text-[10.5px] text-muted-foreground'>
                {isMac ? '⌘ K' : 'Ctrl K'}
            </kbd>
        </button>
    );
}
