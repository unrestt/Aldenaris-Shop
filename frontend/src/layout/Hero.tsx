import heroVideo from '../assets/hero.mp4';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden pt-20">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950/90 mix-blend-multiply"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-[-5vh]">
                <p className="text-neutral-500 uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold mb-8">
                    Nowa Kolekcja
                </p>
                <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-white uppercase tracking-tighter leading-[0.8] mb-12">
                    ALDENARIS <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-800">ORIGINALS</span>
                </h1>
                <p className="text-neutral-400 text-xs md:text-sm font-semibold uppercase tracking-[0.3em] max-w-xl mx-auto mb-16 leading-relaxed">
                    Definiujemy streetwear na nowo. Bez kompromisów, bez wymówek. 
                    Czysta forma, surowa energia.
                </p>
                <a href="#products" className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                    Odkryj Drop
                    <svg className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
                <span className="text-white text-[9px] uppercase tracking-[0.3em] font-bold rotate-90 mb-4">Scroll</span>
                <div className="w-px h-16 bg-gradient-to-b from-white to-transparent"></div>
            </div>
        </section>
    );
};

export default Hero;
