import server, { receiptStorage } from '../src/app.js'
import { test, expect, vi } from 'vitest'
import { cornerMarketReceipt } from './fixtures/CornerMarketReceipt.js'
import { morningReceipt } from './fixtures/MorningReceipt.js'
import { simpleReceipt } from './fixtures/SimpleReceipt.js'
import { targetReceipt } from './fixtures/TargetReceipt.js'
import { customReceipt } from './fixtures/CustomCase.js'

const cases = [
    { receipt: cornerMarketReceipt, expectedPoints: 109 },
    { receipt: morningReceipt, expectedPoints: 15 },
    { receipt: simpleReceipt, expectedPoints: 31 },
    { receipt: targetReceipt, expectedPoints: 28 },
    { receipt: customReceipt, expectedPoints: 65 }
]

test.each(cases)(
    '/receipts/process and /receipts/{id}/points should store the receipt and calculate the points',
    async ({ receipt, expectedPoints }) => {
        const setSpy = vi.spyOn(receiptStorage, 'set')
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

test('should throw a 400 error if the request body for /receipts/process is invalid', async () => {
    const response = await server.inject({
        method: 'POST',
        url: '/receipts/process',
        body: {},
    })

    expect(response.statusCode).toEqual(400);
})

test('should throw a 404 error if the receipt id is not found when calling /receipts/{id}/points', async () => {
    const response = await server.inject({
        method: 'GET',
        url: '/receipts/15bc8b59-5806-4e91-b7ba-d3e510f93f54/points',
    })

    expect(response.statusCode).toEqual(404)
})