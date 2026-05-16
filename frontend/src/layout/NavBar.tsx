import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoWhite from '../assets/aldenaris_logo_white.png';
import LoginModal from '../features/auth/components/LoginModal';
import RegisterModal from '../features/auth/components/RegisterModal';
import UserDetailsModal from '../features/auth/components/UserDetailsModal';
import { useAuthStore } from '../store/authStore';
import { ShoppingCart } from 'lucide-react'

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [userDetailsOpen, setUserDetailsOpen] = useState(false);
    const { user } = useAuthStore();

    const handleNavClick = (sectionId: string) => {
        if (location.pathname === '/') {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${sectionId}`);
        }
    };

    const openLogin = () => { setRegisterOpen(false); setLoginOpen(true); };
    const openRegister = () => { setLoginOpen(false); setRegisterOpen(true); };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-75 transition-opacity">
                        <img src={logoWhite} alt="Aldenaris Logo" className="h-8 w-auto object-contain" />
                        <span className="text-white font-black text-2xl uppercase tracking-[0.2em] mt-1 hidden sm:block">
                            ALDENARIS
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-12 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                        <li><button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
                        <li><button onClick={() => handleNavClick('about')} className="hover:text-white transition-colors cursor-pointer">O nas</button></li>
                        <li><button onClick={() => handleNavClick('products')} className="hover:text-white transition-colors cursor-pointer">Produkty</button></li>
                        <li><button onClick={() => handleNavClick('contact')} className="hover:text-white transition-colors cursor-pointer">Kontakt</button></li>
                    </ul>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <button
                                    onClick={() => setUserDetailsOpen(true)}
                                    className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                                >
                                    <div className="w-8 h-8 rounded-full border border-neutral-700 group-hover:border-neutral-400 transition-colors bg-neutral-800 flex items-center justify-center">
                                        <span className="text-white text-[10px] font-black uppercase">
                                            {user.username.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="hidden md:block text-white text-[10px] font-bold uppercase tracking-widest">
                                        {user.username}
                                    </span>
                                </button>
                                <Link to={'/cart'}>
                                    <div className="relative inline-block">
                                        <ShoppingCart />
                                        <span className='absolute -top-2 -right-3 flex h-5 w-5 p-2 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white'>0</span>
                                    </div>
                                </Link>

                            </>
                            // Zalogowany — inicjały + nazwa → otwiera UserDetailsModal

                        ) : (
                            // Niezalogowany
                            <>
                                <button
                                    onClick={openLogin}
                                    className="hidden md:block text-white text-[10px] font-bold uppercase tracking-widest hover:text-neutral-400 transition-colors"
                                >
                                    Zaloguj
                                </button>
                                <button
                                    onClick={openRegister}
                                    className="text-black bg-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 hover:bg-neutral-200 transition-colors"
                                >
                                    Zarejestruj się
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSwitchToRegister={openRegister}
            />
            <RegisterModal
                isOpen={registerOpen}
                onClose={() => setRegisterOpen(false)}
                onSwitchToLogin={openLogin}
            />
            <UserDetailsModal
                isOpen={userDetailsOpen}
                onClose={() => setUserDetailsOpen(false)}
            />
        </>
    );
};

export default NavBar;
