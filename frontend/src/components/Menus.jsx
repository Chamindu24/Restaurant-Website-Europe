import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MenuCard from "./MenuCard";

const Menus = () => {
  const { menus } = useContext(AppContext);
  return (
    <section
      className="relative z-10 min-h-screen py-24 bg-repeat"
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

          <h2 className="text-6xl md:text-8xl font-serif text-stone-900 mb-8 tracking-tighter">
            Our <span className="italic font-light text-stone-400">Culinary</span> <span className="text-[#C5A059]">Legacy</span>
          </h2>
          
          <div className="max-w-2xl mx-auto relative">
            {/* Quote marks for a literary feel */}
            <span className="absolute -top-4 -left-8 text-6xl text-stone-100 font-serif">“</span>
            <p className="text-stone-500 font-serif italic text-xl leading-relaxed">
              A grand tour of twelve curated chapters, showcasing the finest 
              seasonal harvests from across the United Kingdom.
            </p>
            <span className="absolute -bottom-8 -right-8 text-6xl text-stone-100 font-serif">”</span>
          </div>
        </div>

        {/* The 12 Categories Grid - Refined to 3 columns for Premium impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {menus.map((menu, index) => (
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


      </div>
    </section>
  );
};
export default Menus;
