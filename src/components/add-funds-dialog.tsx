'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AddFundsDialog() {
    const [amount, setAmount] = useState('');
    const [open, setOpen] = useState(false);

    const value = parseFloat(amount);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button className='h-[35px] rounded-lg px-[14px] text-[13.5px] font-semibold'>
                        <Plus size={14} />
                        Add funds
                    </Button>
                }
            />

            <DialogContent className='max-w-[380px] rounded-[14px] p-0'>
                <DialogHeader className='border-b px-4 py-[14px]'>
                    <DialogTitle className='text-[13.5px] font-semibold'>
                        Add funds
                    </DialogTitle>
                </DialogHeader>

                <div className='flex flex-col gap-[10px] p-4 pt-0'>
                    <div>
                        <Label
                            htmlFor='amount'
                            className='mb-[10px] block text-[12px] font-semibold text-muted-foreground'>
                            Amount (EUR)
                        </Label>

                        <Input
                            id='amount'
                            type='number'
                            min='1'
                            placeholder='1000'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            autoFocus
                            className='mb-1 h-auto w-full rounded-lg border-border bg-[#FAFAF8] px-[11px] py-[9px] font-mono text-[14px] shadow-none placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:ring-0'
                        />
                    </div>

                    <DialogClose
                        render={
                            <Button
                                disabled={!(value > 0)}
                                onClick={() => setAmount('')}
                                className='h-auto w-full justify-center rounded-lg px-[14px] py-[11px] text-[13px] font-semibold'>
                                Add to cash balance
                            </Button>
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
