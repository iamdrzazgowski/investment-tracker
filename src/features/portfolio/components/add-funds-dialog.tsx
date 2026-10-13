'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import { addFundsAction } from '@/actions/portfolio.actions';

import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AddFundsDialog() {
    const [amount, setAmount] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const value = parseFloat(amount);

    const handleAddFunds = async () => {
        setError(null);

        if (!(value > 0)) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await addFundsAction(value);

            if (!result.success) {
                setError(result.error ?? 'Something went wrong');
                return;
            }

            setAmount('');
            setOpen(false);
        } catch (error) {
            console.error(error);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button className='h-9 px-3.5 text-[13.5px]'>
                        <Plus size={14} />
                        Add funds
                    </Button>
                }
            />

            <DialogContent className='gap-0 p-0 sm:max-w-sm'>
                <DialogHeader className='border-b px-6 py-4'>
                    <DialogTitle>Add funds</DialogTitle>
                </DialogHeader>

                <div className='flex flex-col gap-5 p-6'>
                    <div>
                        <Label
                            htmlFor='amount'
                            className='mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                            Amount (USD)
                        </Label>

                        <Input
                            id='amount'
                            type='number'
                            min='1'
                            step='0.01'
                            placeholder='1000'
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError(null);
                            }}
                            autoFocus
                            disabled={isLoading}
                            className='h-11 w-full bg-background px-3 font-mono text-base tabular-nums shadow-none placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:ring-0'
                        />

                        {error && (
                            <p className='mt-1 text-[12px] text-destructive'>
                                {error}
                            </p>
                        )}
                    </div>

                    <Button
                        type='button'
                        disabled={!(value > 0) || isLoading}
                        onClick={handleAddFunds}
                        className='h-10 w-full justify-center text-[13.5px]'>
                        {isLoading ? 'Adding...' : 'Add to cash balance'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
