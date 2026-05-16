import { useAuthStore } from "../../../store/authStore";
import { useUserCart } from "../hooks/useUserCart";


const CartPage = () => {
    const { user } = useAuthStore();
    const { data: cart, isLoading, isError, error } = useUserCart(user?.id);

    if (isLoading) return <div>Ładowanie koszyka...</div>;
    if (isError) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 font-bold">Wystąpił błąd podczas pobierania koszyka</p>
                <p className="text-xs text-neutral-500 mt-2">{error instanceof Error ? error.message : "Nieznany błąd"}</p>
            </div>
        );
    }

    if (!cart) {
        return <div className="p-8 text-center text-neutral-400">Twój koszyk jest pusty.</div>;
    }

    console.log("Current cart:", cart);
    return (
        <>
            {user && <h1>{user.username}</h1>}
        </>
    )
}

export default CartPage