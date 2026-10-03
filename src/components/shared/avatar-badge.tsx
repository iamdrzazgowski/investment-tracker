import { cn } from '@/lib/utils';
import type { Category } from '@/lib/data';

export function AvatarBadge({
    t,
    cat,
    size = 'md',
}: {
    t: string;
    cat: Category | string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const bg =
        cat === 'Crypto'
            ? '#F4EBD8'
            : cat === 'ETFs'
              ? 'hsl(var(--positive-soft))'
              : '#EEEEF0';
    const fg =
        cat === 'Crypto'
            ? '#9C7A2E'
            : cat === 'ETFs'
              ? 'hsl(var(--positive))'
              : '#15151A';
    const dim =
        size === 'lg'
            ? 'h-11 w-11 text-[13px]'
            : size === 'sm'
              ? 'h-7 w-7 text-[10px]'
              : 'h-[30px] w-[30px] text-[10.5px]';
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
                dim,
            )}
            style={{ background: bg, color: fg }}>
            {t.slice(0, cat === 'Crypto' && t.length <= 3 ? 3 : 2)}
        </span>
    );
}
