import z from 'zod';

export const ReceiptSchema = z.object({
    retailer: z.string(),
    purchaseDate: z.string().date(),
    purchaseTime: z.string(),
    items: z.array(z.object({
        shortDescription: z.string(),
        price: z.string()
    })),
    total: z.string()
})

export type Receipt = z.infer<typeof ReceiptSchema>;