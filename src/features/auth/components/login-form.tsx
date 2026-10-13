'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { loginAction } from '@/actions/auth/login';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    authButtonClass,
    authErrorClass,
    authInputClass,
    authLabelClass,
} from '@/features/auth/components/auth-form-styles';

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const router = useRouter();

    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginInput) => {
        setServerError(null);

        const result = await loginAction(values);

        if (!result.success) {
            if (result.fieldErrors) {
                Object.entries(result.fieldErrors).forEach(
                    ([field, messages]) => {
                        if (messages?.length) {
                            setError(field as keyof LoginInput, {
                                type: 'server',
                                message: messages[0],
                            });
                        }
                    },
                );
            }

            if (result.error) {
                setServerError(result.error);
            }

            return;
        }

        router.push('/dashboard');
        router.refresh();
    };

    return (
        <div className={cn('flex flex-col', className)}>
            <header className='mb-10'>
                <p className={cn(authLabelClass, 'mb-3')}>Welcome back</p>
                <h1 className='mb-3 text-[32px] font-semibold leading-none tracking-[-0.03em] md:text-[40px]'>
                    Log in
                </h1>
                <p className='text-[14px] leading-relaxed text-muted-foreground'>
                    Enter your email and password to open your portfolio.
                </p>
            </header>

            <form {...props} onSubmit={handleSubmit(onSubmit)} noValidate>
                <FieldGroup className='gap-6'>
                    <Field className='gap-2.5'>
                        <FieldLabel htmlFor='email' className={authLabelClass}>
                            Email
                        </FieldLabel>

                        <Input
                            id='email'
                            type='email'
                            placeholder='marta@example.com'
                            autoComplete='email'
                            aria-invalid={Boolean(errors.email)}
                            {...register('email')}
                            className={authInputClass}
                        />

                        {errors.email && (
                            <p className={authErrorClass}>
                                {errors.email.message}
                            </p>
                        )}
                    </Field>

                    <Field className='gap-2.5'>
                        <div className='flex items-center'>
                            <FieldLabel
                                htmlFor='password'
                                className={authLabelClass}>
                                Password
                            </FieldLabel>

                            <Link
                                href='#'
                                onClick={(e) => e.preventDefault()}
                                className='ml-auto text-[12px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'>
                                Forgot password?
                            </Link>
                        </div>

                        <Input
                            id='password'
                            type='password'
                            autoComplete='current-password'
                            aria-invalid={Boolean(errors.password)}
                            {...register('password')}
                            className={authInputClass}
                        />

                        {errors.password && (
                            <p className={authErrorClass}>
                                {errors.password.message}
                            </p>
                        )}
                    </Field>

                    {serverError && (
                        <p role='alert' className={authErrorClass}>
                            {serverError}
                        </p>
                    )}

                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className={authButtonClass}>
                        {isSubmitting ? 'Logging in…' : 'Log in'}
                    </Button>
                </FieldGroup>
            </form>

            <p className='mt-8 border-t border-border pt-6 text-[13px] text-muted-foreground'>
                Don&apos;t have an account?{' '}
                <Link
                    href='/signup'
                    className='font-medium text-foreground underline underline-offset-4'>
                    Sign up
                </Link>
            </p>

            <p className='mt-6 text-[11.5px] leading-relaxed text-muted-foreground/80'>
                By continuing, you agree to Nordwell&apos;s Terms of Service and
                Privacy Policy.
            </p>
        </div>
    );
}
