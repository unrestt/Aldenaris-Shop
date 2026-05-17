import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { UserCart } from "../types/cartTypes";
import type { Product } from "../../products/types/productTypes";
import { useUpdateCart } from "../hooks/useUpdateCart";

type Props = {
    cart: UserCart | null | undefined;
    products: Product[] | undefined;
};

const MiniCart = ({ cart, products }: Props) => {
    const { mutate: updateCart } = useUpdateCart();

    const cartItemsWithDetails = cart?.items.map(item => {
        const product = products?.find(p => p.id === item.productId);
        return { ...item, product };
    }).filter(item => item.product) || [];

    const subtotal = cartItemsWithDetails.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    const handleRemoveItem = (e: React.MouseEvent, id: string, size: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!cart) return;
        const updatedItems = cart.items.filter(
            item => !(item.productId === id && item.size === size)
        );
        updateCart({ cartId: cart.id, items: updatedItems });
    };

    return (
        <div className="w-80 sm:w-96 bg-neutral-950 border border-neutral-800 p-6 shadow-2xl rounded-none text-white font-sans select-none">
            {/* Header */}
            <div className="border-b border-neutral-800 pb-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    Twój Podgląd Koszyka
                </span>
            </div>

            {cartItemsWithDetails.length > 0 ? (
                <>
                    {/* Items List */}
                    <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-800">
                        {cartItemsWithDetails.map((item, idx) => (
                            <div 
                                key={`${item.productId}-${item.size}-${idx}`}
                                className="flex gap-4 items-center py-2 border-b border-neutral-900/50 last:border-b-0 group"
                            >
                                {/* Image */}
                                <div className="w-12 aspect-[4/5] bg-neutral-900 border border-neutral-850 shrink-0 overflow-hidden">
                                    <img 
                                        src={item.product!.thumbnail || (item.product!.images && item.product!.images[0])} 
                                        alt={item.product!.name} 
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest truncate">
                                        {item.product!.brand}
                                    </span>
                                    <h4 className="text-[11px] font-bold uppercase tracking-wide text-white truncate">
                                        {item.product!.name}
                                    </h4>
                                    <div className="flex gap-2 text-[9px] text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
                                        <span>ROZMIAR: {item.size}</span>
                                        <span className="text-neutral-600">•</span>
                                        <span>ILOŚĆ: {item.quantity}</span>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                                    <span className="text-xs font-black tracking-wider whitespace-nowrap">
                                        {item.product!.price * item.quantity} PLN
                                    </span>
                                    <button 
                                        onClick={(e) => handleRemoveItem(e, item.productId, item.size)}
                                        className="text-neutral-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={12} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Footer */}
                    <div className="border-t border-neutral-800 pt-4 mt-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                Wartość Razem
                            </span>
                            <span className="font-black text-sm tracking-wider">
                                {subtotal} PLN
                            </span>
                        </div>
                        <Link 
                            to="/cart" 
                            className="bg-white text-black hover:bg-neutral-200 transition-colors text-[10px] font-black uppercase tracking-[0.2em] py-3.5 text-center w-full block shadow-lg hover:shadow-white/5 active:scale-[0.99] duration-200"
                        >
                            Zobacz Koszyk
                        </Link>
                    </div>
                </>
            ) : (
                <div className="py-8 text-center">
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Twój koszyk jest pusty
                    </p>
                </div>
            )}
        </div>
    );
};

export default MiniCart;
