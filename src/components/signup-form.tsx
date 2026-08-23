'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';

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

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
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
                    <form {...props}>
                        <FieldGroup className='gap-5'>
                            <Field>
                                <FieldLabel
                                    htmlFor='name'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Full Name
                                </FieldLabel>

                                <Input
                                    id='name'
                                    name='name'
                                    type='text'
                                    placeholder='John Doe'
                                    required
                                    className='h-auto rounded-lg border-border bg-background px-[11px] py-[9px] font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />
                            </Field>

                            <Field>
                                <FieldLabel
                                    htmlFor='email'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Email
                                </FieldLabel>

                                <Input
                                    id='email'
                                    name='email'
                                    type='email'
                                    placeholder='marta@example.com'
                                    required
                                    className='h-auto rounded-lg border-border bg-background px-[11px] py-[9px] font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />
                            </Field>

                            <Field>
                                <FieldLabel
                                    htmlFor='password'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Password
                                </FieldLabel>

                                <Input
                                    id='password'
                                    name='password'
                                    type='password'
                                    required
                                    className='h-auto rounded-lg border-border bg-background px-[11px] py-[9px] font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />

                                <p className='mt-1.5 text-[11.5px] text-muted-foreground'>
                                    Must be at least 8 characters long.
                                </p>
                            </Field>

                            <Field>
                                <FieldLabel
                                    htmlFor='confirm-password'
                                    className='mb-1.5 text-[12.5px] font-semibold text-muted-foreground'>
                                    Confirm Password
                                </FieldLabel>

                                <Input
                                    id='confirm-password'
                                    name='confirm-password'
                                    type='password'
                                    required
                                    className='h-auto rounded-lg border-border bg-background px-[11px] py-[9px] font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />
                            </Field>

                            <Button
                                type='submit'
                                className='h-auto w-full rounded-lg bg-primary px-[14px] py-[10px] text-[13.5px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90'>
                                Create account
                            </Button>

                            <div className='mt-1 text-center text-[12.5px] text-muted-foreground'>
                                Already have an account?{' '}
                                <Link
                                    href='#'
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
