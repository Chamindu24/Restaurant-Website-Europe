import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MenuCard = ({ menu }) => {
  const {  addToCart } = useContext(AppContext);

  return (
  <div className="group relative w-full bg-white flex flex-col border border-stone-200 transition-all duration-700 hover:border-stone-900">
    
    {/* TOP - The "Portrait Gallery" Section */}
    <div className="relative h-[420px] overflow-hidden">
      <img
        src={menu.image}
        alt={menu.name}
        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
      />
      
      {/* TOP LEFT - London Royal Red Offer Badge */}
      {menu.offers && menu.offers.length > 0 && (
        <div className="absolute top-7 left-4 z-20">
          <div className="relative group">
            {/* Subtle soft red glow instead of harsh gold */}
            <div className="absolute inset-0 bg-red-200/50 blur-md rounded-full scale-110 group-hover:bg-red-300/60 transition-all duration-700"></div>
            
            {/* Main Badge: Deep Wine to Royal Red */}
            <div className="relative bg-gradient-to-br from-[#921111] via-[#b91c1c] to-[#7f1d1d] px-2 py-1.5 rounded-sm border border-red-400/30 shadow-[0_4px_15px_rgba(153,27,27,0.4)]">
              <div className="flex flex-col items-center">

                
                <div className="flex items-center gap-2 border-t border-white/20 pt-0.5">
                  <span className="text-white text-[10px]  font-bold uppercase ">
                    {menu.offers.length > 1 ? `${menu.offers.length} Bonus Offers` : 'Your Reward Awaits!'}
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* TOP RIGHT - Floating Glass Heart (Favorite) */}
      <div className="absolute top-6 right-6 z-20">
        <button className="group/heart flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/80 px-3 py-3 rounded-full hover:bg-white transition-all duration-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            className="text-white group-hover/heart:text-red-600 transition-colors duration-500"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Elegant 'Unavailable' Overlay */}
      {!menu.isAvailable && (
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="border-[0.5px] border-white/50 p-2">
            <div className="bg-white px-8 py-3 text-stone-900 text-[10px] tracking-[0.5em] font-black uppercase">
              Fully Committed
            </div>
          </div>
        </div>
      )}
    </div>

    {/* BOTTOM - The Editorial Details */}
    <div className="p-10 flex flex-col flex-1 bg-white">
      
      {/* Category & Badge - Using Bold weights for professionalism */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-amber-700 text-[11px] tracking-[0.4em] uppercase font-black">
          {menu.category?.name || "Signature Service"}
        </span>
        <div className="w-2 h-2 rounded-full bg-stone-900" />
      </div>

      {/* Title - Bold, Serif, High Contrast */}
      <h3 className="text-3xl font-bold font-serif text-stone-900 tracking-tight leading-[1.1] mb-6">
        {menu.name}
      </h3>

      {/* Description - Medium weight, high-end readability */}
      <p className="text-[16px] text-stone-700 font-medium leading-relaxed mb-10 border-l-[3px] border-amber-500 pl-6">
        {menu.description}
      </p>

      {/* THE FOOTER - Integrated Price & Call to Action */}
        <div className="mt-auto pt-8 border-t border-stone-100 flex items-center justify-between gap-6">
          
          {/* Price Section: Anchored Left */}
          <div className="flex flex-col flex-shrink-0">
            <span className="text-[10px] text-stone-800 uppercase font-black tracking-[0.4em] ">
              Just
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif font-bold italic text-amber-700">£</span>
              <span className="text-3xl font-black text-stone-900 font-serif tracking-tighter">
                {menu.price}
              </span>
            </div>
          </div>

          {/* Button Section: Fixed Width for consistency */}
          <button
            onClick={() => addToCart(menu._id)}
            disabled={!menu.isAvailable}
            className="group/btn relative flex-1 max-w-[220px] overflow-hidden px-6 py-5 bg-stone-900 text-white text-[10px] tracking-[0.25em] uppercase font-black transition-all duration-700 hover:bg-[#B89552] disabled:bg-stone-50 disabled:text-stone-300 border border-stone-900 hover:border-[#B89552]"
          >
            <div className="relative flex items-center justify-center">
              
              {/* TEXT 1: Default */}
              <span className="flex items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/btn:-translate-x-12 group-hover/btn:opacity-0 whitespace-nowrap">
                Add to Order
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>

              {/* TEXT 2: Hover */}
              <span className="absolute flex items-center gap-3 translate-x-12 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/btn:translate-x-0 group-hover/btn:opacity-100 group-hover/btn:text-stone-900 whitespace-nowrap">
                ORDER NOW
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
            </div>

            {/* Subtle Shine Overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
          </button>
        </div>
    </div>

  </div>
  );
};

export default MenuCard;