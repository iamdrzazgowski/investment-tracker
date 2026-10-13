import { cn } from '@/lib/utils';
import type { Category } from '@/lib/data';

/**
 * Monochrome ticker tile. Category is conveyed by the label itself, not by
 * colour — colour is reserved for performance.
 */
export function AvatarBadge({
    t,
    cat,
    size = 'md',
}: {
    t: string;
    cat: Category | string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const dim =
        size === 'lg'
            ? 'h-11 w-11 text-[13px]'
            : size === 'sm'
              ? 'h-7 w-7 text-[9.5px]'
              : 'h-8 w-8 text-[10.5px]';
    return (
        <span
            aria-hidden
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono font-semibold tracking-tight text-foreground',
                dim,
            )}>
            {t.slice(0, cat === 'Crypto' && t.length <= 3 ? 3 : 2)}
        </span>
    );
}
