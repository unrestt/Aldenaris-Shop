import { api } from "../../../api/axiosInstance";
import type { CartItem, UserCart } from "../types/cartTypes";

export const updateUserCart = async (cartId: string, items: CartItem[]): Promise<UserCart> => {
    try {
        const { data } = await api.patch<UserCart>(`/carts/${cartId}`, { items });
        return data;
    } catch (error) {
        console.error("Error updating cart:", error);
        throw error;
    }
};