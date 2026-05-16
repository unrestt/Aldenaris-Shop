import { useQuery } from "@tanstack/react-query"
import { getUserCart } from "../api/getUserCart"

export const useUserCart = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["cart", userId],
        queryFn: ()=> getUserCart(userId!),
        enabled: !!userId,
    })
}