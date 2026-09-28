'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { fmtEUR, fmtNum } from '@/lib/format';
import { buyAction, sellAction } from '@/actions/portfolio.actions';

export function BuySellPanel({
    ticker,
    marketPrice,
    owned,
    ownedShares,
    cash,
}: {
    ticker: string;
    marketPrice: number;
    owned: boolean;
    ownedShares: number;
    cash: number;
}) {
    const [priceMode, setPriceMode] = useState<'market' | 'custom'>('market');
    const [customPrice, setCustomPrice] = useState(marketPrice.toFixed(2));
    const [qty, setQty] = useState('');
    const [toast, setToast] = useState('');
    const [isPending, startTransition] = useTransition();

    const price =
        priceMode === 'market' ? marketPrice : parseFloat(customPrice) || 0;
    const qtyNum = parseFloat(qty) || 0;
    const total = qtyNum * price;

    const canBuy =
        qtyNum > 0 && price > 0 && total <= cash + 0.005 && !isPending;
    const canSell =
        owned && qtyNum > 0 && qtyNum <= ownedShares && price > 0 && !isPending;

    function flash(msg: string) {
        setToast(msg);
        setQty('');
        setTimeout(() => setToast(''), 2200);
    }

    function handleBuy() {
        startTransition(async () => {
            await buyAction(ticker, qtyNum, price);
            flash(`Bought ${fmtNum(qtyNum, 0)} ${ticker}`);
        });
    }

    function handleSell() {
        startTransition(async () => {
            await sellAction(ticker, qtyNum, price);
            flash(`Sold ${fmtNum(qtyNum, 0)} ${ticker}`);
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade {ticker}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 pt-0'>
                <div>
                    <Label htmlFor='qty'>Quantity</Label>
                    <Input
                        id='qty'
                        type='number'
                        min='0'
                        step='1'
                        placeholder='0'
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                    />
                </div>

                <div>
                    <Label>Price</Label>
                    <div className='mb-2 inline-flex w-full rounded-lg border border-border p-1'>
                        <button
                            className={cn(
                                'flex-1 rounded-md px-2 py-1.5 text-[11.5px] font-semibold text-muted-foreground',
                                priceMode === 'market' &&
                                    'bg-primary text-primary-foreground',
                            )}
                            onClick={() => setPriceMode('market')}>
                            Current market price
                        </button>
                        <button
                            className={cn(
                                'flex-1 rounded-md px-2 py-1.5 text-[11.5px] font-semibold text-muted-foreground',
                                priceMode === 'custom' &&
                                    'bg-primary text-primary-foreground',
                            )}
                            onClick={() => setPriceMode('custom')}>
                            Custom price
                        </button>
                    </div>
                    {priceMode === 'market' ? (
                        <div className='rounded-lg bg-muted px-3 py-2 font-mono text-[15px] font-bold'>
                            {fmtEUR(marketPrice)}{' '}
                            <span className='font-sans text-[11.5px] font-normal text-muted-foreground'>
                                / unit
                            </span>
                        </div>
                    ) : (
                        <Input
                            type='number'
                            min='0'
                            step='0.01'
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                        />
                    )}
                </div>

                <div className='flex items-center justify-between border-t border-dashed border-border pt-3 text-sm font-semibold'>
                    <span>Order total</span>
                    <span className='font-mono'>{fmtEUR(total)}</span>
                </div>

                <div className='flex gap-2.5 pt-1'>
                    <Button
                        className='flex-1'
                        disabled={!canBuy}
                        onClick={handleBuy}>
                        Buy
                    </Button>
                    <Button
                        variant='outline'
                        className='flex-1'
                        disabled={!canSell}
                        onClick={handleSell}>
                        Sell
                    </Button>
                </div>

                <p className='text-[11.5px] text-muted-foreground'>
                    {owned && `You own ${fmtNum(ownedShares, 0)} ${ticker}. `}
                    Cash available: {fmtEUR(cash)}.
                </p>

                {toast && (
                    <div className='flex items-center gap-1.5 rounded-lg bg-positive-soft px-2.5 py-2 text-xs font-semibold text-positive'>
                        <Check size={14} /> {toast}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
