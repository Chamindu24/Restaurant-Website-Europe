import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Tag, Calendar, Clock, Percent, Gift, Diamond } from "lucide-react";
import MenuCard from "../components/MenuCard";
import { getOffersThatApply } from "../utils/offerCalculations";

const Rewards = () => {
  const { menus, offers, offersLoaded } = useContext(AppContext);
  const [menuItemsWithOffers, setMenuItemsWithOffers] = useState([]);

  // Update filtered menus whenever menus or offers change
  useEffect(() => {
    if (menus.length > 0 && offers.length > 0 && offersLoaded) {
      // Filter menu items that have applicable offers (ignoring time/date for display)
      const itemsWithOffers = menus.filter((item) => {
        const applicableOffers = getOffersThatApply(item, offers);
        return applicableOffers.length > 0;
      });
      setMenuItemsWithOffers(itemsWithOffers);
    } else {
      setMenuItemsWithOffers([]);
    }
  }, [menus, offers, offersLoaded]);

  const getOfferIcon = (offerType) => {
    switch (offerType) {
      case "percentage":
      case "fixed":
        return <Percent className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      case "bxgy":
        return <Gift className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      case "happyHour":
        return <Clock className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      case "birthday":
      case "anniversary":
        return <Gift className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      default:
        return <Tag className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
    }
  };

  const getOfferLabel = (offer) => {
    if (offer.offerType === "percentage") {
      return `${offer.discountValue}% OFF`;
    }
    if (offer.offerType === "fixed") {
      return `£${offer.discountValue} OFF`;
    }
    if (offer.offerType === "bxgy") {
      return `Buy ${offer.buyQuantity} Get ${offer.getQuantity}`;
    }
    if (offer.offerType === "happyHour") {
      return `${offer.discountValue}% OFF`;
    }
    if (offer.offerType === "birthday") {
      return "Birthday Special";
    }
    if (offer.offerType === "anniversary") {
      return "Anniversary Special";
    }
    return "Limited Offer";
  };

  const formatAppliesTo = (offer) => {
    if (offer.appliesTo === "menu" && offer.menuItem?.name) {
      return `On ${offer.menuItem.name}`;
    }
    if (offer.appliesTo === "category" && offer.category?.name) {
      return `On ${offer.category.name}`;
    }
    return "On All Items";
  };

  const formatValidDays = (days) => {
    if (!days || days.length === 0) return "All Week";
    if (days.length === 7) return "All Week";
    if (days.length <= 3) return days.join(", ");
    return `${days.slice(0, 2).join(", ")} +${days.length - 2}`;
  };

  const formatTimeRange = (offer) => {
    if (offer.startTime && offer.endTime) {
      return `${offer.startTime} - ${offer.endTime}`;
    }
    return null;
  };

  const formatDateRange = (offer) => {
    if (offer.startDate && offer.endDate) {
      const start = new Date(offer.startDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      const end = new Date(offer.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      return `${start} - ${end}`;
    }
    if (offer.endDate) {
      const end = new Date(offer.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `Valid Until ${end}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]  pb-20">
      <div className="max-w-8xl mx-auto ">
      {/* Hero Header: The London Estate Concept */}
      <div className="relative min-h-[450px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] w-full bg-[#F9F7F2] flex items-center justify-center overflow-hidden">
        
        {/* Subtle Background Texture/Image */}
        <div className="absolute inset-0 z-0">
        <img 
            src="/rewordcover3.png" 
            alt="Background" 

            className="w-full h-full object-cover scale-110"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.20) 0%, rgba(0,0,0,1) 100%)',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F2]/80 via-transparent to-[#F9F7F2]/80"></div>
        </div>

{/* Main Container: Widened to "Landscape" Rectangular Aspect Ratio */}
<div className="relative z-10 w-[94%] max-w-5xl mx-auto bg-white/70 backdrop-blur-md p-1 border-[0.5px] border-[#C5A059]/30 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)]">
  
  {/* Inner Decorative Border: Adjusted padding for a horizontal flow */}
  <div className="border border-[#C5A059]/60 p-8 sm:p-12 md:py-16 md:px-24 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10">

    {/* Left Side: Typography & Description */}
    <div className="flex-1">
      <div className="mb-4 w-full">
        <h2 className="text-[#1A1A1A] font-semibold font-serif italic text-xl sm:text-2xl md:text-3xl mb-1 tracking-wide">
          The Curated
        </h2>
        <h1 className="text-[#1A1A1A] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light leading-none uppercase tracking-tighter">
          Rewards
        </h1>
      </div>

      <p className="text-gray-700 font-semibold font-serif italic text-base sm:text-lg md:text-xl max-w-lg leading-relaxed mb-0">
        "Discover our current offers and special promotions. Treat yourself to exceptional dining experiences."
      </p>
    </div>

    {/* Right Side: Modern Counter Badge (Positioned to the side for the rectangular look) */}
    {offersLoaded && (
      <div className="relative group cursor-default flex flex-col items-center shrink-0">
        <div className="absolute -inset-4 border border-[#C5A059]/20 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        <span className="text-[#1A1A1A] font-sans text-5xl md:text-7xl mb-1 tabular-nums font-light">
          {offers.length.toString().padStart(2, '0')}
        </span>
        <span className="text-[#9c7225] text-[10px] md:text-[12px] uppercase tracking-[0.3em] font-bold">
          Current Rewards
        </span>
      </div>
    )}

  </div>
</div>

        {/* Corner Accents: Floating Geometric Lines */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 w-16 h-16 md:w-32 md:h-32 border-t border-l border-[#C5A059]/20 hidden sm:block"></div>
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-16 h-16 md:w-32 md:h-32 border-b border-r border-[#C5A059]/20 hidden sm:block"></div>
      </div>

        {/* Loading State */}
        {!offersLoaded && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
          </div>
        )}

        {offersLoaded && offers.length > 0 && (
          <div className="relative max-w-7xl mx-auto pt-8 px-4 lg:px-8">
            {offers.map((offer, index) => (
              <div
                key={offer._id}
                className="sticky w-full"
                style={{
                  top: `${100 + index * 28}px`,
                  marginBottom: "64px",
                  zIndex: index + 1
                }}
              >
                {/* Main Container: Deep Royal Crimson Gradient */}
                <div className="bg-[#2D0A0A] border border-[#D4AF37]/30 group transition-all duration-1000 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                  
                  {/* Champagne Gold "Pulse" Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 opacity-100 pointer-events-none"></div>
                  
                  <div className="flex flex-col lg:flex-row relative">

                    {/* 1. THE HERITAGE SPINE - Solid Onyx Black */}
                    <div className="lg:w-20 bg-[#000000] flex flex-row lg:flex-col justify-center items-center px-6 py-4 lg:px-0 lg:py-0 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20">
                      <div className="z-10 flex items-center">
                        <span className="block lg:hidden text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-black">
                          Black Pepper Rewards
                        </span>
                        <span className="hidden lg:block [writing-mode:vertical-lr] rotate-180 text-[10px] uppercase tracking-[1em] text-[#D4AF37] font-black leading-none">
                        Black Pepper Rewards
                        </span>
                      </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex flex-col lg:flex-row flex-1 min-h-0">

                      {/* 2. THE CEREMONIAL CORE - Deep Crimson */}
                      <div className="flex-1 p-8 lg:p-18 relative bg-gradient-to-b from-[#3D0C0C] to-[#2D0A0A] overflow-hidden">
                        {/* Subtle Luxury Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        
                        <div className="relative z-10 flex flex-col h-full items-center justify-center text-center space-y-6 lg:space-y-10">
                          
                          <div className="space-y-3 lg:space-y-4">
                            <div className="flex items-center justify-center gap-3 lg:gap-4">
                              <div className="h-[1px] w-8 bg-[#D4AF37]"></div>
                              <p className="text-[10px] lg:text-[12px] uppercase tracking-[0.5em] text-[#D4AF37] font-black">
                                {offer.offerType.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                              <div className="h-[1px] w-8 bg-[#D4AF37]"></div>
                            </div>
                            
                            {/* Offer Title in Champagne White */}
                            <h3 className="text-4xl lg:text-7xl font-serif italic font-bold text-[#F9F4E8] tracking-tighter leading-tight drop-shadow-md">
                              {offer.title}
                            </h3>
                          </div>

                          <div className="max-w-xl mx-auto space-y-5 lg:space-y-8">
                            <p className="text-[#ebd5b3] font-semibold text-base lg:text-2xl font-serif italic leading-relaxed">
                              "{offer.description || "Indulge in an extraordinary dining privilege, crafted exclusively for our Black Pepper members."}"
                            </p>
                            
                            {/* Premium Metallic Gold Badge */}
                            <div className="relative inline-flex items-center justify-center rounded-md px-6 sm:px-10 lg:px-14 py-3 sm:py-4 overflow-hidden group transition-transform duration-500 hover:scale-105">

                              {/* Gold Gradient Base */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-[#B8860B] via-[#F7E27E] to-[#D4AF37]"></div>

                              {/* Metallic Depth Layer */}
                              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/20 mix-blend-overlay"></div>

                              {/* Shine Sweep Animation */}
                              <div className="absolute -inset-y-full left-[-40%] w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-12 group-hover:translate-x-[250%] transition-all duration-1000"></div>

                              {/* Inner Glow */}
                              <div className="absolute inset-0 rounded-md ring-1 ring-white/40"></div>

                              {/* Content */}
                              <span className="relative z-10 text-xs sm:text-sm lg:text-xl uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-[#1A1A1A] text-center">
                                {getOfferLabel(offer)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Royal Corner Accents */}
                        <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#D4AF37]/50"></div>
                        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#D4AF37]/50"></div>
                      </div>

                      {/* 3. THE ADMISSION STUB - Mobile View */}
                      <div className="flex lg:hidden flex-row flex-wrap gap-4 bg-[#1A1A1A] border-t border-dashed border-[#D4AF37]/30 p-6 relative">
                        {/* Perforation holes on mobile */}
                        <div className="absolute -top-[11px] left-0 right-0 flex flex-row justify-around px-4">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-[#2D0A0A] rounded-full border border-[#D4AF37]/10"></div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-3 flex-1">
                          <div className="flex items-start gap-2">
                            <Tag size={15} className="text-[#D4AF37] shrink-0 mt-0.5" />
                            <span className="text-[12px] font-bold text-gray-200 uppercase leading-tight">{formatAppliesTo(offer)}</span>
                          </div>

                          {offer.validDays?.length > 0 && (
                            <div className="flex items-start gap-2">
                              <Calendar size={15} className="text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="text-[12px] font-bold text-gray-200 uppercase leading-tight">{formatValidDays(offer.validDays)}</span>
                            </div>
                          )}

                          {formatTimeRange(offer) && (
                            <div className="flex items-start gap-2">
                              <Clock size={15} className="text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="text-[12px] font-bold text-gray-200 uppercase leading-tight">{formatTimeRange(offer)}</span>
                            </div>
                          )}

                          <div className="flex items-start gap-2 w-full pt-2 border-t border-[#D4AF37]/20">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-black">Valid Period</p>
                              <p className="text-[12px] font-bold text-white">{formatDateRange(offer)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. THE ADMISSION STUB - Desktop View */}
                      <div className="hidden lg:flex md:w-80 bg-[#1A1A1A] border-l border-dashed border-[#D4AF37]/30 flex-col p-12 relative">
                        {/* Perforation holes on desktop */}
                        <div className="absolute -left-[11px] top-0 bottom-0 flex flex-col justify-around py-4">
                          {[...Array(14)].map((_, i) => (
                            <div key={i} className="w-5 h-5 bg-[#2D0A0A] rounded-full -ml-[1px] border border-[#D4AF37]/10"></div>
                          ))}
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          <div className="w-full max-w-[120px] py-4 px-2 border-y border-[#D4AF37]/40 flex flex-col items-center justify-center relative">
                            <div className="absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-[#D4AF37] via-transparent to-[#D4AF37]"></div>
                            <div className="absolute right-0 top-0 w-[1px] h-full bg-gradient-to-b from-[#D4AF37] via-transparent to-[#D4AF37]"></div>
                            <div className="text-[#D4AF37] mb-2">
                              {getOfferIcon(offer.offerType)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 pt-8 border-t mt-8 border-[#D4AF37]/30">
                          <div className="flex items-start gap-3">
                            <Tag size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                            <span className="text-[14px] font-bold text-gray-200 uppercase leading-tight">{formatAppliesTo(offer)}</span>
                          </div>

                          {offer.validDays?.length > 0 && (
                            <div className="flex items-start gap-3">
                              <Calendar size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="text-[14px] font-bold text-gray-200 uppercase leading-tight">{formatValidDays(offer.validDays)}</span>
                            </div>
                          )}

                          {formatTimeRange(offer) && (
                            <div className="flex items-start gap-3">
                              <Clock size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="text-[14px] font-bold text-gray-200 uppercase leading-tight">{formatTimeRange(offer)}</span>
                            </div>
                          )}

                          <div className="pt-4 border-t border-[#D4AF37]/10">
                            <p className="text-[12px] uppercase tracking-widest text-[#D4AF37] font-black">Valid Period</p>
                            <p className="text-[14px] font-bold text-white">{formatDateRange(offer)}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                  {/* Glowing Top Gold Border */}
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_15px_#D4AF37]"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {offersLoaded && offers.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-[#FAF9F6] p-12 rounded-lg border border-[#E5E0D8] max-w-md mx-auto">
              <Tag className="mx-auto text-gray-300 mb-4" size={64} strokeWidth={1} />
              <h3 className="text-2xl font-serif italic font-semibold text-[#1A1A1A] mb-3">
                No Active Offers
              </h3>
              <p className="text-gray-600">
                Check back soon for exciting new offers and promotions.
              </p>
            </div>
          </div>
        )}

        {/* Menu Items with Offers Section */}
        {offersLoaded && menuItemsWithOffers.length > 0 && (
          <div className="mt-24">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
                <Diamond className="text-[#C5A059]" size={24} strokeWidth={1.5} />
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-[#1A1A1A] tracking-tight mb-3">
                Featured Dishes with Rewards
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our specially selected menu items with exclusive offers
              </p>
            </div>

            {/* Menu Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItemsWithOffers.map((menu) => (
                <div key={menu._id} className="relative">
                  <MenuCard menu={menu} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
