import { useQuery } from "@tanstack/react-query"
import type { Product } from "../types/productTypes"
import { getProducts } from "../api/getProducts"

export const useProducts = ()=>{
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: getProducts,
    })
}