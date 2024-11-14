import { ReceiptItems } from "../types/Receipt";

export const calculateRetailer = (retailer: string) => {
    const regex = new RegExp("[^a-zA-Z0-9 -]");
    const newRetailer = retailer.replace(/[^a-zA-Z0-9]/g, '')
    return newRetailer.length;
}

export const calculateTotal = (total: string) => {
    const cents = total.split('.')[1];
    let points = cents === '00' ? 50 : 0;
    if (Number(cents) % 25 === 0) points += 25;
    return points;
}

export const calculateItems = (items: ReceiptItems) => {
    let initialPoints = Math.floor(items.length / 2) * 5;
    console.log(initialPoints)
    const finalPoints = items.reduce((points, currentItem) => {
        const trimmedDescription = currentItem.shortDescription.trim();
        if (trimmedDescription.length % 3 === 0) {
            points += Math.ceil(Number(currentItem.price) * 0.2)
        }
        return points;
    }, initialPoints)
    return finalPoints;
}

export const calculateDatePoints = (date: string, time: string) => {
    let points = 0;
    const purchaseDay = Number(date.split('-')[2]);
    const purchaseHour = Number(time.split(':')[0]);
    if (purchaseDay % 2 !== 0) {
        points += 6;
    }
    if (purchaseHour >= 14 && purchaseHour < 16) {
        points += 10;
    }

    return points;
}