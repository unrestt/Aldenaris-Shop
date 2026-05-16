import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="w-full bg-neutral-950 py-32 px-4 sm:px-8 lg:px-12 border-t border-neutral-900">
            <div className="max-w-[1600px] mx-auto">
                <div className="border border-neutral-800 p-8 md:p-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 bg-neutral-900/30 backdrop-blur-sm relative overflow-hidden group">
                    
                    {/* Decorative abstract element */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-[0.03] blur-[100px] rounded-full pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000"></div>

                    <div className="space-y-6 z-10">
                        <p className="text-neutral-500 uppercase tracking-[0.4em] text-[10px] font-bold">Współpraca / Pomoc</p>
                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                            Skontaktuj <br/> się z nami
                        </h2>
                        <p className="text-neutral-400 uppercase tracking-widest text-xs font-bold max-w-sm">
                            Masz pytania dotyczące dropu? Chcesz nawiązać współpracę? Jesteśmy tutaj.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 z-10 w-full lg:w-auto">
                        <a href="mailto:contact@aldenaris.com" className="group/link flex items-center gap-6 text-white hover:text-neutral-300 transition-colors">
                            <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black group-hover/link:border-white transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-black tracking-[0.2em] uppercase text-sm md:text-base">contact@aldenaris.com</span>
                        </a>
                        
                        <a href="#" className="group/link flex items-center gap-6 text-white hover:text-neutral-300 transition-colors">
                            <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black group-hover/link:border-white transition-all duration-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </div>
                            <span className="font-black tracking-[0.2em] uppercase text-sm md:text-base">@aldenaris_official</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
