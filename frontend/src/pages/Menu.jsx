import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Diamond, X } from "lucide-react";
import MenuCard from "../components/MenuCard";
import { useSearchParams } from "react-router-dom";

const Menu = () => {
  const { menus, categories } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredMenus, setFilteredMenus] = useState([]);

  // Initialize selectedCategory from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = menus;

    // Filter by search query
    if (searchQuery !== "") {
      filtered = filtered.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "") {
      filtered = filtered.filter((menu) => {
        // Handle both cases: category as string ID or as object with _id
        const menuCategoryId =
          typeof menu.category === "string" ? menu.category : menu.category?._id;
        return menuCategoryId === selectedCategory;
      });
    }

    setFilteredMenus(filtered);
  }, [searchQuery, selectedCategory, menus]);

  const handleClearSearch = () => setSearchQuery("");

  return (
    <div
      className="relative min-h-screen bg-[#FDF6F0] py-16 md:py-28"
      style={{
        backgroundImage: "url('/menubg.jpg')",
        backgroundSize: "500px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Royal Vellum Overlay */}
      <div className="absolute inset-0 bg-[#fdfcf9]/92 backdrop-blur-[1px]"></div>

      {/* Decorative borders — desktop only */}
      <div className="absolute inset-6 border border-[#d4af37]/10 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-10 border border-[#d4af37]/20 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-16 border-[0.5px] border-[#B38728]/60 pointer-events-none hidden lg:block"></div>

      <div className="container relative mx-auto px-4 sm:px-6 z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-2">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.05em] uppercase mb-5 md:mb-6">
            Explore{" "}
            <span className="font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800">
              Our Flavors
            </span>
          </h1>
          <div className="flex justify-center space-x-4 mb-4">
            <div className="w-10 md:w-12 h-[2px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700/80 self-center"></div>
            <Diamond className="text-amber-600 drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)] w-6 h-6 md:w-7 md:h-7" />
            <div className="w-10 md:w-12 h-[2px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700/80 self-center"></div>
          </div>
        </div>

      {/* Search + Tagline + Category Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 md:gap-16">
          
          {/* Search Input - Refined Alignment */}
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              <div className="flex flex-col">
                <div className="relative flex items-center">
                  <div className="absolute left-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5 text-stone-600 group-focus-within:text-[#B38728] transition-colors duration-500"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    placeholder="Search our menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent py-4 pl-10 text-stone-900 font-semibold font-serif text-xl md:text-3xl placeholder-stone-600 focus:outline-none transition-all duration-700"
                  />

                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="ml-4 p-2 text-stone-400 hover:text-[#B38728] transition-colors"
                      aria-label="Clear Search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Animated Underline */}
                <div className="relative h-[1px] w-full bg-stone-800">
                  <div className="absolute h-[1px] inset-0 bg-[#B38728] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000 origin-left" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter - Professional Minimalist Select */}
          {categories && categories.length > 0 && (
            <div className="w-full lg:w-1/3 flex flex-col gap-2">
              <label className="text-[12px] uppercase tracking-[0.3em] text-stone-600 font-semibold">
                Select Category
              </label>
              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-transparent border-b-2 border-stone-800 py-4 pr-10 text-stone-800 font-serif font-semibold text-lg md:text-xl focus:outline-none focus:border-[#B38728] transition-all duration-500 cursor-pointer"
                >
                  <option value="" className="text-stone-900 font-semibold">All Collections</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="text-stone-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
                
                {/* Custom Chevron for the Select */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-800 group-hover:text-[#B38728] transition-colors duration-300">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>



        {/* Dish Count Divider */}
        <div className="flex items-center justify-between mb-10 md:mb-16 px-2 md:px-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-stone-200"></div>
          <div className="px-4 md:px-8 text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-stone-400 font-medium whitespace-nowrap">
            {filteredMenus.length} {filteredMenus.length === 1 ? "Dish" : "Dishes"}
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-stone-200"></div>
        </div>

        {/* Menu Grid */}
        {filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-y-24 gap-x-6 md:gap-x-12">
            {filteredMenus.map((menu) => (
              <div key={menu._id} className="relative group">
                <MenuCard menu={menu} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-8 max-w-4xl mx-auto relative group">
            <div className="mb-4 flex justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-36 h-36 md:w-56 md:h-56 text-stone-800 group-hover:text-[#B38728]/80 transition-colors duration-1000 relative z-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 68C22 68 22 35 50 35C78 35 78 68 78 68" />
                <path d="M15 70H85" />
                <path d="M18 73H82" className="opacity-40" />
                <circle cx="50" cy="31" r="2.5" />
                <path d="M48 33.5H52" />
                <path d="M42 20C42 20 44 16 46 16C48 16 50 20 50 20" className="opacity-30" />
                <path d="M50 18C50 18 52 14 54 14C56 14 58 18 58 18" className="opacity-20" />
              </svg>
            </div>

            <p className="relative z-10 text-stone-600 font-serif text-xl sm:text-2xl md:text-3xl mb-8 md:mb-10 px-4">
              {searchQuery || selectedCategory
                ? "No dishes match your filters."
                : "The requested selection is currently out of season."}
            </p>

            <div className="relative z-10 flex flex-col gap-3 items-center">
              {(searchQuery || selectedCategory) && (
                <p className="text-stone-500 text-sm md:text-base">
                  {searchQuery && selectedCategory
                    ? "Try adjusting your search or category selection"
                    : searchQuery
                    ? "Try adjusting your search query"
                    : "Try selecting a different category"}
                </p>
              )}
              <button
                onClick={() => {
                  handleClearSearch();
                  setSelectedCategory("");
                }}
                className="px-10 md:px-14 py-4 md:py-5 hover:bg-[#B38728] text-white text-[11px] md:text-[12px] tracking-[0.3em] font-bold uppercase bg-stone-900 transition-all duration-700 shadow-2xl hover:shadow-[#B38728]/20"
              >
                View Full Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;