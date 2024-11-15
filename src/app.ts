import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { Receipt, ReceiptSchema } from './types/Receipt.js'
import { v4 } from 'uuid'
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
    calculateDatePoints,
    calculateItems,
    calculateRetailer,
    calculateTotal,
} from './utils/receiptProcessingMethods.js'
const server = fastify()

// Add schema validator and serializer
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Receipt Processor',
            description: 'A simple receipt processor for fetch',
            version: '1.0.0',
        },
        servers: [],
    },
    transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
})

export const receiptStorage = new Map<string, Receipt>()

server.after(() => {
    // Zod Schema Type Provider provides type-safe request body
    server.withTypeProvider<ZodTypeProvider>().post(
        '/receipts/process',
        {
            schema: {
                body: ReceiptSchema,
                response: { 200: z.object({ id: z.string().uuid() }) },
            },
        },
        (req) => {
            const receiptId = v4()
            receiptStorage.set(receiptId, req.body)
            return {
                id: receiptId
            }
        }
    )

    server.withTypeProvider<ZodTypeProvider>().get(
        '/receipts/:id/points',
        {
            schema: {
                params: z.object({
                    id: z.string().uuid().describe("The unique identifier of the receipt"),
                }),
                response: {
                    200: z.object({
                        points: z.number(),
                    }),
                    404: z.string(),
                },
            },
        },
        (req, res) => {
            const receipt = receiptStorage.get(req.params.id)
            if (!receipt) {
                return res.callNotFound();
            }
            const retailerPoints = calculateRetailer(receipt.retailer)
            const totalPricePoints = calculateTotal(receipt.total)
            const totalItemPoints = calculateItems(receipt.items)
            const totalDateTimePoints = calculateDatePoints(
                receipt.purchaseDate,
                receipt.purchaseTime
            )
            return {
                points:
                    retailerPoints +
                    totalPricePoints +
                    totalItemPoints +
                    totalDateTimePoints,
            }
        }
    )
})

export default server
