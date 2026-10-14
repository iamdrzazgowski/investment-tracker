'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function LogoutButton({
    className,
    onDone,
}: {
    className?: string;
    onDone?: () => void;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const handleLogout = async () => {
        if (pending) return;
        setPending(true);
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/login');
                        router.refresh();
                    },
                },
            });
        } finally {
            setPending(false);
            onDone?.();
        }
    };

    return (
        <button
            type='button'
            onClick={handleLogout}
            disabled={pending}
            className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-50',
                className,
            )}>
            <LogOut size={16} strokeWidth={1.75} />
            {pending ? 'Logging out…' : 'Log out'}
        </button>
    );
}
