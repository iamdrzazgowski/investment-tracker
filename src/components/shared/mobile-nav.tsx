'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ellipsis, Search } from 'lucide-react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    isNavActive,
    MOBILE_MORE,
    MOBILE_TABS,
} from '@/components/shared/nav-items';
import { useGlobalSearch } from '@/components/shared/global-search';
import { LogoutButton } from '@/components/shared/logout-button';
import { cn } from '@/lib/utils';

const tabClass =
    'relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10.5px] font-medium text-muted-foreground transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring';

function ActiveMark() {
    return (
        <span
            aria-hidden
            className='absolute inset-x-5 top-0 h-0.5 bg-foreground'
        />
    );
}

/**
 * Bottom tab bar for mobile. Search sits in the centre slot so it is always
 * within thumb reach; everything that doesn't fit lives under "More".
 */
export function MobileNav() {
    const pathname = usePathname();
    const { setOpen: setSearchOpen } = useGlobalSearch();
    const [moreOpen, setMoreOpen] = useState(false);

    const [first, second, third] = MOBILE_TABS;
    const moreActive = MOBILE_MORE.some((n) => isNavActive(pathname, n.href));

    const renderTab = (n: (typeof MOBILE_TABS)[number]) => {
        const active = isNavActive(pathname, n.href);
        const Icon = n.icon;
        return (
            <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={cn(tabClass, active && 'text-foreground')}>
                {active && <ActiveMark />}
                <Icon size={20} strokeWidth={1.75} />
                {n.label}
            </Link>
        );
    };

    return (
        <nav
            aria-label='Main'
            className='fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden'>
            {renderTab(first)}
            {renderTab(second)}

            <button
                type='button'
                onClick={() => setSearchOpen(true)}
                className={cn(tabClass, 'text-foreground')}>
                <span className='flex h-6 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground'>
                    <Search size={15} strokeWidth={2} />
                </span>
                Search
            </button>

            {renderTab(third)}

            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetTrigger
                    className={cn(tabClass, moreActive && 'text-foreground')}>
                    {moreActive && <ActiveMark />}
                    <Ellipsis size={20} strokeWidth={1.75} />
                    More
                </SheetTrigger>
                <SheetContent
                    side='bottom'
                    showCloseButton={false}
                    className='gap-0 rounded-t-xl p-0 pb-[env(safe-area-inset-bottom)]'>
                    <SheetTitle className='border-b border-border px-5 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        More
                    </SheetTitle>
                    <ul className='flex flex-col p-2'>
                        {MOBILE_MORE.map((n) => {
                            const active = isNavActive(pathname, n.href);
                            const Icon = n.icon;
                            return (
                                <li key={n.href}>
                                    <SheetClose
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={n.href}
                                                aria-current={
                                                    active ? 'page' : undefined
                                                }
                                                className={cn(
                                                    'flex items-center gap-3 rounded-lg px-3 py-3.5 text-[15px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground',
                                                    active &&
                                                        'bg-muted font-semibold text-foreground',
                                                )}
                                            />
                                        }>
                                        <Icon size={18} strokeWidth={1.75} />
                                        {n.label}
                                    </SheetClose>
                                </li>
                            );
                        })}
                    </ul>
                    <div className='border-t border-border px-2 py-2'>
                        <div className='flex items-center gap-3 px-3 py-2'>
                            <span className='flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card font-mono text-[11px] font-semibold'>
                                MK
                            </span>
                            <div>
                                <div className='text-[13px] font-semibold'>
                                    Marta K.
                                </div>
                                <div className='text-[11.5px] text-muted-foreground'>
                                    Personal account
                                </div>
                            </div>
                        </div>
                        <LogoutButton
                            className='px-3 py-3.5 text-[15px]'
                            onDone={() => setMoreOpen(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    );
}
