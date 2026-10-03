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

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';

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
        <div className='flex flex-col gap-4'>
            <Card className={cn('border-border bg-card', className)}>
                <CardHeader>
                    <CardTitle className='text-[17px] font-semibold tracking-tight'>
                        Log in to Nordwell
                    </CardTitle>

                    <CardDescription className='text-[12.5px] text-muted-foreground'>
                        Enter your email below to log in to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        {...props}
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate>
                        <FieldGroup>
                            <Field className='mb-4'>
                                <FieldLabel
                                    htmlFor='email'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Email
                                </FieldLabel>

                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='marta@example.com'
                                    autoComplete='email'
                                    {...register('email')}
                                    className='h-auto rounded-lg border-border bg-background px-2.75 py-2.25 font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />

                                {errors.email && (
                                    <p className='mt-1.5 text-[11.5px] text-destructive'>
                                        {errors.email.message}
                                    </p>
                                )}
                            </Field>

                            <Field className='mb-4'>
                                <div className='mb-1.5 flex items-center'>
                                    <FieldLabel
                                        htmlFor='password'
                                        className='text-[12.5px] font-semibold text-muted-foreground'>
                                        Password
                                    </FieldLabel>

                                    <Link
                                        href='#'
                                        onClick={(e) => e.preventDefault()}
                                        className='ml-auto text-[11.5px] text-muted-foreground no-underline hover:text-foreground'>
                                        Forgot your password?
                                    </Link>
                                </div>

                                <Input
                                    id='password'
                                    type='password'
                                    autoComplete='current-password'
                                    {...register('password')}
                                    className='h-auto rounded-lg border-border bg-background px-2.75 py-2.25 font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />

                                {errors.password && (
                                    <p className='mt-1.5 text-[11.5px] text-destructive'>
                                        {errors.password.message}
                                    </p>
                                )}
                            </Field>

                            {serverError && (
                                <p
                                    role='alert'
                                    className='mb-2 text-center text-[12px] text-destructive'>
                                    {serverError}
                                </p>
                            )}

                            <Field className='mt-1'>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='h-auto w-full rounded-lg bg-primary px-3.5 py-2.5 text-[13.5px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90'>
                                    {isSubmitting ? 'Logging in...' : 'Log in'}
                                </Button>
                            </Field>

                            <Field className='mt-2'>
                                <FieldDescription className='mt-4.5 text-center text-[12.5px] text-muted-foreground'>
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href='/signup'
                                        className='font-semibold text-foreground underline underline-offset-4'>
                                        Sign up
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <p className='text-center text-[11px] leading-relaxed text-muted-foreground/70'>
                By continuing, you agree to Nordwell&apos;s Terms of Service and
                Privacy Policy.
            </p>
        </div>
    );
}
