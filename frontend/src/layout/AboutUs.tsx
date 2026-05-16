import React from 'react';
import aboutVideo from '../assets/about.mp4';

const AboutUs = () => {
    return (
        <section id="about" className="w-full bg-neutral-900 py-32 px-4 sm:px-8 lg:px-12 selection:bg-white selection:text-black border-y border-neutral-800">
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-20 items-center">
                
                {/* Text Content */}
                <div className="flex-1 space-y-12">
                    <div className="space-y-4">
                        <p className="text-neutral-500 uppercase tracking-[0.4em] text-[10px] font-bold">Nasza Historia</p>
                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                            Więcej niż <br/> ubrania.
                        </h2>
                    </div>
                    
                    <div className="w-24 h-1 bg-white"></div>
                    
                    <div className="space-y-8 text-neutral-400 text-xs md:text-sm uppercase tracking-widest font-semibold leading-relaxed max-w-xl">
                        <p>
                            ALDENARIS to manifest niezależności. Powstaliśmy na skrzyżowaniu surowej estetyki ulicy i pragnienia bezkompromisowej jakości.
                        </p>
                        <p>
                            Nie podążamy za trendami, my je ignorujemy. Skupiamy się na formie, materiale i przekazie. Każdy drop to limitowana historia, opowiedziana przez ciężkie gramatury bawełny i precyzyjne kroje.
                        </p>
                        <p className="text-white font-black tracking-[0.2em] text-sm mt-4">
                            Zaprojektowane w Polsce.<br/> Noszone na całym świecie.
                        </p>
                    </div>
                </div>

                {/* Visual Video Block */}
                <div className="flex-1 w-full aspect-square md:aspect-[4/3] bg-neutral-950 border border-neutral-800 relative flex items-center justify-center overflow-hidden group">
                     {/* Video */}
                     <video 
                         autoPlay 
                         loop 
                         muted 
                         playsInline 
                         className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
                     >
                         <source src={aboutVideo} type="video/mp4" />
                     </video>
                     
                     <div className="absolute inset-0 bg-neutral-900/10 mix-blend-overlay pointer-events-none"></div>
                     
                     {/* Corner Accents */}
                     <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-neutral-700"></div>
                     <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-neutral-700"></div>
                     <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-neutral-700"></div>
                     <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-neutral-700"></div>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
