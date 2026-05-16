import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoWhite from '../assets/aldenaris_logo_white.png';
import LoginModal from '../features/auth/components/LoginModal';
import RegisterModal from '../features/auth/components/RegisterModal';
import UserDetailsModal from '../features/auth/components/UserDetailsModal';
import { useAuthStore } from '../store/authStore';

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
                            // Zalogowany — kliknięcie otwiera UserDetailsModal
                            <button
                                onClick={() => setUserDetailsOpen(true)}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full border border-neutral-700 group-hover:border-neutral-500 transition-colors"
                                />
                                <span className="hidden md:block text-white text-[10px] font-bold uppercase tracking-widest">
                                    {user.username}
                                </span>
                            </button>
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
