import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useUserCart } from "../../cart/hooks/useUserCart";
import { useProducts } from "../../products/hooks/useProducts";
import { useCreateOrder } from "../hooks/useCreateOrder";
import NavBar from "../../../layout/NavBar";
import Footer from "../../../layout/Footer";
import { 
    getCartItemsWithDetails, 
    calculateSubtotal, 
    calculateShipping 
} from "../../cart/utils/cartHelpers";
import { 
    ArrowLeft, 
    CreditCard, 
    Smartphone, 
    Building2, 
    Lock, 
    ShieldCheck, 
    Loader2, 
    Check, 
    User,
    Mail,
    Phone,
    MapPin,
    AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

type PaymentMethod = "BLIK" | "CARD" | "TRANSFER";

interface ShippingForm {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
}

const CheckoutPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    
    const { data: cart, isLoading: isCartLoading } = useUserCart(user?.id);
    const { data: products, isLoading: isProductsLoading } = useProducts();
    const { mutateAsync: createOrder, isPending: isOrderCreating } = useCreateOrder();

    // Form states
    const [form, setForm] = useState<ShippingForm>({
        fullName: "",
        email: user?.email || "",
        phone: "",
        street: "",
        postalCode: "",
        city: ""
    });
    
    const [formErrors, setFormErrors] = useState<Partial<ShippingForm>>({});
    
    // Payment method selection
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BLIK");
    
    // BLIK specific state
    const [blikCode, setBlikCode] = useState("");
    const [blikError, setBlikError] = useState("");
    
    // Card specific state
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvc: "",
        name: ""
    });
    const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
    
    // Bank Transfer specific state
    const [selectedBank, setSelectedBank] = useState<string>("");
    
    // Simulation states
    const [simulationState, setSimulationState] = useState<"IDLE" | "PROCESSING_BLIK" | "PROCESSING_CARD" | "OPEN_TRANSFER_MODAL" | "PROCESSING_TRANSFER" | "SUCCESS">("IDLE");
    const [blikTimer, setBlikTimer] = useState(15);
    const [progressPercent, setProgressPercent] = useState(0);

    const isLoading = isCartLoading || isProductsLoading;

    // Check if user is authenticated, otherwise redirect
    useEffect(() => {
        if (!user && !isLoading) {
            toast.error("Logowanie wymagane!");
            navigate("/");
        }
    }, [user, navigate, isLoading]);

    // Cart items parsing
    const cartItemsWithDetails = getCartItemsWithDetails(cart?.items, products);
    const subtotal = calculateSubtotal(cartItemsWithDetails);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Prevent checking out if cart is empty
    useEffect(() => {
        if (!isLoading && cartItemsWithDetails.length === 0) {
            toast.error("Twój koszyk jest pusty.");
            navigate("/cart");
        }
    }, [cartItemsWithDetails, isLoading, navigate]);

    // BLIK Timer simulation
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (simulationState === "PROCESSING_BLIK") {
            interval = setInterval(() => {
                setBlikTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
                setProgressPercent((prev) => Math.min(prev + (100 / 3), 100));
            }, 1000);
        } else {
            setBlikTimer(15);
            setProgressPercent(0);
        }
        return () => clearInterval(interval);
    }, [simulationState]);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof ShippingForm]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "number") {
            // Remove non-digits and format with spaces every 4 digits
            const digits = value.replace(/\D/g, "").slice(0, 16);
            formattedValue = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        } else if (name === "expiry") {
            // Remove non-digits and format as MM/YY
            const digits = value.replace(/\D/g, "").slice(0, 4);
            if (digits.length >= 3) {
                formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            } else {
                formattedValue = digits;
            }
        } else if (name === "cvc") {
            formattedValue = value.replace(/\D/g, "").slice(0, 3);
        }

        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
        if (cardErrors[name]) {
            setCardErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<ShippingForm> = {};
        
        if (!form.fullName.trim()) errors.fullName = "Imię i nazwisko jest wymagane";
        else if (form.fullName.trim().split(" ").length < 2) errors.fullName = "Podaj pełne imię i nazwisko";
        
        if (!form.email.trim()) errors.email = "Adres e-mail jest wymagany";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Niepoprawny format e-mail";
        
        if (!form.phone.trim()) errors.phone = "Numer telefonu jest wymagany";
        else if (form.phone.trim().replace(/\D/g, "").length < 9) errors.phone = "Numer telefonu musi mieć min. 9 cyfr";
        
        if (!form.street.trim()) errors.street = "Ulica i numer są wymagane";
        
        if (!form.postalCode.trim()) errors.postalCode = "Kod pocztowy jest wymagany";
        else if (!/^\d{2}-\d{3}$/.test(form.postalCode.trim())) errors.postalCode = "Format kodu pocztowego to XX-XXX";
        
        if (!form.city.trim()) errors.city = "Miasto jest wymagane";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePayment = (): boolean => {
        if (paymentMethod === "BLIK") {
            const cleanBlik = blikCode.replace(/\D/g, "");
            if (cleanBlik.length !== 6) {
                setBlikError("Kod BLIK musi składać się z 6 cyfr");
                return false;
            }
            setBlikError("");
            return true;
        }

        if (paymentMethod === "CARD") {
            const errors: Record<string, string> = {};
            const cleanNumber = cardDetails.number.replace(/\D/g, "");
            
            if (cleanNumber.length !== 16) errors.number = "Numer karty musi mieć 16 cyfr";
            if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) errors.expiry = "Użyj formatu MM/YY";
            if (cardDetails.cvc.length !== 3) errors.cvc = "CVV musi mieć 3 cyfry";
            if (!cardDetails.name.trim()) errors.name = "Podaj właściciela karty";

            setCardErrors(errors);
            return Object.keys(errors).length === 0;
        }

        if (paymentMethod === "TRANSFER") {
            if (!selectedBank) {
                toast.error("Wybierz swój bank, aby dokonać przelewu!");
                return false;
            }
            return true;
        }

        return false;
    };

    const submitOrderToDB = async (finalPaymentMethod: string) => {
        if (!user || !cart) return;

        const orderInput = {
            userId: user.id,
            items: cartItemsWithDetails.map(item => ({
                productId: item.productId,
                name: item.product!.name,
                price: item.product!.price,
                quantity: item.quantity,
                size: item.size,
                thumbnail: item.product!.thumbnail
            })),
            total,
            shipping,
            shippingDetails: {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                street: form.street,
                postalCode: form.postalCode,
                city: form.city
            },
            paymentMethod: finalPaymentMethod
        };

        try {
            const order = await createOrder({ orderInput, cartId: cart.id });
            if (order && order.id) {
                setSimulationState("SUCCESS");
                setTimeout(() => {
                    navigate(`/order-success/${order.id}`);
                }, 1000);
            }
        } catch (err) {
            console.error("Order submission error:", err);
            setSimulationState("IDLE");
        }
    };

    const handleSubmitOrder = async (e: FormEvent) => {
        e.preventDefault();

        // 1. Validate delivery address
        const isFormValid = validateForm();
        if (!isFormValid) {
            toast.error("Wypełnij poprawnie dane dostawy!");
            // Scroll to top of shipping form
            window.scrollTo({ top: 100, behavior: 'smooth' });
            return;
        }

        // 2. Validate Payment Inputs
        const isPaymentValid = validatePayment();
        if (!isPaymentValid) {
            return;
        }

        // 3. Start Payment Simulation based on selected method
        if (paymentMethod === "BLIK") {
            setSimulationState("PROCESSING_BLIK");
            setProgressPercent(10);
            
            // Wait 3 seconds simulating bank approval
            setTimeout(async () => {
                setProgressPercent(100);
                await submitOrderToDB("BLIK");
            }, 3000);
        } else if (paymentMethod === "CARD") {
            setSimulationState("PROCESSING_CARD");
            
            // Wait 2.5 seconds simulating card authorization
            setTimeout(async () => {
                await submitOrderToDB(`Karta (ending in ${cardDetails.number.slice(-4)})`);
            }, 2500);
        } else if (paymentMethod === "TRANSFER") {
            setSimulationState("OPEN_TRANSFER_MODAL");
        }
    };

    // Confirm mock bank login/transfer
    const handleConfirmBankTransfer = async () => {
        setSimulationState("PROCESSING_TRANSFER");
        
        // Wait 2 seconds simulating transfer execution
        setTimeout(async () => {
            await submitOrderToDB(`Przelew (${selectedBank})`);
        }, 2000);
    };

    const polishBanks = [
        { id: "mbank", name: "mBank", color: "bg-red-700 hover:bg-red-800 border-red-500 text-white" },
        { id: "pkobp", name: "PKO BP", color: "bg-blue-900 hover:bg-blue-950 border-blue-700 text-white" },
        { id: "pekao", name: "Pekao SA", color: "bg-red-600 hover:bg-red-700 border-red-400 text-white" },
        { id: "santander", name: "Santander", color: "bg-red-700 hover:bg-red-800 border-red-500 text-white" },
        { id: "ing", name: "ING Bank", color: "bg-orange-600 hover:bg-orange-700 border-orange-400 text-white" },
        { id: "millennium", name: "Millennium", color: "bg-pink-700 hover:bg-pink-800 border-pink-500 text-white" },
        { id: "alior", name: "Alior Bank", color: "bg-amber-950 hover:bg-neutral-900 border-amber-800 text-white" },
        { id: "creditagricole", name: "Credit Agricole", color: "bg-emerald-700 hover:bg-emerald-800 border-emerald-500 text-white" }
    ];

    if (isLoading) {
        return (
            <div className="bg-neutral-950 min-h-screen text-white font-sans flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="h-16 w-16 text-white animate-spin" />
                    <p className="text-sm font-bold text-white uppercase tracking-[0.3em] animate-pulse">Przygotowywanie płatności...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
            <NavBar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 z-10">
                <div className="flex flex-col gap-12">
                    {/* Back to Cart */}
                    <Link to="/cart" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Wróć do koszyka</span>
                    </Link>

                    <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white border-b border-neutral-900 pb-6 mb-2">
                        Płatność i dostawa
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        
                        {/* LEFT COLUMN: Shipping details & Payment Choice */}
                        <form onSubmit={handleSubmitOrder} className="flex-1 w-full flex flex-col gap-12">
                            
                            {/* SECTION 1: Dane Dostawy */}
                            <section className="bg-neutral-900/20 border border-neutral-800 p-8 sm:p-10 flex flex-col gap-8">
                                <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                                    <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black">1</span>
                                    <h2 className="text-white font-black text-lg uppercase tracking-wider">Dane dostawy</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <User size={10} /> Imię i nazwisko
                                        </label>
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleFormChange}
                                            placeholder="np. Jan Kowalski"
                                            className={`bg-neutral-900/60 border ${formErrors.fullName ? 'border-red-500' : 'border-neutral-800 focus:border-white'} px-4 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700`}
                                        />
                                        {formErrors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 flex items-center gap-1"><AlertCircle size={10} /> {formErrors.fullName}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Mail size={10} /> Adres E-mail
                                        </label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={form.email}
                                            onChange={handleFormChange}
                                            placeholder="np. jan@gmail.com"
                                            className={`bg-neutral-900/60 border ${formErrors.email ? 'border-red-500' : 'border-neutral-800 focus:border-white'} px-4 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700`}
                                        />
                                        {formErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 flex items-center gap-1"><AlertCircle size={10} /> {formErrors.email}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Phone size={10} /> Numer telefonu
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleFormChange}
                                            placeholder="np. 500600700"
                                            className={`bg-neutral-900/60 border ${formErrors.phone ? 'border-red-500' : 'border-neutral-800 focus:border-white'} px-4 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700`}
                                        />
                                        {formErrors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 flex items-center gap-1"><AlertCircle size={10} /> {formErrors.phone}</p>}
                                    </div>

                                    {/* Street */}
                                    <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <MapPin size={10} /> Ulica i nr domu / lokalu
                                        </label>
                                        <input 
                                            type="text" 
                                            name="street"
                                            value={form.street}
                                            onChange={handleFormChange}
                                            placeholder="np. Marszałkowska 12a m. 4"
                                            className={`bg-neutral-900/60 border ${formErrors.street ? 'border-red-500' : 'border-neutral-800 focus:border-white'} px-4 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700`}
                                        />
                                        {formErrors.street && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 flex items-center gap-1"><AlertCircle size={10} /> {formErrors.street}</p>}
                                    </div>

                                    {/* Postal Code */}
                                    <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            Kod pocztowy
                                        </label>
                                        <input 
                                            type="text" 
                                            name="postalCode"
                                            value={form.postalCode}
                                            onChange={handleFormChange}
                                            placeholder="00-000"
                                            className={`bg-neutral-900/60 border ${formErrors.postalCode ? 'border-red-500' : 'border-neutral-800 focus:border-white'} px-4 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700`}
                                        />
                                        {formErrors.postalCode && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 flex items-center gap-1"><AlertCircle size={10} /> {formErrors.postalCode}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            Miasto
                                        </label>
                                        <input 
                                            type="text" 
                                            name="city"
                                            value={form.city}
                                            onChange={handleFormChange}
                                            placeholder="np. Warszawa"
                                            className={`bg-neutral-900/60 border ${formErrors.city ? 'border-red-500' : 'border-neutral-800 focus:border-white'} px-4 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700`}
                                        />
                                        {formErrors.city && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 flex items-center gap-1"><AlertCircle size={10} /> {formErrors.city}</p>}
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2: Wybór metody płatności */}
                            <section className="bg-neutral-900/20 border border-neutral-800 p-8 sm:p-10 flex flex-col gap-8">
                                <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                                    <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black">2</span>
                                    <h2 className="text-white font-black text-lg uppercase tracking-wider">Metoda płatności</h2>
                                </div>

                                {/* Tabs selector */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod("BLIK")}
                                        className={`py-4 px-2 border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === "BLIK" ? 'bg-white text-black border-white' : 'bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-500 hover:text-white'}`}
                                    >
                                        <Smartphone size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">BLIK</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod("CARD")}
                                        className={`py-4 px-2 border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === "CARD" ? 'bg-white text-black border-white' : 'bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-500 hover:text-white'}`}
                                    >
                                        <CreditCard size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Karta</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod("TRANSFER")}
                                        className={`py-4 px-2 border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === "TRANSFER" ? 'bg-white text-black border-white' : 'bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-500 hover:text-white'}`}
                                    >
                                        <Building2 size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Przelew</span>
                                    </button>
                                </div>

                                {/* Method details container */}
                                <div className="bg-neutral-900/40 border border-neutral-800/80 p-6 sm:p-8 min-h-[220px] flex items-center">
                                    
                                    {/* BLIK FORM */}
                                    {paymentMethod === "BLIK" && (
                                        <div className="w-full flex flex-col gap-6">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-white font-black text-xs uppercase tracking-widest">Płatność kodem BLIK</h3>
                                                <p className="text-neutral-500 text-[10px] uppercase tracking-wider leading-relaxed">
                                                    Wygeneruj 6-cyfrowy kod w swojej aplikacji bankowej i wpisz go poniżej.
                                                </p>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                <div className="flex flex-col gap-1 w-full sm:w-[240px]">
                                                    <input 
                                                        type="text" 
                                                        maxLength={6}
                                                        value={blikCode}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, "");
                                                            setBlikCode(val);
                                                            if (blikError) setBlikError("");
                                                        }}
                                                        placeholder="000 000"
                                                        className={`bg-neutral-950 border ${blikError ? 'border-red-500' : 'border-neutral-800 focus:border-white'} px-4 py-4 text-center text-xl font-black tracking-[0.4em] text-white focus:outline-none transition-all placeholder:text-neutral-800`}
                                                    />
                                                    {blikError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1">{blikError}</p>}
                                                </div>
                                                <div className="py-2 text-[10px] text-neutral-600 uppercase tracking-widest leading-relaxed flex items-center gap-2">
                                                    <Lock size={12} className="text-neutral-700 shrink-0" /> Secure BLIK SSL Gateway
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CARD FORM */}
                                    {paymentMethod === "CARD" && (
                                        <div className="w-full flex flex-col sm:flex-row gap-8 items-center">
                                            {/* Visual representation of Card (STREETWEAR aesthetic) */}
                                            <div className="w-full sm:w-[260px] h-[160px] rounded-xl border border-neutral-700 bg-gradient-to-tr from-neutral-950 to-neutral-800 p-6 flex flex-col justify-between shrink-0 shadow-2xl relative overflow-hidden select-none">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 rounded-full -mr-16 -mt-16 pointer-events-none" />
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">ALDENARIS MEMBER</span>
                                                    <div className="h-6 w-9 rounded bg-neutral-800/80 border border-neutral-700" />
                                                </div>
                                                <div className="text-sm font-bold tracking-[0.2em] text-white my-3">
                                                    {cardDetails.number || "•••• •••• •••• ••••"}
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[7px] uppercase tracking-widest text-neutral-500">CARDHOLDER</span>
                                                        <span className="text-[10px] font-black uppercase text-white truncate max-w-[140px]">
                                                            {cardDetails.name || "JAN KOWALSKI"}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 items-end">
                                                        <span className="text-[7px] uppercase tracking-widest text-neutral-500">EXPIRES</span>
                                                        <span className="text-[10px] font-black text-white">
                                                            {cardDetails.expiry || "MM/YY"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form Inputs */}
                                            <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                                {/* Card Owner */}
                                                <div className="flex flex-col gap-1 col-span-2">
                                                    <label className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">Właściciel karty</label>
                                                    <input 
                                                        type="text" 
                                                        name="name"
                                                        value={cardDetails.name}
                                                        onChange={handleCardChange}
                                                        placeholder="JAN KOWALSKI"
                                                        className={`bg-neutral-950 border ${cardErrors.name ? 'border-red-500' : 'border-neutral-850 focus:border-white'} px-3 py-2.5 text-xs text-white uppercase focus:outline-none transition-all placeholder:text-neutral-800`}
                                                    />
                                                </div>

                                                {/* Card Number */}
                                                <div className="flex flex-col gap-1 col-span-2">
                                                    <label className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">Numer karty</label>
                                                    <input 
                                                        type="text" 
                                                        name="number"
                                                        value={cardDetails.number}
                                                        onChange={handleCardChange}
                                                        placeholder="0000 0000 0000 0000"
                                                        className={`bg-neutral-950 border ${cardErrors.number ? 'border-red-500' : 'border-neutral-850 focus:border-white'} px-3 py-2.5 text-xs text-white focus:outline-none transition-all placeholder:text-neutral-800`}
                                                    />
                                                </div>

                                                {/* Expiry */}
                                                <div className="flex flex-col gap-1 col-span-1">
                                                    <label className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">Ważność</label>
                                                    <input 
                                                        type="text" 
                                                        name="expiry"
                                                        value={cardDetails.expiry}
                                                        onChange={handleCardChange}
                                                        placeholder="MM/YY"
                                                        className={`bg-neutral-950 border ${cardErrors.expiry ? 'border-red-500' : 'border-neutral-850 focus:border-white'} px-3 py-2.5 text-xs text-white focus:outline-none transition-all placeholder:text-neutral-800`}
                                                    />
                                                </div>

                                                {/* CVC */}
                                                <div className="flex flex-col gap-1 col-span-1">
                                                    <label className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">CVV / CVC</label>
                                                    <input 
                                                        type="password" 
                                                        name="cvc"
                                                        maxLength={3}
                                                        value={cardDetails.cvc}
                                                        onChange={handleCardChange}
                                                        placeholder="•••"
                                                        className={`bg-neutral-950 border ${cardErrors.cvc ? 'border-red-500' : 'border-neutral-850 focus:border-white'} px-3 py-2.5 text-xs text-white focus:outline-none transition-all placeholder:text-neutral-800`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* BANK TRANSFER GRID */}
                                    {paymentMethod === "TRANSFER" && (
                                        <div className="w-full flex flex-col gap-6">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-white font-black text-xs uppercase tracking-widest">Wybierz Szybki Przelew Online</h3>
                                                <p className="text-neutral-500 text-[10px] uppercase tracking-wider">
                                                    Kliknij logo swojego banku. Zostaniesz przekierowany do bezpiecznego panelu płatności.
                                                </p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {polishBanks.map((bank) => (
                                                    <button 
                                                        key={bank.id}
                                                        type="button"
                                                        onClick={() => setSelectedBank(bank.name)}
                                                        className={`py-3 px-2 text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                                            selectedBank === bank.name 
                                                            ? 'bg-white text-black border-white scale-[1.03] shadow-md shadow-white/5' 
                                                            : `bg-neutral-950 border-neutral-850 text-neutral-300 hover:border-neutral-600 hover:scale-[1.01]`
                                                        }`}
                                                    >
                                                        {selectedBank === bank.name && <Check size={10} />}
                                                        {bank.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Terms Checkbox & Final Pay Button */}
                            <div className="flex flex-col gap-6">
                                <label className="flex items-start gap-3 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        required 
                                        className="w-4.5 h-4.5 accent-white bg-neutral-900 border border-neutral-800 rounded mt-0.5 cursor-pointer"
                                    />
                                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider leading-relaxed">
                                        Akceptuję <Link to="/terms" className="underline hover:text-white transition-colors">regulamin</Link> sklepu Aldenaris oraz wyrażam zgodę na przetwarzanie danych osobowych.
                                    </span>
                                </label>

                                <button 
                                    type="submit"
                                    disabled={isOrderCreating || simulationState !== "IDLE"}
                                    className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.25em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-white/5 active:scale-[0.99] cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                                >
                                    {isOrderCreating || simulationState !== "IDLE" ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Autoryzacja Płatności...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={16} />
                                            Zamów i zapłać ({total} PLN)
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* RIGHT COLUMN: Order Summary Sidebar (STREETWEAR receipt style) */}
                        <aside className="w-full lg:w-[420px] bg-neutral-900/10 border border-neutral-900 p-8 sm:p-10 sticky top-28 flex flex-col gap-8">
                            <h2 className="text-white font-black text-xl uppercase tracking-widest border-b border-neutral-900 pb-4 flex justify-between items-baseline">
                                <span>Podsumowanie</span>
                                <span className="text-[10px] text-neutral-600 font-bold tracking-widest">{cartItemsWithDetails.length} POZ.</span>
                            </h2>

                            {/* Scrollable products list */}
                            <div className="flex flex-col gap-6 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItemsWithDetails.map((item, idx) => (
                                    <div 
                                        key={`${item.productId}-${item.size}-${idx}`} 
                                        className="flex items-center gap-4 pb-4 border-b border-neutral-900 last:border-b-0 last:pb-0"
                                    >
                                        <div className="w-16 h-20 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                                            <img 
                                                src={item.product!.thumbnail} 
                                                alt={item.product!.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <h4 className="text-white text-xs font-bold uppercase truncate tracking-wide">
                                                {item.product!.name}
                                            </h4>
                                            <div className="flex items-center gap-3 text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                                                <span>ROZ: {item.size}</span>
                                                <span>SZT: {item.quantity}</span>
                                            </div>
                                            <span className="text-white text-xs font-black font-mono tracking-tighter mt-1">
                                                {item.product!.price * item.quantity} PLN
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="flex flex-col gap-4 border-t border-neutral-900 pt-6">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-500 uppercase tracking-widest font-bold text-[9px]">Suma częściowa</span>
                                    <span className="text-white font-black font-mono">{subtotal} PLN</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-500 uppercase tracking-widest font-bold text-[9px]">Wysyłka (Kurier DHL)</span>
                                    <span className="text-white font-black font-mono">{shipping} PLN</span>
                                </div>
                                
                                <div className="h-px bg-neutral-900 my-2" />
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-white uppercase tracking-widest font-black text-xs">Do zapłaty</span>
                                    <span className="text-white font-black text-2xl tracking-tighter font-mono">{total} PLN</span>
                                </div>
                            </div>

                            {/* Secure Badge */}
                            <div className="bg-neutral-900/30 border border-neutral-900 px-4 py-3 flex items-center gap-3">
                                <Lock className="text-white shrink-0" size={16} />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[8px] font-black uppercase text-white tracking-widest">Szyfrowanie SSL 256-bit</span>
                                    <span className="text-[7px] font-bold text-neutral-500 uppercase tracking-wider">Twoje płatności są w pełni zabezpieczone.</span>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </main>

            <Footer />

            {/* ======================================================== */}
            {/* PAYMENT SIMULATOR MODALS & OVERLAYS */}
            {/* ======================================================== */}

            {/* 1. BLIK SIMULATION OVERLAY */}
            {simulationState === "PROCESSING_BLIK" && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-neutral-950 border-2 border-neutral-900 p-8 sm:p-12 max-w-md w-full flex flex-col items-center text-center gap-8 shadow-2xl relative overflow-hidden">
                        {/* Pulse effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/1 to-transparent animate-pulse pointer-events-none" />

                        {/* Spinner & Code view */}
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            {/* Outer ticking circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle 
                                    cx="56" 
                                    cy="56" 
                                    r="50" 
                                    className="stroke-neutral-900 stroke-4 fill-transparent"
                                />
                                <circle 
                                    cx="56" 
                                    cy="56" 
                                    r="50" 
                                    className="stroke-white stroke-4 fill-transparent transition-all duration-1000 ease-linear"
                                    strokeDasharray="314.16"
                                    strokeDashoffset={314.16 - (314.16 * progressPercent) / 100}
                                />
                            </svg>
                            <Smartphone className="absolute h-10 w-10 text-white animate-bounce" />
                        </div>

                        <div className="flex flex-col gap-3 z-10">
                            <h3 className="text-white font-black text-xl uppercase tracking-widest">Potwierdź w aplikacji</h3>
                            <p className="text-neutral-500 text-xs uppercase tracking-wider leading-relaxed">
                                Wysłaliśmy prośbę o transakcję na Twój telefon. <br /> Wpisz PIN w aplikacji swojego banku.
                            </p>
                            <div className="mt-4 bg-neutral-900 border border-neutral-800 py-3 px-6 rounded-lg text-white font-mono text-2xl font-black tracking-[0.4em] select-all">
                                {blikCode.slice(0, 3)} {blikCode.slice(3)}
                            </div>
                        </div>

                        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-white h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                        </div>

                        <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                            Autoryzacja wygaśnie za {blikTimer} sekund...
                        </span>
                    </div>
                </div>
            )}

            {/* 2. CREDIT CARD SIMULATION OVERLAY */}
            {simulationState === "PROCESSING_CARD" && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-neutral-950 border-2 border-neutral-900 p-8 sm:p-12 max-w-sm w-full flex flex-col items-center text-center gap-6 shadow-2xl">
                        <Loader2 className="h-16 w-16 text-white animate-spin" />
                        <div className="flex flex-col gap-2">
                            <h3 className="text-white font-black text-lg uppercase tracking-widest">Autoryzacja karty</h3>
                            <p className="text-neutral-500 text-xs uppercase tracking-wider leading-relaxed">
                                Kontaktujemy się z wystawcą Twojej karty płatniczej. <br /> Proszę nie odświeżać strony...
                            </p>
                        </div>
                        <div className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Lock size={10} /> 3D Secure / Verified by VISA
                        </div>
                    </div>
                </div>
            )}

            {/* 3. INSTANT BANK TRANSFER MODAL (FAKE SECURE PAYMENT PORTAL) */}
            {simulationState === "OPEN_TRANSFER_MODAL" && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 max-w-lg w-full flex flex-col shadow-2xl rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header bar */}
                        <div className="bg-white text-black p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-black">A</span>
                                <span className="font-black text-xs uppercase tracking-[0.2em]">Aldenaris Pay Gateway</span>
                            </div>
                            <span className="text-[8px] bg-black/10 text-black px-2 py-1 font-bold uppercase tracking-widest rounded flex items-center gap-1">
                                <Lock size={8} /> SECURE 256-BIT
                            </span>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 flex flex-col gap-6 bg-neutral-950">
                            {/* Merchant and amount */}
                            <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[8px] text-neutral-500 uppercase tracking-widest">Odbiorca</span>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">ALDENARIS STREETWEAR</span>
                                </div>
                                <div className="flex flex-col gap-0.5 items-end">
                                    <span className="text-[8px] text-neutral-500 uppercase tracking-widest">Kwota do zapłaty</span>
                                    <span className="text-lg font-black text-white font-mono">{total} PLN</span>
                                </div>
                            </div>

                            {/* Bank notice */}
                            <div className="bg-neutral-900/60 border border-neutral-850 p-4 rounded flex items-center gap-3">
                                <Building2 className="text-white shrink-0" size={20} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Wybrany bank: {selectedBank}</span>
                                    <span className="text-[8px] text-neutral-500 uppercase tracking-wider">Zostaniesz zalogowany do bezpiecznego środowiska testowego.</span>
                                </div>
                            </div>

                            {/* Fake Credentials inputs */}
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] text-neutral-500 uppercase tracking-widest font-black">Identyfikator Klienta</label>
                                    <input 
                                        type="text" 
                                        disabled
                                        value="aldenaris_test_user" 
                                        className="bg-neutral-900 border border-neutral-850 px-3 py-3 text-xs text-white/50 cursor-not-allowed select-none font-mono"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] text-neutral-500 uppercase tracking-widest font-black">Hasło maskowane</label>
                                    <input 
                                        type="password" 
                                        disabled
                                        value="••••••••••••••" 
                                        className="bg-neutral-900 border border-neutral-850 px-3 py-3 text-xs text-white/50 cursor-not-allowed select-none"
                                    />
                                </div>
                            </div>

                            {/* Simulated buttons */}
                            <div className="flex flex-col gap-3 mt-4">
                                <button 
                                    type="button"
                                    onClick={handleConfirmBankTransfer}
                                    className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                                >
                                    Zaloguj i zapłać przelewem
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => setSimulationState("IDLE")}
                                    className="w-full py-3 bg-transparent text-neutral-500 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                                >
                                    Anuluj transakcję
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. PROCESSING BANK TRANSFER MODAL */}
            {simulationState === "PROCESSING_TRANSFER" && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-neutral-950 border-2 border-neutral-900 p-8 sm:p-12 max-w-sm w-full flex flex-col items-center text-center gap-6 shadow-2xl">
                        <Loader2 className="h-16 w-16 text-white animate-spin" />
                        <div className="flex flex-col gap-2">
                            <h3 className="text-white font-black text-lg uppercase tracking-widest">Realizacja przelewu</h3>
                            <p className="text-neutral-500 text-xs uppercase tracking-wider leading-relaxed">
                                Księgujemy środki w systemie Elixir. <br /> Autoryzacja transakcji w toku...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. SUCCESS SIMULATOR DISPLAY */}
            {simulationState === "SUCCESS" && (
                <div className="fixed inset-0 z-50 bg-black backdrop-blur-md flex items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-6 animate-bounce">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-white/10">
                            <Check className="h-10 w-10 text-black stroke-[3px]" />
                        </div>
                        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] text-center">Płatność Zakończona!</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
