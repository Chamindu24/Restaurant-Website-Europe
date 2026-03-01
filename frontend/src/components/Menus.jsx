import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import MenuCard from "./MenuCard";
import { Link } from "react-router-dom";
import { X, Gift } from "lucide-react";

const Menus = () => {
  const { menus, navigate, offers, offersLoaded } = useContext(AppContext);
  const previewMenus = menus.slice(0, 6);
  
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucherIndex, setVoucherIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Only use offers if they're loaded
  const allOffers = offersLoaded ? (offers || []) : [];

  useEffect(() => {
    const handleScroll = () => {
      const menuSectionTop = document.querySelector('.menus-section')?.offsetTop || 0;
      const menuSectionHeight = document.querySelector('.menus-section')?.offsetHeight || 0;
      const scrollPos = window.scrollY;
      
      // Show voucher when scrolling in the menus section
      if (scrollPos > menuSectionTop + 300 && scrollPos < menuSectionTop + menuSectionHeight - 300) {
        setShowVoucher(true);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Rotate through offers
      if (allOffers.length > 0) {
        const index = Math.floor((scrollPos / 200) % allOffers.length);
        setVoucherIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allOffers.length]);

  const currentOffer = allOffers[voucherIndex];

  return (
    <>
{/* Floating Voucher Card */}
{showVoucher && allOffers.length > 0 && (
  <div className={`fixed z-40 transition-all duration-700 ease-out
    /* Mobile: full-width bottom bar */
    bottom-0 left-0 right-0
    /* Desktop: floating card on right */
    sm:right-0 sm:bottom-24 sm:left-auto
    ${isVisible ? 'translate-y-0 opacity-100 sm:translate-x-0 sm:translate-y-0' : 'translate-y-full opacity-0 sm:translate-x-full sm:translate-y-0'}
  `}>
    <div className="
      /* THEME: Deep Royal Crimson to Onyx Gradient */
      bg-gradient-to-br from-[#3D0C0C] to-[#1A0505] border-t-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group
      /* Mobile: horizontal strip layout */
      flex items-center gap-3 p-3 rounded-none
      /* Desktop: card layout */
      sm:flex-col sm:items-stretch sm:rounded-lg sm:border-2 sm:p-8 sm:w-80 sm:mr-4 sm:mb-0
    ">

      {/* Decorative Texture Pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      {/* Decorative Gift Icon — Metallic Gold */}
      <div className="hidden sm:block absolute top-2 right-2 text-[#D4AF37] opacity-40">
        <Gift size={40} />
      </div>

      {/* Close Button */}
      <button
        onClick={() => setShowVoucher(false)}
        className="absolute top-2 left-2 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors z-20"
      >
        <X size={16} />
      </button>

      {/* Mobile: small gift icon inline */}
      <div className="sm:hidden flex-shrink-0 text-[#D4AF37] ml-6">
        <Gift size={24} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 sm:pt-2">
        <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em] mb-0.5 sm:mb-2">
          🎉 Today's Offers
        </p>
        <h3 className="text-xs sm:text-base font-serif italic font-bold text-[#F9F4E8] leading-tight line-clamp-1 sm:line-clamp-2 sm:mb-3">
          {currentOffer?.title}
        </h3>

        {/* Offer details — Champagne/Gold styling */}
        <div className="flex items-center gap-2 sm:block sm:bg-black/20 sm:backdrop-blur-sm sm:rounded sm:px-3 sm:py-3 sm:mb-4 sm:border sm:border-[#D4AF37]/20">
          {currentOffer?.offerType === "percentage" && (
            <p className="text-sm sm:text-2xl font-black text-[#F7E27E] tracking-tighter">
              {currentOffer.discountValue}% OFF
            </p>
          )}
          {currentOffer?.offerType === "fixed" && (
            <p className="text-sm sm:text-2xl font-black text-[#F7E27E] tracking-tighter">
              £{currentOffer.discountValue} OFF
            </p>
          )}
          {!["percentage", "fixed"].includes(currentOffer?.offerType) && (
            <p className="text-xs font-bold text-[#F7E27E] uppercase tracking-widest">
              {currentOffer?.offerType.replace(/([A-Z])/g, ' $1')}
            </p>
          )}
          <p className="hidden sm:block text-[10px] text-[#f7e7ce] mt-2 italic leading-relaxed">
            {currentOffer?.description}
          </p>
        </div>
      </div>

      {/* Claim Button — Metallic Gold */}
      <button
        onClick={() => navigate('/rewards')}
        className="flex-shrink-0 cursor-pointer bg-gradient-to-tr from-[#B8860B] via-[#F7E27E] to-[#D4AF37] text-[#1A1A1A] text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em]
          /* Mobile: compact pill */
          px-5 py-2 rounded-full
          /* Desktop: full width block */
          sm:w-full sm:py-3.5 sm:rounded-md
          transition-all duration-500 shadow-[0_10px_20px_rgba(184,134,11,0.3)] hover:scale-[1.02] hover:brightness-110 active:scale-95 z-10"
      >
        Claim Now
      </button>

      {/* Royal Corner Accents (Desktop only) */}
      <div className="hidden sm:block absolute top-4 left-4 w-6 h-6 border-t border-l border-[#D4AF37]/30"></div>
      <div className="hidden sm:block absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#D4AF37]/30"></div>

    </div>

    {/* Shine Sweep Animation Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
  </div>
)}

      {/* Main Menus Section */}
      <section
        className="relative z-10 min-h-screen py-24 px-6 sm:px-0 md:px-0 lg:px-0 bg-repeat menus-section"
        style={{ 
          backgroundImage: "url('/menubg.jpg')", 
          backgroundSize: "500px", 
          backgroundAttachment: "fixed" 
        }}
      >
      {/* The "Royal Vellum" Overlay - creates that thick, expensive paper feel */}
      <div className="absolute inset-0 bg-[#fdfcf9]/92 backdrop-blur-[0.5px]"></div>

      {/* Double Fine-Line Border - Signature of Mayfair establishments */}
      <div className="absolute inset-6 border border-[#d4af37]/10 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-10 border border-[#d4af37]/20 pointer-events-none hidden lg:block"></div>

      <div className="relative z-10 container mx-auto  max-w-[90rem]">
        
        {/* Header: Centered & Regal */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
            <span className="text-[#C5A059] tracking-[0.6em] text-[10px] uppercase font-bold">
              Established MMXXVI
            </span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
          </div>

          <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.05em] uppercase mb-6">
            Food You’ll  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700">Love</span>
          </h2>
          
          <div className="max-w-4xl mx-auto relative">
            {/* Quote marks for a literary feel */}
            <span className="absolute -top-4 -left-8 text-6xl text-stone-100 font-serif">“</span>
            <p className="text-stone-500 font-semibold font-serif italic text-2xl leading-relaxed">
              A menu of fresh, seasonal dishes made with quality ingredients from across the United Kingdom.
            </p>
            <span className="absolute -bottom-8 -right-8 text-6xl text-stone-100 font-serif">”</span>
          </div>
        </div>

        {/* The 12 Categories Grid - Refined to 3 columns for Premium impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {previewMenus.map((menu) => (
            <div 
              key={menu._id} 
              className="relative group cursor-pointer"
            >



              
              <div className="relative ">
                {/* Your MenuCard Component */}
                <MenuCard menu={menu} />
              </div>


            </div>
          ))}
        </div>

        {menus.length > 6 && (
          <div className="mt-16 flex justify-center">
            <Link
              to="/menu"
              className="px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white bg-stone-900 hover:bg-[#B38728] transition-all duration-700 shadow-2xl"
            >
              View Full Menu
            </Link>
          </div>
        )}


      </div>
    </section>
    </>
  );
};
export default Menus;
