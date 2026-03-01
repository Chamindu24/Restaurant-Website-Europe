import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const currentYear = new Date().getFullYear();

  const footerClassName = `relative z-0 w-full bg-[#050505] text-white overflow-hidden flex flex-col font-serif ${
    isHome ? 'sticky bottom-0 h-screen max-h-[92vh]' : 'min-h-screen'
  }`;

  return (
    <footer className={footerClassName}>
      
      {/* BACKGROUND: Dual Layer (Solid Matte + Image) */}
      <div className="absolute inset-0 flex">
        <div className="w-full lg:w-1/2 h-full bg-[#050505] z-10" />
        <div 
          className="absolute lg:relative w-full lg:w-1/2 h-full z-0 opacity-40 lg:opacity-50 grayscale contrast-125"
          style={{
            backgroundImage: "url('/footer.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>

      {/* OVERLAY: Depth Gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/95 to-transparent" />

      <div className="relative z-20 flex-grow flex flex-col justify-between p-8 md:p-16 lg:p-24">
        
        {/* TOP: BRANDING & MICHELIN STATUS */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
              <h2 className="text-6xl md:text-7xl lg:text-[8vw] font-black uppercase tracking-tighter leading-[0.75] text-white">
                Black <br /> Pepper
              </h2>
              <div className="mt-8 flex items-center gap-4">
                <span className="h-[1px] w-12 bg-white/10" />
                <p className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">
                  Est. London 1924 • Michelin Excellence
                </p>
              </div>
            </div>

          <div className="text-left md:text-right">
            <div className="flex gap-1.5 justify-start md:justify-end mb-3">
              {[1, 2, 3].map((star) => (
                <svg key={star} className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                </svg>
              ))}
            </div>
            <p className="text-[11px] tracking-[0.4em] uppercase font-black">Three Michelin Stars</p>
            <p className="text-[9px] tracking-[0.1em] uppercase opacity-40 mt-1 italic max-w-[200px] md:ml-auto">
              "Exceptional cuisine, worth a special journey."
            </p>
          </div>
        </div>

        {/* MIDDLE: THE FULL RESTAURANT LEDGER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-2  mt-8">
          
          {/* 1. MENUS */}
          <div className="space-y-6">
            <h4 className="text-white text-xs tracking-[0.4em] uppercase font-black">The Experience</h4>
            <div className="flex flex-col space-y-3 text-sm font-medium tracking-[0.2em] uppercase text-stone-400">
              <a href="#" className="hover:text-white hover:translate-x-2 transition-all">A La Carte</a>
              <a href="#" className="hover:text-white hover:translate-x-2 transition-all">Tasting Menu</a>
              <a href="#" className="hover:text-white hover:translate-x-2 transition-all">The Wine Library</a>
            </div>
          </div>

          {/* 2. OPENING HOURS */}
          <div className="space-y-6">
            <h4 className="text-white text-xs tracking-[0.4em] uppercase font-black">Opening Hours</h4>
            <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400 space-y-3">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Mon — Fri</span>
                <span className="text-white">12:00 - 23:00</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Saturday</span>
                <span className="text-white">17:00 - 00:00</span>
              </div>
              <div className="flex justify-between opacity-30">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* 3. CONTACT & LOCATION */}
          <div className="space-y-6">
            <h4 className="text-white text-xs tracking-[0.4em] uppercase font-black">Contact</h4>
            <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-stone-400 leading-relaxed">
              <p>12 Berkeley Square, Mayfair</p>
              <p>London, W1J 6BQ</p>
              <p className="mt-2 text-white">+44 (0) 20 7946 0111</p>
              <button className="mt-6 px-6 py-3 bg-white text-black text-[9px] font-black tracking-[0.3em] uppercase hover:bg-stone-200 transition-all">
                Book Table
              </button>
            </div>
          </div>

          {/* 4. NEWSLETTER */}
          <div className="space-y-6 lg:text-right flex flex-col lg:items-end">
            <h4 className="text-white text-xs tracking-[0.4em] uppercase font-black">The Society</h4>
            <div className="w-full max-w-xs relative group">
              <input 
                type="email" 
                placeholder="JOIN THE GUESTLIST" 
                className="w-full bg-transparent border-b border-white/20 pb-2 text-[10px] font-black tracking-widest outline-none focus:border-white transition-all text-white placeholder:text-stone-600"
              />
              <p className="mt-4 text-[9px] italic text-stone-500 uppercase tracking-tighter">
                Exclusive seasonal previews & invitations.
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM: ETIQUETTE & STATUS */}
        <div className="mt-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10">
          <div className="flex items-center gap-4 md:gap-8 text-[9px] font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-stone-500">
            <span className="cursor-help underline underline-offset-4 decoration-stone-700">Dress Code: Formal</span>
            <span className="hidden sm:inline">AA Five Rosettes</span>
            <span className="hidden sm:inline">Forbes Five-Star</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[10px] tracking-[0.25em] md:tracking-[0.5em] uppercase text-stone-400">
              © {currentYear} Black Pepper London
            </p>
            <div className="flex justify-center md:justify-end gap-6 text-[8px] tracking-[0.2em] uppercase text-stone-700 mt-2">
               <a href="#" className="hover:text-white">Allergens</a>
               <a href="#" className="hover:text-white">Privacy</a>
               <a href="#" className="hover:text-white">Careers</a>
            </div>
          </div>
        </div>
      </div>

      {/* TEXTURE OVERLAY: For that premium Matte feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </footer>
  );
}