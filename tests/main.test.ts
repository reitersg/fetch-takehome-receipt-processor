import server, { receiptStorage } from '../src/app.js'
import { test, expect, vi } from 'vitest'
import { cornerMarketReceipt } from './fixtures/CornerMarketReceipt.js'
import { morningReceipt } from './fixtures/MorningReceipt.js'
import { simpleReceipt } from './fixtures/SimpleReceipt.js'
import { targetReceipt } from './fixtures/TargetReceipt.js'

const cases = [
    { receipt: cornerMarketReceipt, expectedPoints: 109 },
    { receipt: morningReceipt, expectedPoints: 15 },
    { receipt: simpleReceipt, expectedPoints: 31 },
    { receipt: targetReceipt, expectedPoints: 28 },
]

test.each(cases)(
    '/receipts/process and /receipts/{id}/points should store the receipt and calculate the points',
    async ({ receipt, expectedPoints }) => {
        const setSpy = vi.spyOn(receiptStorage, 'set')
        // first case
        const response = await server.inject({
            method: 'POST',
            url: '/receipts/process',
            body: receipt,
        })

        const responseBody = response.json()
        expect(setSpy).toHaveBeenCalled()
        expect(response.statusCode).toEqual(200)
        expect(response.json()).toEqual({
            id: expect.stringMatching(
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g
            ),
        })

        const pointsResponse = await server.inject({
            method: 'GET',
            url: `/receipts/${responseBody.id}/points`,
        })
        const pointsBody = pointsResponse.json()
        expect(pointsBody.points).toEqual(expectedPoints)
    }
)
