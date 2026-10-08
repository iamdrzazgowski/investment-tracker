'use client';

import { SignupForm } from '@/features/auth/components/signup-form';
import AuthShowcase from '@/features/auth/components/auth-showcase';

export default function SignupPage() {
    return (
        <div className='grid min-h-svh lg:grid-cols-2'>
            <div className='flex flex-col gap-4 p-6 md:p-10'>

                <div className='flex flex-1 items-center justify-center'>
                    <div className='w-full max-w-sm'>
                        <SignupForm />
                    </div>
                </div>
            </div>
            <AuthShowcase />
        </div>
    );
}
