import { MobileHeader } from '@/components/mobile-header';
import { Sidebar } from '@/components/sidebar';

export default function AppLayout({ children }) {
    return (
        <div className='flex min-h-screen'>
            <Sidebar />
            <div className='flex min-w-0 flex-1 flex-col'>
                <MobileHeader />
                <main className='flex-1 px-4 py-6 md:px-10 md:py-8'>
                    <div className='mx-auto max-w-[1180px]'>{children}</div>
                </main>
            </div>
        </div>
    );
}
