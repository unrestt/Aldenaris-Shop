import { api } from "../../../api/axiosInstance";
import type { Product } from "../types/productTypes";

export const getProduct = async (id: string | undefined) : Promise<Product> => {
    const {data} = await api.get<Product>(`/products/${id}`);
    return data;
}