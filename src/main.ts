import fastify from "fastify";
import { Receipt, ReceiptSchema } from "./types/Receipt";
import { v4 } from 'uuid';
import { serializerCompiler, validatorCompiler, ZodTypeProvider  } from "fastify-type-provider-zod";
import { z } from "zod";
import { calculateDatePoints, calculateItems, calculateRetailer, calculateTotal } from "./utils/receiptProcessingMethods";
const server = fastify();

// Add schema validator and serializer
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

const receiptStorage = new Map<string, Receipt>()

// Zod Schema with the Type Provider provides type-safe request body
server.get('/', {}, (_req, res) => {
    res.send('ok')
});

server.withTypeProvider<ZodTypeProvider>().post('/receipts/process', {
    schema: { body: ReceiptSchema }
}, (req, res) => {
    const receiptId = v4();
    receiptStorage.set(receiptId, req.body);
    res.send({
        id: receiptId
    })
})

server.withTypeProvider<ZodTypeProvider>().get('/receipts/:id/points', { 
    schema: {
        params: z.object({
            id: z.string().uuid()
        })
    }
}, (req, res) => {
    const receipt = receiptStorage.get(req.params.id);
    console.log(receipt);
    const retailerPoints = calculateRetailer(receipt!.retailer);
    console.log(retailerPoints);
    const totalPricePoints = calculateTotal(receipt!.total);
    console.log(totalPricePoints);
    const totalItemPoints = calculateItems(receipt!.items);
    console.log(totalItemPoints);
    const totalDateTimePoints = calculateDatePoints(receipt!.purchaseDate, receipt!.purchaseTime)
    console.log(totalDateTimePoints);
    res.send(retailerPoints + totalPricePoints + totalItemPoints + totalDateTimePoints);
})

async function run() {
    await server.ready();
  
    await server.listen({
      port: 3000,
    });
  
    console.log(`Documentation running at http://localhost:3000/documentation`);
}
  
run();