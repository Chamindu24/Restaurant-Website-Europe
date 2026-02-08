import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Diamond, Search, X } from "lucide-react";
import MenuCard from "../components/MenuCard";
const Menu = () => {
  const { menus } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenus, setFilteredMenus] = useState([]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredMenus(menus);
    } else {
      const filtered = menus.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMenus(filtered);
    }
  }, [searchQuery, menus]);
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  return (
    <div 
      className="relative min-h-screen bg-[#FDF6F0]  py-28"
      style={{ 
        backgroundImage: "url('/menubg.jpg')", 
        backgroundSize: "500px", 
        backgroundAttachment: "fixed" 
      }}
    >
      {/* The "Royal Vellum" Overlay - creates that thick, expensive paper feel */}
      <div className="absolute inset-0 bg-[#fdfcf9]/92 backdrop-blur-[1px]"></div>

      {/* Double Fine-Line Border - Signature of Mayfair establishments */}
      <div className="absolute inset-6 border border-[#d4af37]/10 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-10 border border-[#d4af37]/20 pointer-events-none hidden lg:block"></div>

      {/* Thin Gold Frame - Inspired by The Ritz London */}
      <div className="absolute inset-16 border-[0.5px] border-[#B38728]/60 pointer-events-none hidden lg:block"></div>

      <div className="container relative mx-auto px-10 z-10">
        
        {/* Header Section: The Centered Crest */}
        <div className="flex flex-col items-center text-center mb-2">  
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.05em] uppercase mb-6 ">
            Explore <span className="font-serif  text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800">Our Flavors</span>
          </h1>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="w-12 h-[2px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700/80 self-center"></div>
              <Diamond className="text-amber-600 drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)] w-7 h-7" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700/80 self-center"></div>
            </div>
        </div>
          <div className="max-w-7xl mx-auto px-8 py-8 ">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
              
              {/* The Inquiry Section (Left) */}
              <div className="w-full md:w-3/5 lg:w-1/2">
                <div className="relative group">
                  <div className="flex flex-col ">                  
                    <div className="relative flex items-center">
                      {/* Minimalist Search SVG */}
                      <div className="absolute left-0">
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          className="w-5 h-5 text-stone-900 font-bold group-focus-within:text-[#B38728] transition-colors duration-500" 
                          stroke="currentColor" 
                          strokeWidth="1"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                      </div>

                      <input
                        type="text"
                        placeholder="Find your favorite ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent py-4 pl-10 text-stone-900 font-serif text-2xl placeholder-stone-800 focus:outline-none transition-all duration-700"
                      />

                      {/* Clear Button (appears only when searching) */}
                      {searchQuery && (
                        <button
                          onClick={handleClearSearch}
                          className="ml-4 p-2 text-stone-800 hover:text-[#B38728] transition-colors"
                          aria-label="Clear Search"
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Bottom Border with Gold Reveal */}
                    <div className="relative h-[1px] w-full bg-stone-600">
                      <div className="absolute  h-[2px] inset-0 bg-[#B38728] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000 origin-left" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider (Desktop Only) */}
              <div className="hidden md:block h-24 w-[1px] bg-stone-100"></div>

              {/* The Heritage Statement (Right) */}
              <div className="w-full md:w-1/3">
                <div className="border-l-2 border-[#B38728]/40 pl-6 py-2">
                  <p className="text-stone-800 font-serif  text-xl leading-relaxed">
                    "A refined collection of signature dishes, where every plate tells a story of heritage and season."
                  </p>
                  <span className="block mt-4 text-[12px] uppercase tracking-[0.3em] text-stone-700">
                    The Chef's Selection
                  </span>
                </div>
              </div>

            </div>
          </div>

        {/* Section Divider with Count */}
        <div className="flex items-center justify-between mb-16 px-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-stone-200"></div>
          <div className="px-8 text-[11px] tracking-[0.5em] uppercase text-stone-400 font-medium">
            {filteredMenus.length} DISHES TOTAL
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-stone-200"></div>
        </div>

        {/* Menu Grid: 3-Column Luxury Spacing */}
        {filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
            {filteredMenus.map((menu) => (
              <div key={menu._id} className="relative group">

                <MenuCard menu={menu} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8  max-w-4xl mx-auto relative group">

            <div className="mb-4 flex justify-center">
              <svg 
                viewBox="0 0 100 100" 
                className="w-56 h-56 text-stone-800 group-hover:text-[#B38728]/80 transition-colors duration-1000 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* The Cloche (Serving Dome) - Refined architectural curve */}
                <path d="M22 68C22 68 22 35 50 35C78 35 78 68 78 68" />
                
                {/* The Base Plate - Multi-layered for a "weighted" silver look */}
                <path d="M15 70H85" />
                <path d="M18 73H82" className="opacity-40" />
                
                {/* Regal Top Handle - Detailed ring design */}
                <circle cx="50" cy="31" r="2.5" />
                <path d="M48 33.5H52" />

                {/* Sophisticated Aroma Lines - Fine-line organic movement */}
                <path d="M42 20C42 20 44 16 46 16C48 16 50 20 50 20" className="opacity-30" />
                <path d="M50 18C50 18 52 14 54 14C56 14 58 18 58 18" className="opacity-20" />
              </svg>
            </div>

            <p className="relative z-10 text-stone-600  font-serif text-3xl mb-10">
              "The requested selection is currently out of season."
            </p>

            <button
              onClick={handleClearSearch}
              className="relative z-10 px-14 py-5 hover:bg-[#B38728] text-white text-[12px] tracking-[0.3em] font-bold uppercase bg-stone-900 transition-all duration-700 shadow-2xl hover:shadow-[#B38728]/20"
            >
              View Full Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Menu;
