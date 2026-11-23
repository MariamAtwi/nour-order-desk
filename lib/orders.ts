import type { Order } from "@/types/order";

declare global {
  var globalOrdersStore: Order[] | undefined;
}

const initialOrders: Order[] = [
    {
        id: "1",
        customerName: "Mariam Atwy",
        phone: "123-456-7890",
        productName: "Mini Gift Candle",
        quantity: 2,
        unitPrice: 6.00,
        total: 12.00,
        status: "Pending"
    }, 
];

export const orders = globalThis.globalOrdersStore ?? initialOrders;

if (!globalThis.globalOrdersStore) {
  globalThis.globalOrdersStore = orders;
}