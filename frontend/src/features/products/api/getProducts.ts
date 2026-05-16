import { api } from "../../../api/axiosInstance";
import type { Product } from "../types/productTypes";

export const getProducts = async () : Promise<Product[]> => {
    const {data} = await api.get<Product[]>('/products');
    return data;
}