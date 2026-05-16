import { Trash2, Plus, Minus } from 'lucide-react';
import type { Product } from '../../products/types/productTypes';

type Props = {
    product: Product;
    quantity: number;
    size: string;
    onUpdateQuantity: (id: string, size: string, delta: number) => void;
    onRemove: (id: string, size: string) => void;
};

const CartItem = ({ product, quantity, size, onUpdateQuantity, onRemove }: Props) => {
    return (
        <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 py-8 border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors px-2">
            {/* Image Container */}
            <div className="relative w-32 aspect-[4/5] bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                <img 
                    src={product.thumbnail || (product.images && product.images[0])} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-4 w-full">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                            {product.brand}
                        </span>
                        <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[9px] font-black uppercase tracking-widest border border-neutral-700">
                                Rozmiar: {size}
                            </span>
                        </div>
                    </div>
                    <p className="text-white font-black text-lg tracking-wider whitespace-nowrap">
                        {product.price * quantity} <span className="text-[10px] font-bold text-neutral-500">PLN</span>
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-neutral-800 h-10 bg-neutral-950">
                        <button 
                            onClick={() => onUpdateQuantity(product.id, size, -1)}
                            disabled={quantity <= 1}
                            className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-white text-xs font-bold font-mono">{quantity}</span>
                        <button 
                            onClick={() => onUpdateQuantity(product.id, size, 1)}
                            className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Remove Button */}
                    <button 
                        onClick={() => onRemove(product.id, size)}
                        className="flex items-center gap-2 text-neutral-600 hover:text-red-400 transition-all group/remove"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover/remove:opacity-100 transition-opacity">Usuń</span>
                        <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
