import React from 'react';
import logoWhite from '../assets/aldenaris_logo_white.png';

const NavBar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center h-20">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-3 hover:opacity-75 transition-opacity">
                    <img src={logoWhite} alt="Aldenaris Logo" className="h-8 w-auto object-contain" />
                    <span className="text-white font-black text-2xl uppercase tracking-[0.2em] mt-1 hidden sm:block">
                        ALDENARIS
                    </span>
                </a>
                
                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-12 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                    <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                    <li><a href="#about" className="hover:text-white transition-colors">O nas</a></li>
                    <li><a href="#products" className="hover:text-white transition-colors">Produkty</a></li>
                    <li><a href="#contact" className="hover:text-white transition-colors">Kontakt</a></li>
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
