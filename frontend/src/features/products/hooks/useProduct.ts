import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Product } from "../types/productTypes";
import { getProduct } from "../api/getProduct";

export const useProduct = (id: string | undefined) =>{
    const queryClient = useQueryClient();

    return useQuery<Product>({
        queryKey: ['product', id],
        queryFn: ()=> getProduct(id!),
        enabled: !!id,
        initialData: ()=>{
            const cachedProducts = queryClient.getQueryData<Product[]>(['products']);

            return cachedProducts?.find(p => String(p.id) === String(id))
        }
    })
}