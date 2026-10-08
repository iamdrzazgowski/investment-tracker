import { AppShell } from '@/components/shared/app-shell';
import { AddFundsDialog } from '@/features/portfolio/components/add-funds-dialog';
import { AllocationDonut } from '@/features/portfolio/components/allocation-donut';
import { Delta } from '@/components/shared/delta';
import { PageHeader } from '@/components/shared/page-header';
import { HoldingsPreview } from '@/features/portfolio/components/holdings-preview';
import { PerformanceChart } from '@/features/portfolio/components/performance-chart';
import { RecentTransactions } from '@/features/portfolio/components/recent-transactions';
import { StatRow } from '@/features/portfolio/components/stat-row';
import { TopMovers } from '@/features/portfolio/components/top-movers';
import { fmtEUR, fmtSigned } from '@/lib/format';

export default function DashboardPage() {
    return (
        <AppShell>
            <PageHeader
                eyebrow='Overview'
                title='Dashboard'
                action={<AddFundsDialog />}
            />
            <div className='mb-5'>
                <div className='mb-1.5 text-[13px] text-muted-foreground'>
                    Total portfolio value
                </div>
                <div className='font-mono text-[32px] font-bold tracking-tight md:text-[42px]'>
                    {fmtEUR(3000)}
                </div>
                <div className='mt-2 flex items-center gap-2.5'>
                    <Delta value={10} />
                    <span className='font-mono text-[13px] text-muted-foreground'>
                        {fmtSigned(10)} today
                    </span>
                </div>
            </div>
            <StatRow totals={0} />
            <div className='mb-5'>
                <PerformanceChart seed={1} endValue={5000} />
            </div>
            <div className='grid gap-5 lg:grid-cols-[1.55fr_1fr]'>
                <TopMovers />
                <AllocationDonut />
            </div>
            <div className='mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]'>
                <HoldingsPreview />
                <RecentTransactions />
            </div>
        </AppShell>
    );
}
