import z from 'zod'

const ReceiptItemsSchema = z.array(
    z.object({
        shortDescription: z.string(),
        price: z.string(),
    })
)

export const ReceiptSchema = z.object({
    retailer: z.string({
        description: 'The name of the retailer or store the receipt is from.',
    }),
    purchaseDate: z.string().date(),
    purchaseTime: z.string(),
    items: ReceiptItemsSchema,
    total: z.string(),
})

export type ReceiptItems = z.infer<typeof ReceiptItemsSchema>
export type Receipt = z.infer<typeof ReceiptSchema>
