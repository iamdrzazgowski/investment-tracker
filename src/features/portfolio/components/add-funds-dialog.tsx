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
                    <Button className='h-8.75 rounded-lg px-3.5 text-[13.5px] font-semibold'>
                        <Plus size={14} />
                        Add funds
                    </Button>
                }
            />

            <DialogContent className='max-w-95 rounded-[14px] p-0'>
                <DialogHeader className='border-b px-4 py-3.5'>
                    <DialogTitle className='text-[13.5px] font-semibold'>
                        Add funds
                    </DialogTitle>
                </DialogHeader>

                <div className='flex flex-col gap-2.5 p-4 pt-0'>
                    <div>
                        <Label
                            htmlFor='amount'
                            className='mb-2.5 block text-[12px] font-semibold text-muted-foreground'>
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
                            className='mb-1 h-auto w-full rounded-lg border-border bg-[#FAFAF8] px-2.75 py-2.25 font-mono text-[14px] shadow-none placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:ring-0'
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
                        className='h-auto w-full justify-center rounded-lg px-3.5 py-2.75 text-[13px] font-semibold'>
                        {isLoading ? 'Adding...' : 'Add to cash balance'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
