'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { NAV } from '@/components/nav-items';
// import { SearchTrigger } from "@/components/global-search";
import { cn } from '@/lib/utils';
import { NordwellLogo } from './nordwell-logo';

export function MobileHeader() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const current = NAV.find(
        (n) =>
            n.href === pathname ||
            (n.href !== '/' && pathname.startsWith(n.href)),
    );

    return (
        <header className='sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden'>
            <Sheet open={open} onOpenChange={setOpen}>
                <span className='flex-1 text-sm font-semibold'>
                    {current?.label ?? 'Nordwell'}
                </span>
                <SheetTrigger
                    className='flex h-8 w-8 items-center justify-center rounded-lg border border-border'
                    aria-label='Open menu'>
                    <Menu size={17} />
                </SheetTrigger>
                <SheetContent side='left' className='p-0'>
                    <div className='flex items-center gap-2.5 border-b border-border p-4'>
                        <NordwellLogo />
                    </div>
                    <nav className='flex flex-col gap-0.5 p-3'>
                        {NAV.map((n) => {
                            const active =
                                pathname === n.href ||
                                (n.href !== '/' && pathname.startsWith(n.href));
                            const Icon = n.icon;
                            return (
                                <SheetClose
                                    key={n.href}
                                    nativeButton={false}
                                    render={
                                        <Link
                                            href={n.href}
                                            className={cn(
                                                'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                                                active &&
                                                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                                            )}
                                        />
                                    }>
                                    <Icon size={17} strokeWidth={2} />
                                    {n.label}
                                </SheetClose>
                            );
                        })}
                    </nav>
                    <div className='mt-auto flex items-center gap-2.5 border-t border-border p-4'>
                        <span className='flex h-7.5 w-7.5 items-center justify-center rounded-full bg-positive-soft text-[12px] font-bold text-positive'>
                            MK
                        </span>
                        <div>
                            <div className='text-[12.5px] font-semibold'>
                                Marta K.
                            </div>
                            <div className='text-[11px] text-muted-foreground'>
                                Personal account
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            {/*<span className='flex-1 text-sm font-semibold'>
                {current?.label ?? 'Nordwell'}
            </span>*/}
            {/* <SearchTrigger variant="icon" /> */}
        </header>
    );
}
