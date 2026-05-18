import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import toast from 'react-hot-toast';
import ProductItem from './ProductItem';
import logoWhite from '../../../assets/aldenaris_logo_white.png';

const ProductList = () => {
    const { data: products, isLoading, isError, error } = useProducts();
    
    useEffect(() => {
        if (isError) {
            toast.error(error?.message || 'Błąd pobierania produktów');
        }
    }, [isError, error]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] bg-neutral-950">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-white uppercase tracking-[0.3em] animate-pulse">
                        ALDENARIS Loading
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full bg-neutral-950 min-h-screen py-16 px-4 sm:px-8 lg:px-12 font-sans selection:bg-white selection:text-black">
            <div className="max-w-[1600px] mx-auto">
                
                {/* Header section */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-800 pb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                            New Arrivals
                        </h1>
                        <p className="text-neutral-400 max-w-lg uppercase tracking-[0.2em] text-xs font-semibold mt-2">
                            Raw aesthetics. Uncompromising quality. The power of <span className="text-white">ALDENARIS</span>.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 opacity-20 select-none">
                        <img src={logoWhite} alt="Aldenaris Logo" className="h-10 w-auto object-contain" />
                        <h2 className="text-white text-4xl font-black uppercase tracking-[0.3em]">
                            ALDENARIS
                        </h2>
                    </div>
                </div>

                {/* Product Grid */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product) => (
                            <ProductItem key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-neutral-500 uppercase tracking-widest text-sm font-bold">
                            Brak produktów do wyświetlenia.
                        </p>
                    </div>
                )}
                
            </div>
        </section>
    );
};

export default ProductList;