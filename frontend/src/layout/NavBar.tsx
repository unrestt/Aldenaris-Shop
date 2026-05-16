import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoWhite from '../assets/aldenaris_logo_white.png';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (sectionId: string) => {
        if (location.pathname === '/') {
            // Jestesmy na stronie głównej - przewijamy do sekcji
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Jestesmy np. na /product/:id - wracamy do "/" z hash
            navigate(`/#${sectionId}`);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center h-20">
                {/* Logo - zawsze wraca na strone glowna */}
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

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white font-bold uppercase text-[10px] tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors">
                    Menu
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
