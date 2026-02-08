import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate, categories } = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative  z-10  min-h-screen bg-[#FDFCFB] flex items-center overflow-hidden rounded-t-4xl transition-colors duration-700">
      
      {/* --- DYNAMIC FULL-SCREEN BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {categories.map((cat, index) => (
          <div
            key={cat._id + "-bg"}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
              activeIndex === index ? "opacity-30 scale-80" : "opacity-0 scale-110"
            }`}
          >
            <img
              src={cat.image}
              alt=""
              className="w-full h-full object-cover grayscale-[30%]"
            />
          </div>
        ))}
        {/* The "Light Mode" Filter: This makes it feel like a premium restaurant menu */}
        <div className="absolute inset-0 bg-[#F7F5F2]/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10 py-16">
<header className="mb-32 relative">
  <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
    
    {/* Row 1: Monolithic Branding */}
    <div className="relative group">
      {/* Decorative Shadow Text */}
      <h2 className="absolute -top-10 -left-4 text-[7rem] font-serif text-stone-100/40 select-none pointer-events-none italic">
        The
      </h2>
      
      <h1 className="relative text-7xl md:text-9xl font-serif text-stone-900 leading-[0.8] tracking-tighter">
        Menu <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 italic font-light">
          Categories
        </span>
      </h1>
    </div>

    {/* Row 2: Professional Meta-Data Block */}
    <div className="max-w-xs w-full lg:mt-4">
      <div className="border-t border-stone-200 pt-8 space-y-8">
        <div>
          <h4 className="text-stone-900 text-[11px] uppercase tracking-[0.3em] font-bold mb-3">
            Selection
          </h4>
          <p className="text-stone-500 font-serif italic text-lg leading-relaxed">
            "A curated list of twelve signature choices, 
            prepared fresh for the London season."
          </p>
        </div>

        <button 
          onClick={() => navigate('/menu')}
          className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-stone-800 font-bold hover:text-amber-700 transition-colors"
        >
          <span>View Menu</span>
          <div className="w-8 h-[1px] bg-stone-800 group-hover:w-12 group-hover:bg-amber-700 transition-all"></div>
        </button>
      </div>
    </div>

  </div>
</header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: The Interactive Menu (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] w-12 bg-amber-600/40"></div>
              <span className="text-amber-800 uppercase tracking-[0.4em] text-[11px] font-semibold">
                Discover Our Culinaria
              </span>
            </div>
            
            <nav className="flex flex-col items-start gap-1">
              {categories.slice(0, 12).map((cat, index) => (
                <button
                  key={cat._id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigate(`/menu/${cat.name}`)}
                  className="group relative flex items-baseline gap-6 py-3 text-left w-full border-b border-stone-100 last:border-0"
                >
                  {/* Numbering */}
                  <span className={`text-[10px] font-sans tracking-widest transition-all duration-500 ${
                    activeIndex === index ? "text-amber-600" : "text-stone-300"
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Category Name */}
                  <h3 className={`text-3xl md:text-5xl font-serif transition-all duration-700 ease-out ${
                    activeIndex === index 
                    ? "text-stone-900 translate-x-2" 
                    : "text-stone-400 group-hover:text-stone-600"
                  }`}>
                    {cat.name}
                  </h3>

                  {/* Hover Accent */}
                  <div className={`ml-auto h-[2px] bg-amber-600 transition-all duration-500 ease-in-out ${
                    activeIndex === index ? "w-24 opacity-100" : "w-0 opacity-0"
                  }`}></div>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side: Large Architectural Square Frame (Col 8-12) */}
          <div className="hidden lg:flex lg:col-span-5 relative justify-center items-center h-full">
            {/* The Floating Frame Border */}
            <div className="absolute w-[85%] h-[70%] border border-amber-600/20 translate-x-6 -translate-y-6 z-0"></div>
            
            {/* The Main Image Container */}
            <div className="relative w-full aspect-square  shadow-[20px_20px_60px_rgba(0,0,0,0.01)] overflow-hidden z-10">
              {categories.map((cat, index) => (
                <div
                  key={cat._id + "-img"}
                  className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    activeIndex === index 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-110 rotate-1"
                  }`}
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Soft Gradient Overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
                </div>
              ))}
            </div>


          </div>

        </div>
      </div>


    </section>
  );
};

export default Categories;