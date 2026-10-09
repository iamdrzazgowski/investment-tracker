'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { fmtCurrency, fmtNum } from '@/lib/format';
import { buyAction, sellAction } from '@/actions/portfolio.actions';

export function BuySellPanel({
    ticker,
    marketPrice,
    currency,
    owned,
    ownedShares,
    cash,
    cashCurrency,
    fxRate,
}: {
    ticker: string;
    marketPrice: number;
    currency: string;
    owned: boolean;
    ownedShares: number;
    cash: number;
    cashCurrency: string;
    /** 1 unit of asset `currency` -> `cashCurrency`. Null when unavailable. */
    fxRate: number | null;
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

    const needsFx = currency !== cashCurrency;
    const rate = fxRate != null && fxRate > 0 ? fxRate : null;
    // Order total converted into cash currency for the affordability check.
    const totalInCash = needsFx ? (rate != null ? total * rate : null) : total;
    // Cash balance converted into asset currency for display.
    const cashInAsset =
        needsFx && rate != null && rate > 0 ? cash / rate : null;

    const canBuy =
        qtyNum > 0 &&
        price > 0 &&
        (totalInCash != null ? totalInCash <= cash + 0.005 : total <= cash + 0.005) &&
        !isPending;
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
                            {fmtCurrency(marketPrice, currency)}{' '}
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
                    <span className='font-mono text-right'>
                        {fmtCurrency(total, currency)}
                        {needsFx && totalInCash != null && (
                            <span className='block text-[11.5px] font-normal text-muted-foreground'>
                                ≈ {fmtCurrency(totalInCash, cashCurrency)}
                            </span>
                        )}
                    </span>
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
                    Cash available: {fmtCurrency(cash, cashCurrency)}
                    {needsFx &&
                        cashInAsset != null &&
                        ` (≈ ${fmtCurrency(cashInAsset, currency)})`}
                    {needsFx && rate != null && (
                        <span className='block'>
                            Rate: 1 {currency} ≈ {rate.toFixed(4)}{' '}
                            {cashCurrency}
                        </span>
                    )}
                    {needsFx &&
                        rate == null &&
                        ' (different currency — no FX conversion applied)'}
                    .
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
