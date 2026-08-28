'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { signupAction } from '@/actions/auth/signup';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: SignupInput) => {
        setServerError(null);

        const result = await signupAction(values);

        if (!result.success) {
            if (result.fieldErrors) {
                Object.entries(result.fieldErrors).forEach(
                    ([field, messages]) => {
                        if (messages?.length) {
                            setError(field as keyof SignupInput, {
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
    };

    return (
        <div className='flex flex-col gap-4'>
            <Card
                className={cn('border-border bg-card shadow-none', className)}>
                <CardHeader>
                    <CardTitle className='text-[17px] font-semibold tracking-tight'>
                        Create your account
                    </CardTitle>

                    <CardDescription className='text-[12.5px] text-muted-foreground'>
                        Start tracking your portfolio in minutes
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        {...props}
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate>
                        <FieldGroup className='gap-5'>
                            <Field>
                                <FieldLabel
                                    htmlFor='name'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Full Name
                                </FieldLabel>

                                <Input
                                    id='name'
                                    type='text'
                                    placeholder='John Doe'
                                    autoComplete='name'
                                    {...register('name')}
                                    className='h-auto rounded-lg border-border bg-background px-2.75 py-2.25 font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />

                                {errors.name && (
                                    <p className='mt-1.5 text-[11.5px] text-destructive'>
                                        {errors.name.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
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

                            <Field>
                                <FieldLabel
                                    htmlFor='password'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Password
                                </FieldLabel>

                                <Input
                                    id='password'
                                    type='password'
                                    autoComplete='new-password'
                                    {...register('password')}
                                    className='h-auto rounded-lg border-border bg-background px-2.75 py-2.25 font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />

                                {errors.password ? (
                                    <p className='mt-1.5 text-[11.5px] text-destructive'>
                                        {errors.password.message}
                                    </p>
                                ) : (
                                    <p className='mt-1.5 text-[11.5px] text-muted-foreground'>
                                        Must be at least 8 characters long.
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel
                                    htmlFor='confirmPassword'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Confirm Password
                                </FieldLabel>

                                <Input
                                    id='confirmPassword'
                                    type='password'
                                    autoComplete='new-password'
                                    {...register('confirmPassword')}
                                    className='h-auto rounded-lg border-border bg-background px-2.75 py-2.25 font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />

                                {errors.confirmPassword && (
                                    <p className='mt-1.5 text-[11.5px] text-destructive'>
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </Field>

                            {serverError && (
                                <p
                                    role='alert'
                                    className='text-center text-[12px] text-destructive'>
                                    {serverError}
                                </p>
                            )}

                            <Button
                                type='submit'
                                disabled={isSubmitting}
                                className='h-auto w-full rounded-lg bg-primary px-3.5 py-2.5 text-[13.5px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90'>
                                {isSubmitting
                                    ? 'Creating account...'
                                    : 'Create account'}
                            </Button>

                            <div className='mt-1 text-center text-[12.5px] text-muted-foreground'>
                                Already have an account?{' '}
                                <Link
                                    href='/login'
                                    className='font-semibold text-foreground underline underline-offset-4'>
                                    Log in
                                </Link>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <p className='m-0 text-center text-[11px] leading-relaxed text-muted-foreground/70'>
                By continuing, you agree to Nordwell&apos;s Terms of Service and
                Privacy Policy.
            </p>
        </div>
    );
}
