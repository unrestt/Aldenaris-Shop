import { api } from "../../../api/axiosInstance";
import type { Order, CreateOrderInput } from "../types/orderTypes";

export const createOrder = async (orderInput: CreateOrderInput): Promise<Order> => {
    try {
        const orderData = {
            ...orderInput,
            date: new Date().toISOString(),
            status: "Opłacone" // Ponieważ to symulacja płatności, od razu oznaczamy jako opłacone
        };
        const { data } = await api.post<Order>("/orders", orderData);
        return data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};
