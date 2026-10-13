'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { signupAction } from '@/actions/auth/signup';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import {
    authButtonClass,
    authErrorClass,
    authInputClass,
    authLabelClass,
} from '@/features/auth/components/auth-form-styles';

const compactInputClass = cn(authInputClass, 'h-10');

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
        router.refresh();
    };

    return (
        <div className={cn('flex flex-col', className)}>
            <header className='mb-6'>
                <p className={cn(authLabelClass, 'mb-2')}>Get started</p>
                <h1 className='mb-2 text-[28px] font-semibold leading-none tracking-[-0.03em] md:text-[32px]'>
                    Create account
                </h1>
                <p className='text-[13.5px] text-muted-foreground'>
                    Start tracking your portfolio in minutes.
                </p>
            </header>

            <form {...props} onSubmit={handleSubmit(onSubmit)} noValidate>
                <FieldGroup className='gap-4'>
                    <Field className='gap-2'>
                        <FieldLabel htmlFor='name' className={authLabelClass}>
                            Full name
                        </FieldLabel>

                        <Input
                            id='name'
                            type='text'
                            placeholder='John Doe'
                            autoComplete='name'
                            aria-invalid={Boolean(errors.name)}
                            {...register('name')}
                            className={compactInputClass}
                        />

                        {errors.name && (
                            <p className={authErrorClass}>
                                {errors.name.message}
                            </p>
                        )}
                    </Field>

                    <Field className='gap-2'>
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
                            className={compactInputClass}
                        />

                        {errors.email && (
                            <p className={authErrorClass}>
                                {errors.email.message}
                            </p>
                        )}
                    </Field>

                    <div className='flex flex-col gap-4'>
                        <Field className='gap-2'>
                            <FieldLabel
                                htmlFor='password'
                                className={authLabelClass}>
                                Password
                            </FieldLabel>

                            <Input
                                id='password'
                                type='password'
                                placeholder='Min. 8 characters'
                                autoComplete='new-password'
                                aria-invalid={Boolean(errors.password)}
                                {...register('password')}
                                className={compactInputClass}
                            />

                            {errors.password && (
                                <p className={authErrorClass}>
                                    {errors.password.message}
                                </p>
                            )}
                        </Field>

                        <Field className='gap-2'>
                            <FieldLabel
                                htmlFor='confirmPassword'
                                className={authLabelClass}>
                                Confirm password
                            </FieldLabel>

                            <Input
                                id='confirmPassword'
                                type='password'
                                autoComplete='new-password'
                                aria-invalid={Boolean(errors.confirmPassword)}
                                {...register('confirmPassword')}
                                className={compactInputClass}
                            />

                            {errors.confirmPassword && (
                                <p className={authErrorClass}>
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </Field>
                    </div>

                    {serverError && (
                        <p role='alert' className={authErrorClass}>
                            {serverError}
                        </p>
                    )}

                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className={cn(authButtonClass, 'h-10')}>
                        {isSubmitting
                            ? 'Creating account…'
                            : 'Create account'}
                    </Button>
                </FieldGroup>
            </form>

            <p className='mt-6 border-t border-border pt-4 text-[13px] text-muted-foreground'>
                Already have an account?{' '}
                <Link
                    href='/login'
                    className='font-medium text-foreground underline underline-offset-4'>
                    Log in
                </Link>
            </p>

            <p className='mt-4 text-[11.5px] leading-relaxed text-muted-foreground/80'>
                By continuing, you agree to Nordwell&apos;s Terms of Service and
                Privacy Policy.
            </p>
        </div>
    );
}
