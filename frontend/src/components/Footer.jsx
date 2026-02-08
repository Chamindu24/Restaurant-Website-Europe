import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const footerClassName = `relative z-0 w-full min-h-[700px] bg-[#020202] text-white overflow-hidden flex flex-col font-serif ${
    isHome ? 'sticky bottom-0 h-screen' : 'h-auto'
  }`;
  return (
    <footer className={footerClassName}>
      
      {/* BACKGROUND: Dual Layer (Solid + Image) */}
      <div className="absolute inset-0 flex">
        <div className="w-full lg:w-1/2 h-full bg-[#020202] z-10" />
        <div 
          className="absolute lg:relative w-full lg:w-1/2 h-full z-0 opacity-50 lg:opacity-60 grayscale-[0.5] contrast-125"
          style={{
            backgroundImage: "url('/footer.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>

      {/* OVERLAY: Gold Light Leak */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020202] via-[#020202]/80 to-transparent lg:to-black/20" />

      <div className="relative z-20 flex-grow flex flex-col justify-between p-8 md:p-16 lg:p-24">
        
        {/* TOP: THE MONOGRAM */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-4  transition-all duration-700">
            {/* The Logo: Scaled and enhanced with a subtle 'Royal' glow */}
            <img
              src="/logo.png"
              alt="Black Pepper logo"
              className="h-20 w-20 md:h-56 md:w-56 object-contain  drop-shadow-[0_0_20px_rgba(197,160,89,0.2)]"
            />

            {/* The Typography: Cinematic spacing and royal italicization */}
            <div className="flex flex-col">
              {/* Discrete Tagline above the name */}
              <span className="text-[#f5dbab] text-[10px] md:text-xs font-bold tracking-[1em] uppercase mb-4 opacity-60 ml-1 hidden md:block">
                Haute Cuisine Européenne
              </span>
              <h2 className="text-6xl md:text-[8vw] xl:text-[7vw] tracking-tighter text-white uppercase leading-[0.75] font-light">
                Black <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 italic ml-8 md:ml-20 lg:ml-28 block">
                  Pepper
                </span>
              </h2>
            </div>
          </div>

          <div className="text-right hidden md:block">
            <div className="flex gap-2 justify-end mb-4">
              {[1, 2, 3,4,5].map((star) => (
                <svg key={star} className="w-5 h-5 text-[#c5a059]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                </svg>
              ))}
            </div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c5a059] opacity-90 font-bold">The Michelin Standard</p>
          </div>
        </div>

        {/* MIDDLE: THE SERVICE ATELIER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mt-8  border-t border-white/5 pt-16">
          
          <div className="space-y-6">
            <h4 className="text-[#c5a059] text-xs tracking-[0.4em] uppercase font-bold">The Atelier</h4>
            <div className="space-y-4 text-sm font-light tracking-widest text-gray-200">
              <p className="hover:text-white transition-colors cursor-pointer">Chef's Signature Tasting</p>
              <p className="hover:text-white transition-colors cursor-pointer">Sommelier's Private Reserve</p>
              <p className="hover:text-white transition-colors cursor-pointer">The Art of Fire Cooking</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[#c5a059] text-xs tracking-[0.4em] uppercase font-bold">The Visit</h4>
            <div className="space-y-4 text-sm font-light tracking-widest text-gray-200">
              <p>12 Avenue Montaigne, Paris</p>
              <p>+33 1 23 45 67 89</p>
              <p className="text-[#c5a059] text-[10px] pt-2">REQUEST A CONCIERGE CALL</p>
            </div>
          </div>

          <div className="space-y-10 lg:text-right flex flex-col lg:items-end relative">
            
            {/* DECORATIVE ACCENT: A floating gold line for visual weight */}
            <div className="flex items-center gap-4 group cursor-default">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c5a059] opacity-50 group-hover:w-20 transition-all duration-700" />
              <h4 className="text-[#c5a059] text-xs tracking-[0.4em] uppercase font-bold">The Society</h4>
            </div>

            {/* THE INTERACTIVE VAULT */}
            <div className="w-full max-w-sm relative group">
              
              {/* AMBIENT GLOW: A soft gold radiance behind the input */}
              <div className="absolute -inset-4 bg-[#c5a059]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="relative overflow-hidden rounded-sm border border-white/50 bg-gradient-to-br from-white/[0.09] to-transparent backdrop-blur-md p-1">
                
                <div className="relative flex items-center">
                  <input 
                    type="email" 
                    placeholder="REQUEST AN INVITATION" 
                    className="w-full bg-transparent px-6 py-5 text-[10px] tracking-[0.5em] uppercase outline-none text-white placeholder:text-gray-400 focus:placeholder:text-gray-300 transition-all"
                  />
                  
                  {/* THE ACTION: A vertical gold bar button */}
                  <button className="relative h-12 w-16 bg-[#c5a059] flex items-center justify-center group/btn overflow-hidden transition-all duration-500 hover:w-24">
                    {/* Shimmer Effect on Button */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                    
                    <span className="text-black text-[10px] font-bold tracking-tighter group-hover/btn:tracking-[0.2em] transition-all">
                      JOIN
                    </span>
                  </button>
                </div>

                {/* PROGRESS BORDER: Animates around the box on focus */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#c5a059] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000 origin-center" />
              </div>

              {/* EXCLUSIVITY TAG */}
              <div className="mt-6 flex justify-end items-center gap-3">
                <span className="text-[10px] tracking-[0.4em] text-gray-300 uppercase">Limited Memberships Remaining</span>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-[#c5a059] animate-pulse" />
                    <div className="w-1 h-1 bg-[#c5a059]/30" />
                    <div className="w-1 h-1 bg-[#c5a059]/30" />
                </div>
              </div>
            </div>

            {/* TAILWIND ANIMATION CONFIG (Add to your globals.css or tailwind.config) */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}} />
          </div>

        </div>

        {/* BOTTOM: THE STATUS BAR */}
        <div className="mt-auto pt-12  flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
          <div className="flex items-center gap-12 text-gray-200 grayscale  hover:opacity-100 transition-all duration-700">
             {/* Royal Partnership Names (Substitute for actual logos) */}
             <span className="text-[11px] tracking-[0.3em] uppercase">Vogue Gastronomy</span>
             <span className="text-[11px] tracking-[0.3em] uppercase">Relais & Châteaux</span>
             <span className="text-[11px] tracking-[0.3em] uppercase">Dom Pérignon</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[11px] tracking-[0.6em] uppercase text-gray-200 ">
              © 2026 Black Pepper • Established 1924 
            </p>
            <div className="flex justify-center md:justify-end gap-6 text-[8px] tracking-[0.3em] uppercase text-gray-700">
               <a href="#" className="hover:text-[#c5a059]">Privacy Policy</a>
               <a href="#" className="hover:text-[#c5a059]">Accessibility</a>
               <a href="#" className="hover:text-[#c5a059]">Press Kit</a>
            </div>
          </div>
        </div>
      </div>

      {/* GRAIN OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.5] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </footer>
  );
}