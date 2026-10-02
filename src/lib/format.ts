const eurFormatter = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
});

const currencyFormatters = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(currency: string): Intl.NumberFormat {
    let formatter = currencyFormatters.get(currency);
    if (!formatter) {
        formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 2,
        });
        currencyFormatters.set(currency, formatter);
    }
    return formatter;
}

const numberFormatters = new Map<number, Intl.NumberFormat>();

function getNumberFormatter(decimals: number): Intl.NumberFormat {
    let formatter = numberFormatters.get(decimals);
    if (!formatter) {
        formatter = new Intl.NumberFormat('en-IE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
        numberFormatters.set(decimals, formatter);
    }
    return formatter;
}

export const fmtEUR = (v: number) => eurFormatter.format(v);

export const fmtCurrency = (v: number, currency: string = 'USD') =>
    getCurrencyFormatter(currency).format(v);

export const fmtNum = (v: number, d = 2) => getNumberFormatter(d).format(v);

export const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

export const fmtSigned = (v: number) =>
    `${v >= 0 ? '+' : '-'}${fmtEUR(Math.abs(v))}`;

export const fmtSignedCurrency = (v: number, currency: string = 'USD') =>
    `${v >= 0 ? '+' : '-'}${fmtCurrency(Math.abs(v), currency)}`;
