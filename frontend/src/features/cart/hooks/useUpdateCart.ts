import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserCart } from "../api/updateUserCart";
import type { CartItem } from "../types/cartTypes";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";

export const useUpdateCart = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: ({ cartId, items }: { cartId: string; items: CartItem[] }) => 
            updateUserCart(cartId, items),
        onSuccess: () => {
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
            }
            toast.success("Koszyk został zaktualizowany!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Wystąpił błąd podczas aktualizacji koszyka.");
        }
    });
};