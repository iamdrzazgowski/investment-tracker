import { cn } from '@/lib/utils';

/** Shared page grid: 1440px max, 16 / 24 / 32px outer padding. */
export function Container({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'mx-auto w-full max-w-360 px-4 md:px-6 lg:px-8',
                className,
            )}
            {...props}
        />
    );
}

/** Small mono label used for section eyebrows. */
export function Eyebrow({
    className,
    ...props
}: React.ComponentProps<'p'>) {
    return (
        <p
            className={cn(
                'font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground',
                className,
            )}
            {...props}
        />
    );
}

/** `+` mark for grid intersections — decorative, never interactive. */
export function GridMark({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                'pointer-events-none absolute z-10 select-none font-mono text-[13px] leading-none text-border-strong',
                className,
            )}>
            +
        </span>
    );
}
