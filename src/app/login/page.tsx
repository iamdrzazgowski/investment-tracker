'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/login-form';
import Showcase from '@/components/ui/showcase';

export default function LoginPage() {
    return (
        <div className='min-h-svh bg-[#FAFAF8] text-[#15151A]'>
            <div className='grid min-h-svh lg:grid-cols-2'>
                <div className='flex flex-col gap-4 p-6 md:p-10'>
                    <div className='flex items-center justify-start gap-2'>
                        <Link
                            href='/'
                            className='flex items-center gap-2 font-semibold'>
                            <div className='flex size-7 items-center justify-center rounded-md bg-[#15151A] text-sm font-bold text-white'>
                                N
                            </div>

                            <span>Nordwell</span>
                        </Link>
                    </div>

                    <div className='flex flex-1 items-center justify-center'>
                        <div className='w-full max-w-sm'>
                            <LoginForm />
                        </div>
                    </div>
                </div>

                <Showcase />
            </div>
        </div>
    );
}
