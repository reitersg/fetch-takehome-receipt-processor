import { ReceiptItems } from '../types/Receipt.js'

// This method removes all alpha-numeric characters and returns the final length of the new retailer string
export const calculateRetailer = (retailer: string) => {
    const newRetailer = retailer.replace(/[^a-zA-Z0-9]/g, '')
    return newRetailer.length
}

export const calculateTotal = (total: string) => {
    // The cents are the only part that is important for the points calculation
    const cents = total.split('.')[1]
    let points = cents === '00' ? 50 : 0
    if (Number(cents) % 25 === 0) points += 25
    return points
}

export const calculateItems = (items: ReceiptItems) => {
    // The number of item pairs are grabbed and then calculated for points here
    const initialPoints = Math.floor(items.length / 2) * 5
    const finalPoints = items.reduce((points, currentItem) => {
        // Description is trimmed first before checking the length is a multiple of 3 and getting the price calculations
        const trimmedDescription = currentItem.shortDescription.trim()
        if (trimmedDescription.length % 3 === 0) {
            points += Math.ceil(Number(currentItem.price) * 0.2)
        }
        return points
    }, initialPoints)
    return finalPoints
}

export const calculateDatePoints = (date: string, time: string) => {
    let points = 0
    const purchaseDay = Number(date.split('-')[2])
    const purchaseHour = Number(time.split(':')[0])
    // Checking if the day is odd
    if (purchaseDay % 2 !== 0) {
        points += 6
    }
    // With military time, we just need to check if the hour is between 14 and 16 (2:00pm and 4:00pm respectively)
    if (purchaseHour >= 14 && purchaseHour < 16) {
        points += 10
    }

    return points
}
