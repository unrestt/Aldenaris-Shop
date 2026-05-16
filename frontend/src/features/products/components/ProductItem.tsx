import { Link } from "react-router-dom";
import type { Product } from "../types/productTypes";

type Props = {
    product: Product;
};

const ProductItem = ({ product }: Props) => {
    const imageSrc = product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : '');

    return (
        <div className="group flex flex-col gap-4 cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 border border-neutral-800/50">
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 uppercase text-xs tracking-widest font-bold">
                        Brak zdjęcia
                    </div>
                )}
                
                {/* Brand Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-black/80 text-white text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border border-white/10">
                        {product.brand}
                    </span>
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                    <Link to={`/product/${product.id}`} className="block text-center w-full py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors shadow-xl">
                        Zobacz Produkt
                    </Link>
                </div>
                
                {/* Gradient Overlay for better text readability if we had text over image, mostly for aesthetic here */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-wide group-hover:text-neutral-300 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-white font-black text-lg whitespace-nowrap tracking-wider">
                        {product.price} <span className="text-xs font-bold text-neutral-500 tracking-widest">PLN</span>
                    </p>
                </div>
                <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] font-semibold mt-1">
                    {product.category}
                </p>
            </div>
        </div>
    );
};

export default ProductItem;