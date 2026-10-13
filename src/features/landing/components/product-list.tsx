import {
    Container,
    Eyebrow,
} from '@/features/landing/components/container';

const ITEMS = [
    {
        n: '01',
        title: 'Dashboard',
        text: 'Portfolio value, performance over time and allocation at a glance.',
    },
    {
        n: '02',
        title: 'Portfolio',
        text: 'Holdings with price, average cost and profit or loss, filterable by asset class.',
    },
    {
        n: '03',
        title: 'Watchlist',
        text: 'Follow assets you are considering, with a one-month trend for each.',
    },
    {
        n: '04',
        title: 'Transactions',
        text: 'Every buy and sell in a single, compact ledger.',
    },
    {
        n: '05',
        title: 'Analytics',
        text: 'Best and weakest performers, cash ratio, win rate and benchmark comparison.',
    },
];

export function ProductList() {
    return (
        <section
            id='product'
            aria-labelledby='product-title'
            className='scroll-mt-4 border-b border-border'>
            <Container className='grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-5'>
                    <Eyebrow className='mb-4'>Product</Eyebrow>
                    <h2
                        id='product-title'
                        className='mb-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[44px]'>
                        From &ldquo;how am I doing?&rdquo; to &ldquo;why?&rdquo;
                    </h2>
                    <p className='max-w-sm text-[15px] leading-relaxed text-muted-foreground'>
                        Start with the overview. Go as deep as you need
                        without leaving the product.
                    </p>
                </div>

                <ol className='border-t border-border-strong lg:col-span-7'>
                    {ITEMS.map((item) => (
                        <li
                            key={item.title}
                            className='grid grid-cols-[3rem_1fr] gap-x-4 border-b border-border-strong py-6 md:grid-cols-[4rem_14rem_1fr] md:items-baseline md:py-7'>
                            <span className='font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground'>
                                {item.n}
                            </span>
                            <h3 className='text-xl font-semibold tracking-[-0.02em] md:text-2xl'>
                                {item.title}
                            </h3>
                            <p className='col-start-2 mt-2 text-[14px] leading-relaxed text-muted-foreground md:col-start-3 md:mt-0'>
                                {item.text}
                            </p>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}
