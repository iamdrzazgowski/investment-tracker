'use client';

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
import { useState } from 'react';

export function AddFundsDialog() {
    const [amount, setAmount] = useState('');
    const [open, setOpen] = useState(false);
    const value = parseFloat(amount);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button>
                        <Plus size={14} /> Add funds
                    </Button>
                }
            />

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add funds</DialogTitle>
                </DialogHeader>
                <div className='space-y-3 p-4'>
                    <div>
                        <Label htmlFor='amount'>Amount (EUR)</Label>
                        <Input
                            id='amount'
                            type='number'
                            min='1'
                            placeholder='1000'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogClose
                        render={
                            <Button
                                className='w-full'
                                disabled={!(value > 0)}
                                onClick={() => {
                                    setAmount('');
                                }}>
                                Add to cash balance
                            </Button>
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
