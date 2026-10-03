import { z } from 'zod';

export const addFundsSchema = z.object({
    balance: z
        .number({
            error: 'Amount must be a number',
        })
        .positive('Amount must be greater than 0')
        .finite('Amount must be a valid number')
        .refine(
            (value) => Number.isInteger(value * 100),
            'Amount can have at most 2 decimal places',
        ),
});

export type AddFundsInput = z.infer<typeof addFundsSchema>;

export const tradeSchema = z.object({
    ticker: z.string().trim().min(1, 'Ticker is required').max(20),
    quantity: z
        .number({ error: 'Quantity must be a number' })
        .positive('Quantity must be greater than 0')
        .finite('Quantity must be a valid number'),
    price: z
        .number({ error: 'Price must be a number' })
        .positive('Price must be greater than 0')
        .finite('Price must be a valid number'),
});

export type TradeInput = z.infer<typeof tradeSchema>;
