import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axiosInstance";
import type { Order } from "../types/orderTypes";
import NavBar from "../../../layout/NavBar";
import Footer from "../../../layout/Footer";
import { 
    Check, 
    ShoppingBag, 
    Truck, 
    Calendar, 
    MapPin, 
    CreditCard, 
    User,
    Loader2,
    ShieldCheck
} from "lucide-react";

const OrderSuccessPage = () => {
    const { orderId } = useParams<{ orderId: string }>();

    // Fetch the order from database
    const { data: order, isLoading, isError } = useQuery<Order>({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const { data } = await api.get<Order>(`/orders/${orderId}`);
            return data;
        },
        enabled: !!orderId,
        staleTime: 0 // Do not cache, fetch fresh
    });

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-neutral-950 min-h-screen text-white font-sans flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="h-16 w-16 text-white animate-spin" />
                    <p className="text-sm font-bold text-white uppercase tracking-[0.3em] animate-pulse">Pobieranie szczegółów zamówienia...</p>
                </div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="bg-neutral-950 min-h-screen text-white font-sans">
                <NavBar />
                <main className="max-w-7xl mx-auto px-4 py-32 text-center">
                    <p className="text-red-500 font-bold uppercase tracking-widest mb-2">Wystąpił błąd</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-8">Nie udało się odnaleźć zamówienia o ID: {orderId}</p>
                    <Link to="/" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors inline-block">
                        Wróć do sklepu
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    // Format ISO date to human readable Polish format
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
            {/* Pure CSS background visual enhancements */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

            <NavBar />

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-24 sm:py-32 z-10 flex flex-col items-center">
                
                {/* Glowing checkmark animation */}
                <div className="relative mb-10 mt-6 group">
                    <div className="absolute -inset-1 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition duration-1000 group-hover:duration-200 animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                        <Check size={40} className="stroke-[3px] animate-in zoom-in duration-300" />
                    </div>
                </div>

                <div className="text-center flex flex-col gap-4 mb-16">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em]">Płatność zatwierdzona</span>
                    <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Dziękujemy za zamówienie!</h1>
                    <p className="text-neutral-500 text-xs uppercase tracking-wider max-w-md mx-auto leading-relaxed">
                        Twój zakup został pomyślnie opłacony. Szczegóły transakcji oraz potwierdzenie wysłaliśmy na Twój adres e-mail.
                    </p>
                </div>

                {/* STREETWEAR STYLE RECEIPT */}
                <div className="w-full bg-neutral-900/10 border border-neutral-900 p-8 sm:p-12 flex flex-col gap-8 relative">
                    {/* Dotted top edge simulation */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-[linear-gradient(to_right,transparent_50%,#0a0a0a_50%)] bg-[size:10px_100%]" />

                    {/* Receipt title */}
                    <div className="flex justify-between items-baseline border-b border-neutral-900 pb-6">
                        <span className="font-black text-xl uppercase tracking-widest text-white">POTWIERDZENIE</span>
                        <span className="text-[9px] font-mono text-neutral-500">ID: {order.id}</span>
                    </div>

                    {/* Meta info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-neutral-900 pb-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-neutral-500 uppercase tracking-widest font-bold text-[9px]">
                                <Calendar size={12} /> Data zamówienia
                            </div>
                            <span className="text-white font-bold">{formatDate(order.date)}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-neutral-500 uppercase tracking-widest font-bold text-[9px]">
                                <CreditCard size={12} /> Metoda płatności
                            </div>
                            <span className="text-white font-bold uppercase tracking-wider">{order.paymentMethod}</span>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8 text-xs">
                        <h3 className="text-neutral-500 uppercase tracking-widest font-bold text-[9px] flex items-center gap-2">
                            <MapPin size={12} /> Adres dostawy (Kurier DHL)
                        </h3>
                        <div className="flex flex-col gap-2">
                            <span className="text-white font-bold uppercase flex items-center gap-1.5"><User size={12} className="text-neutral-600" /> {order.shippingDetails.fullName}</span>
                            <span className="text-neutral-400 font-medium">{order.shippingDetails.street}</span>
                            <span className="text-neutral-400 font-medium">{order.shippingDetails.postalCode} {order.shippingDetails.city}</span>
                            <span className="text-neutral-500 font-medium">Tel: {order.shippingDetails.phone}</span>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="flex flex-col gap-6 border-b border-neutral-900 pb-8">
                        <h3 className="text-neutral-500 uppercase tracking-widest font-bold text-[9px] flex items-center gap-2">
                            <ShoppingBag size={12} /> Zamówione produkty
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                            {order.items.map((item, idx) => (
                                <div key={`${item.productId}-${item.size}-${idx}`} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-12 bg-neutral-900 border border-neutral-850 overflow-hidden shrink-0 flex items-center justify-center">
                                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-white font-bold uppercase tracking-wide truncate max-w-[200px] sm:max-w-[350px]">
                                                {item.name}
                                            </span>
                                            <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-wider">
                                                Rozmiar: {item.size} • Ilość: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-white font-black font-mono tracking-tighter text-sm shrink-0">
                                        {item.price * item.quantity} PLN
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total cost break down */}
                    <div className="flex flex-col gap-4 text-xs font-medium">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 uppercase tracking-widest font-bold text-[9px]">Suma częściowa</span>
                            <span className="text-white font-bold font-mono">{order.total - order.shipping} PLN</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 uppercase tracking-widest font-bold text-[9px]">Koszt wysyłki</span>
                            <span className="text-white font-bold font-mono">{order.shipping} PLN</span>
                        </div>
                        <div className="h-px bg-neutral-900 my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-white font-black uppercase tracking-widest text-[10px]">Łącznie zapłacono</span>
                            <span className="text-white font-black text-2xl tracking-tighter font-mono">{order.total} PLN</span>
                        </div>
                    </div>

                    {/* Delivery Notification Banner */}
                    <div className="mt-4 bg-neutral-950 border border-neutral-900 px-6 py-4 flex items-start gap-4">
                        <Truck className="text-white shrink-0 mt-0.5" size={18} />
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase text-white tracking-widest">Szybka Wysyłka w 24h</span>
                            <p className="text-[8px] font-medium text-neutral-500 uppercase tracking-wider leading-relaxed">
                                Paczka zostanie wysłana kurierem DHL w ciągu najbliższych 24 godzin. <br /> Numer śledzenia otrzymasz w kolejnej wiadomości.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to Shopping Button */}
                <div className="mt-12 flex flex-col items-center gap-4 w-full">
                    <Link 
                        to="/" 
                        className="w-full sm:w-auto px-16 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors text-center shadow-xl active:scale-[0.98]"
                    >
                        Kontynuuj zakupy
                    </Link>
                    <div className="flex items-center gap-1.5 text-[8px] text-neutral-600 font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} className="text-neutral-700" /> Bezpieczne zakupy Aldenaris
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default OrderSuccessPage;
