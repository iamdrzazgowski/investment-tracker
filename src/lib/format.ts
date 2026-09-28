export const fmtEUR = (v: number) =>
    new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
    }).format(v);

export const fmtCurrency = (v: number, currency: string = 'USD') =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(v);

export const fmtNum = (v: number, d = 2) =>
    new Intl.NumberFormat('en-IE', {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
    }).format(v);

export const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

export const fmtSigned = (v: number) =>
    `${v >= 0 ? '+' : '-'}${fmtEUR(Math.abs(v))}`;

export const fmtSignedCurrency = (v: number, currency: string = 'USD') =>
    `${v >= 0 ? '+' : '-'}${fmtCurrency(Math.abs(v), currency)}`;
