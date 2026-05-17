import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";
import { useUserCart } from "../../cart/hooks/useUserCart";
import { useUpdateCart } from "../../cart/hooks/useUpdateCart";

const ProductDetails = () => {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useProduct(id);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string | null>(null);

    const { user } = useAuthStore();
    const { data: cart } = useUserCart(user?.id);
    const { mutate: updateCart } = useUpdateCart();

    if (isLoading) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <p className="text-white text-sm font-bold uppercase tracking-widest animate-pulse">Ładowanie produktu...</p>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-white text-sm font-bold uppercase tracking-widest">Nie znaleziono produktu.</p>
                <Link to="/" className="text-neutral-400 text-xs hover:text-white uppercase tracking-widest underline underline-offset-4">Wróć do sklepu</Link>
            </div>
        );
    }

    // Default sizes fallback if none provided by API
    const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];

    // Prepare images array
    const allImages = product.images?.length > 0 ? product.images : (product.thumbnail ? [product.thumbnail] : []);
    const currentImage = mainImage || (allImages.length > 0 ? allImages[0] : null);

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        } else if (type === 'inc' && quantity < 10) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleAddProduct = () => {
        if (!user) {
            toast.error("Zaloguj się, aby dodać produkt do koszyka!");
            return;
        }
        if (!selectedSize) {
            toast.error("Wybierz rozmiar przed dodaniem do koszyka!");
            return;
        }
        if (!cart) {
            toast.error("Koszyk nie został jeszcze załadowany.");
            return;
        }

        const existingItem = cart.items.find(
            item => item.productId === product.id && item.size === selectedSize
        );

        let updatedItems;

        if (existingItem) {
            updatedItems = cart.items.map(item => {
                if (item.productId === product.id && item.size === selectedSize) {
                    return { ...item, quantity: item.quantity + quantity };
                }
                return item;
            });
        } else {
            updatedItems = [
                ...cart.items,
                { productId: product.id, size: selectedSize, quantity }
            ];
        }

        updateCart({ cartId: cart.id, items: updatedItems });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                {/* Left Column - Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="relative aspect-[4/5] w-full bg-neutral-900 border border-neutral-800/50 overflow-hidden group">
                        {currentImage ? (
                            <img
                                src={currentImage}
                                alt={product.name}
                                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600 uppercase text-xs tracking-widest font-bold">
                                Brak zdjęcia
                            </div>
                        )}
                        <div className="absolute top-4 left-4 z-10 lg:hidden">
                            <span className="px-3 py-1.5 bg-black/80 text-white text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border border-white/10">
                                {product.brand}
                            </span>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square bg-neutral-900 border overflow-hidden transition-colors ${currentImage === img ? 'border-white' : 'border-neutral-800/50 hover:border-neutral-600'}`}
                                >
                                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Product Info */}
                <div className="w-full lg:w-1/2 flex flex-col pt-4 lg:pt-12">
                    <div className="flex flex-col gap-2 mb-8">
                        <span className="text-neutral-500 text-xs uppercase tracking-[0.2em] font-semibold">
                            {product.category}
                        </span>
                        <h1 className="text-white font-bold text-3xl lg:text-5xl leading-tight uppercase tracking-wide">
                            {product.name}
                        </h1>
                        <p className="text-white font-black text-2xl lg:text-3xl tracking-wider mt-4">
                            {product.price} <span className="text-sm font-bold text-neutral-500 tracking-widest">PLN</span>
                        </p>
                    </div>

                    <div className="w-full h-px bg-neutral-800/50 mb-8"></div>

                    {/* Size Selector */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex justify-between items-center">
                            <span className="text-white text-xs font-bold uppercase tracking-widest">Wybierz rozmiar</span>
                            <button className="text-neutral-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors underline underline-offset-4">
                                Tabela rozmiarów
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-4 text-xs font-bold uppercase tracking-widest border transition-all ${selectedSize === size
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-white border-neutral-700 hover:border-white'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <div className="flex items-center border border-neutral-700 h-14 w-full sm:w-32 shrink-0">
                            <button
                                onClick={() => handleQuantityChange('dec')}
                                className="w-1/3 h-full flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
                            >
                                -
                            </button>
                            <span className="w-1/3 text-center text-white text-sm font-bold">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange('inc')}
                                className="w-1/3 h-full flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="flex-1 h-14 bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors shadow-xl"
                            onClick={handleAddProduct}
                        >
                            Dodaj do koszyka
                        </button>
                    </div>

                    {/* Product Description */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-neutral-800/50 pb-4">Opis produktu</span>
                        <div className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {product.description || "Nieskazitelny design spotyka się z najwyższą jakością materiałów. Ten produkt to esencja nowoczesnego streetwearu, zaprojektowany z myślą o wytrzymałości i bezkompromisowym stylu. Idealny wybór dla tych, którzy cenią sobie oryginalność."}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;