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
                    <form {...props}>
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
                                    required
                                    className='h-auto rounded-lg border-border bg-background px-[11px] py-[9px] font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />
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
                                    required
                                    className='h-auto rounded-lg border-border bg-background px-[11px] py-[9px] font-sans text-sm shadow-none focus-visible:border-ring focus-visible:ring-0'
                                />
                            </Field>

                            <Field className='mt-1'>
                                <Button
                                    type='submit'
                                    className='h-auto w-full rounded-lg bg-primary px-[14px] py-[10px] text-[13.5px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90'>
                                    Log in
                                </Button>
                            </Field>

                            <Field className='mt-2'>
                                <FieldDescription className='mt-[18px] text-center text-[12.5px] text-muted-foreground'>
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
