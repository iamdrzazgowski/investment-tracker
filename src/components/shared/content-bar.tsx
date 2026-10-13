'use client';

import { usePathname } from 'next/navigation';
import { isNavActive, NAV } from '@/components/shared/nav-items';
import { SearchBar } from '@/components/shared/global-search';

/**
 * Top row of the page content (tablet and up): where you are on the left,
 * global asset search on the right. Not part of the navigation chrome.
 * On mobile, search lives in the bottom tab bar instead.
 */
export function ContentBar() {
    const pathname = usePathname();
    const current = NAV.find((n) => isNavActive(pathname, n.href));

    return (
        <div className='mb-8 hidden items-center justify-between gap-6 border-b border-border pb-4 md:mb-10 md:flex'>
            <div className='font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                Nordwell
                <span className='mx-2 text-border-strong'>/</span>
                <span className='text-foreground'>
                    {current?.label ?? 'Asset'}
                </span>
            </div>
            <div className='w-full max-w-sm'>
                <SearchBar />
            </div>
        </div>
    );
}
