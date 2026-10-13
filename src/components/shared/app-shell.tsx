import { ContentBar } from '@/components/shared/content-bar';
import { GlobalSearchProvider } from '@/components/shared/global-search';
import { MobileHeader } from '@/components/shared/mobile-header';
import { MobileNav } from '@/components/shared/mobile-nav';
import { Sidebar } from '@/components/shared/sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <GlobalSearchProvider>
            <div className='flex min-h-screen'>
                <Sidebar />
                <div className='flex min-w-0 flex-1 flex-col'>
                    <MobileHeader />
                    <main className='flex-1 px-4 pt-6 pb-28 md:px-6 md:pt-6 md:pb-16 lg:px-8'>
                        <div className='mx-auto max-w-360'>
                            <ContentBar />
                            {children}
                        </div>
                    </main>
                </div>
            </div>
            <MobileNav />
        </GlobalSearchProvider>
    );
}
