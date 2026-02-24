import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate, categories } = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!categories.length) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 4500);

    return () => clearInterval(intervalId);
  }, [categories.length]);

  return (
    <section className="relative z-10 min-h-screen bg-[#FDFCFB] flex items-center overflow-hidden rounded-t-3xl md:rounded-t-3xl lg:rounded-t-4xl transition-colors duration-700">

      {/* --- DYNAMIC FULL-SCREEN BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {categories.map((cat, index) => (
          <div
            key={cat._id + "-bg"}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
              activeIndex === index ? "opacity-50 scale-60" : "opacity-0 scale-110"
            }`}
          >
            <img
              src={cat.image}
              alt=""
              className="w-full h-full object-cover grayscale-[30%]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[#F7F5F2]/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mt-16 md:mt-20 mx-auto px-4 sm:px-6 md:px-8 relative z-10 py-10 md:py-16">

        {/* Header */}
        <header className="mb-12 md:mb-28 relative max-w-[1300px] mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center border-b border-stone-100 pb-4">
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-light tracking-[0.05em] uppercase mb-4 md:mb-8">
              Signature
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700">
                &nbsp;Categories
              </span>
            </h1>
          </div>

          <div className="text-center px-0 md:px-2 mt-4 md:mt-0">
            <p className="text-stone-600 font-semibold tracking-wide font-serif italic text-base sm:text-lg md:text-2xl leading-relaxed">
              "Our menu is divided into carefully selected categories, making it easy for every guest to explore a variety of flavors, discover something new, and find dishes they'll truly love."
            </p>
          </div>
        </header>

        {/* Mobile: Image preview strip */}
        <div className="lg:hidden mb-8 relative w-full aspect-[4/3] sm:aspect-video overflow-hidden shadow-md">
          {categories.map((cat, index) => (
            <div
              key={cat._id + "-mob-img"}
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
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent"></div>
              {/* Active category label overlay */}
              <div className="absolute bottom-4 left-4">
                <span className="text-white/60 font-sans text-xs tracking-widest uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-white font-serif text-2xl font-semibold">
                  {cat.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-0 lg:px-2 lg:mr-28 items-center">

          {/* Left Side: Interactive Menu */}
          <div className="lg:col-span-7 flex flex-col">
            <nav className="flex flex-col items-start gap-0">
              {categories.slice(0, 12).map((cat, index) => (
                <button
                  key={cat._id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onTouchStart={() => setActiveIndex(index)}
                  onClick={() => navigate(`/menu?category=${cat._id}`)}
                  className="group relative flex cursor-pointer items-baseline gap-4 md:gap-6 py-2.5 md:py-3 text-left w-full border-b border-stone-100 last:border-0"
                >
                  {/* Numbering */}
                  <span
                    className={`text-[13px] md:text-[16px] font-sans tracking-widest transition-all duration-500 flex-shrink-0 ${
                      activeIndex === index ? "text-amber-600" : "text-stone-400"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Category Name */}
                  <h3
                    className={`text-2xl sm:text-3xl md:text-5xl font-serif transition-all duration-700 ease-out ${
                      activeIndex === index
                        ? "text-stone-900 font-semibold translate-x-1 md:translate-x-2"
                        : "text-stone-500 group-hover:text-stone-600"
                    }`}
                  >
                    {cat.name}
                  </h3>

                  {/* Hover Accent Line */}
                  <div
                    className={`ml-auto h-[2px] bg-amber-600 transition-all duration-500 ease-in-out flex-shrink-0 ${
                      activeIndex === index ? "w-12 md:w-24 opacity-100" : "w-0 opacity-0"
                    }`}
                  ></div>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side: Large Image (desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 relative justify-center items-center h-full">
            {/* Floating Frame Border */}
            <div className="absolute w-[85%] h-[70%] border border-amber-600/20 translate-x-6 -translate-y-6 z-0"></div>

            {/* Main Image Container */}
            <div className="relative w-full aspect-square shadow-[20px_20px_60px_rgba(0,0,0,0.01)] overflow-hidden z-10">
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