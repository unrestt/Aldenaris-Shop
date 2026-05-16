import { api } from "../../../api/axiosInstance";
import type { UserCart } from "../types/cartTypes"; // Typ, który stworzyliśmy wcześniej

export const getUserCart = async (userId: string): Promise<UserCart | null> => {
  try {
    const { data } = await api.get<UserCart[]>(`/carts`, {
      params: { userId }
    });
    
    if (!data || data.length === 0) {
      return null;
    }
    
    return data[0]; 
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};