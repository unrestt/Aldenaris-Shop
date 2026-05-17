import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useUserCart } from "../hooks/useUserCart";
import { useProducts } from "../../products/hooks/useProducts";
import { useUpdateCart } from "../hooks/useUpdateCart";
import NavBar from "../../../layout/NavBar";
import Footer from "../../../layout/Footer";
import CartItem from "./CartItem";
import { ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";
import { 
    getCartItemsWithDetails, 
    calculateSubtotal, 
    calculateShipping, 
    removeItemFromCart, 
    updateItemQuantity 
} from "../utils/cartHelpers";

const CartPage = () => {
    const { user } = useAuthStore();
    const { data: cart, isLoading: isCartLoading, isError, error } = useUserCart(user?.id);
    const { data: products, isLoading: isProductsLoading } = useProducts();
    const { mutate: updateCart } = useUpdateCart();

    const isLoading = isCartLoading || isProductsLoading;

    if (!user) {
        return (
            <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black">
                <NavBar />
                <main className="max-w-7xl mx-auto px-4 py-32 text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-neutral-800 mb-6" />
                    <h1 className="text-3xl font-black uppercase tracking-widest mb-4 text-white">Logowanie Wymagane</h1>
                    <p className="text-neutral-500 text-sm uppercase tracking-widest mb-8">Zaloguj się, aby zobaczyć swój koszyk</p>
                    <Link to="/" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors inline-block">
                        Wróć do Sklepu
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-neutral-950 min-h-screen text-white font-sans flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-white uppercase tracking-[0.3em] animate-pulse">Ładowanie koszyka...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-neutral-950 min-h-screen text-white font-sans">
                <NavBar />
                <main className="max-w-7xl mx-auto px-4 py-32 text-center">
                    <p className="text-red-500 font-bold uppercase tracking-widest mb-2">Błąd Pobierania</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">{error instanceof Error ? error.message : "Nieznany błąd"}</p>
                </main>
                <Footer />
            </div>
        );
    }

    const cartItemsWithDetails = getCartItemsWithDetails(cart?.items, products);

    const subtotal = calculateSubtotal(cartItemsWithDetails);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    const handleUpdateQuantity = (id: string, size: string, delta: number) => {
        if (!cart) return;
        const updatedItems = updateItemQuantity(cart.items, id, size, delta);
        updateCart({ cartId: cart.id, items: updatedItems });
    };

    const handleRemoveItem = (id: string, size: string) => {
        if (!cart) return;
        const updatedItems = removeItemFromCart(cart.items, id, size);
        updateCart({ cartId: cart.id, items: updatedItems });
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black flex flex-col">
            <NavBar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="flex flex-col gap-12">
                    {/* Breadcrumbs / Back button */}
                    <Link to="/" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Kontynuuj zakupy</span>
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        {/* Items List */}
                        <div className="flex-1 w-full">
                            <div className="flex items-baseline justify-between border-b border-neutral-800 pb-8 mb-4">
                                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white">Twój Koszyk</h1>
                                <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
                                    {cartItemsWithDetails.length} {cartItemsWithDetails.length === 1 ? 'Produkt' : 'Produkty'}
                                </span>
                            </div>

                            {cartItemsWithDetails.length > 0 ? (
                                <div className="flex flex-col">
                                    {cartItemsWithDetails.map((item, idx) => (
                                        <CartItem 
                                            key={`${item.productId}-${item.size}-${idx}`}
                                            product={item.product!}
                                            quantity={item.quantity}
                                            size={item.size}
                                            onUpdateQuantity={handleUpdateQuantity}
                                            onRemove={handleRemoveItem}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center border-b border-neutral-800/50">
                                    <p className="text-neutral-600 uppercase tracking-[0.2em] text-xs font-bold">
                                        Koszyk jest pusty
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Summary Card */}
                        <aside className="w-full lg:w-[400px] bg-neutral-900/50 border border-neutral-800 p-8 sm:p-10 sticky top-28">
                            <h2 className="text-white font-black text-xl uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">
                                Podsumowanie
                            </h2>
                            
                            <div className="flex flex-col gap-6 mb-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500 uppercase tracking-widest font-bold text-[10px]">Wartość produktów</span>
                                    <span className="text-white font-black tracking-wider">{subtotal} PLN</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500 uppercase tracking-widest font-bold text-[10px]">Dostawa</span>
                                    <span className="text-white font-black tracking-wider">{shipping} PLN</span>
                                </div>
                                <div className="h-px bg-neutral-800 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white uppercase tracking-widest font-black text-xs">Suma całkowita</span>
                                    <span className="text-white font-black text-2xl tracking-tighter">{total} PLN</span>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-white/5 active:scale-[0.98]">
                                <CreditCard size={16} />
                                Przejdź do płatności
                            </button>

                            <div className="mt-8 flex flex-col gap-4">
                                <p className="text-neutral-600 text-[9px] uppercase tracking-widest leading-relaxed text-center">
                                    Darmowa dostawa od 1000 PLN. <br />
                                    Zwrot do 30 dni bez podania przyczyny.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CartPage;