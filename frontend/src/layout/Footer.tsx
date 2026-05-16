import React from 'react';
import logoWhite from '../assets/aldenaris_logo_white.png';

const Footer = () => {
    return (
        <footer className="bg-neutral-950 py-16 px-4 sm:px-8 lg:px-12 border-t border-neutral-900">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="text-center md:text-left flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-4">
                        <img src={logoWhite} alt="Aldenaris Logo" className="h-10 w-auto object-contain opacity-50" />
                        <h2 className="text-white opacity-50 text-3xl font-black uppercase tracking-[0.3em] mt-1">ALDENARIS</h2>
                    </div>
                    <p className="text-neutral-600 text-[10px] uppercase tracking-widest font-bold">
                        &copy; {new Date().getFullYear()} Aldenaris. All rights reserved.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <a href="#" className="hover:text-white transition-colors">Regulamin</a>
                    <a href="#" className="hover:text-white transition-colors">Polityka Prywatności</a>
                    <a href="#" className="hover:text-white transition-colors">Dostawa i zwroty</a>
                    <a href="#" className="hover:text-white transition-colors">FAQ</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
