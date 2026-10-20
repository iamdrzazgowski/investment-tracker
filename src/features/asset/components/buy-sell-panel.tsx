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

const labelClass =
    'font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground';
const inputClass =
    'h-10 px-3 font-mono text-base tabular-nums shadow-none focus-visible:border-foreground focus-visible:ring-0 md:text-sm';

export function BuySellPanel({
    ticker,
    marketPrice,
    currency,
    owned,
    ownedShares,
    cash,
    cashCurrency,
    fxRate,
    fractional = false,
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
    /** Crypto can be traded in fractions (0.0042 BTC). */
    fractional?: boolean;
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
            <CardContent className='space-y-6'>
                <div className='space-y-2.5'>
                    <Label htmlFor='qty' className={labelClass}>
                        Quantity
                    </Label>
                    <Input
                        id='qty'
                        type='number'
                        min='0'
                        step={fractional ? 'any' : '1'}
                        placeholder='0'
                        className={inputClass}
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                    />
                </div>

                <div className='space-y-2.5'>
                    <Label htmlFor='price' className={labelClass}>
                        Price
                    </Label>
                    <div
                        role='group'
                        aria-label='Price mode'
                        className='flex w-full gap-1 rounded-lg border border-border p-1'>
                        <button
                            type='button'
                            aria-pressed={priceMode === 'market'}
                            className={cn(
                                'flex-1 rounded-md px-2 py-2 text-[12px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground',
                                priceMode === 'market' &&
                                    'bg-primary text-primary-foreground hover:text-primary-foreground',
                            )}
                            onClick={() => setPriceMode('market')}>
                            Market price
                        </button>
                        <button
                            type='button'
                            aria-pressed={priceMode === 'custom'}
                            className={cn(
                                'flex-1 rounded-md px-2 py-2 text-[12px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground',
                                priceMode === 'custom' &&
                                    'bg-primary text-primary-foreground hover:text-primary-foreground',
                            )}
                            onClick={() => setPriceMode('custom')}>
                            Custom price
                        </button>
                    </div>
                    {priceMode === 'market' ? (
                        <div
                            id='price'
                            className='flex h-10 items-center rounded-lg bg-muted px-3 font-mono text-[15px] font-medium tabular-nums'>
                            {fmtCurrency(marketPrice, currency)}{' '}
                            <span className='font-sans text-[11.5px] font-normal text-muted-foreground'>
                                / unit
                            </span>
                        </div>
                    ) : (
                        <Input
                            id='price'
                            type='number'
                            min='0'
                            step='0.01'
                            className={inputClass}
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                        />
                    )}
                </div>

                <div className='flex items-center justify-between gap-4 border-t border-border pt-6 text-sm font-semibold'>
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

                <div className='flex gap-3'>
                    <Button
                        className='h-10 flex-1'
                        disabled={!canBuy}
                        onClick={handleBuy}>
                        Buy
                    </Button>
                    <Button
                        variant='outline'
                        className='h-10 flex-1'
                        disabled={!canSell}
                        onClick={handleSell}>
                        Sell
                    </Button>
                </div>

                <p className='text-[12px] leading-relaxed text-muted-foreground'>
                    {owned &&
                                            `You own ${fmtNum(ownedShares, fractional ? 6 : 0)} ${ticker}. `}
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
