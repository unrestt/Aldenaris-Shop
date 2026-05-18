import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../api/createOrder";
import { updateUserCart } from "../../cart/api/updateUserCart";
import type { CreateOrderInput, Order } from "../types/orderTypes";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";

interface CreateOrderParams {
    orderInput: CreateOrderInput;
    cartId: string;
}

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation<Order, Error, CreateOrderParams>({
        mutationFn: async ({ orderInput, cartId }) => {
            // 1. Utwórz zamówienie w bazie danych
            const createdOrder = await createOrder(orderInput);
            
            // 2. Wyczyść koszyk użytkownika
            if (cartId) {
                await updateUserCart(cartId, []);
            }
            
            return createdOrder;
        },
        onSuccess: () => {
            // Inwalidacja koszyka użytkownika, aby UI odświeżyło stan koszyka (pusty)
            if (user?.id) {
                queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
            }
            toast.success("Zamówienie zostało złożone pomyślnie!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Wystąpił błąd podczas składania zamówienia.");
        }
    });
};
