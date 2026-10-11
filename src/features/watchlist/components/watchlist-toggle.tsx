'use client';

import * as React from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    addWatchlistAction,
    removeWatchlistAction,
} from '@/actions/watchlist.actions';

export function WatchlistToggle({
    ticker,
    initialWatched,
}: {
    ticker: string;
    initialWatched: boolean;
}) {
    const [watched, setWatched] = React.useState(initialWatched);
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const toggle = async () => {
        setPending(true);
        setError(null);
        const previous = watched;
        setWatched(!previous);
        try {
            if (previous) {
                await removeWatchlistAction(ticker);
            } else {
                await addWatchlistAction(ticker);
            }
        } catch (err) {
            setWatched(previous);
            setError(err instanceof Error ? err.message : 'Failed to update watchlist');
        } finally {
            setPending(false);
        }
    };

    return (
        <div className='flex flex-col items-end gap-1'>
            <Button
                variant={watched ? 'secondary' : 'outline'}
                onClick={() => void toggle()}
                disabled={pending}
                className='h-8.75 rounded-lg px-3.5 text-[13.5px] font-semibold'>
                {pending ? (
                    <Loader2 size={14} className='animate-spin' />
                ) : watched ? (
                    <EyeOff size={14} />
                ) : (
                    <Eye size={14} />
                )}
                {watched ? 'Watching' : 'Watch'}
            </Button>
            {error && (
                <p className='text-[11.5px] text-destructive'>{error}</p>
            )}
        </div>
    );
}
