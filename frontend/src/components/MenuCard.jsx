import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ShoppingCart } from "lucide-react";
const MenuCard = ({ menu }) => {
  const { navigate, addToCart } = useContext(AppContext);
  return (
    <div className="group relative w-full h-[600px] bg-white overflow-hidden border border-stone-200 transition-all duration-700 ">
      
      {/* Full Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={menu.image}
          alt={menu.name}
          className="w-full h-full object-cover  "
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700"></div>
      </div>

      {/* Status Tag */}
      {!menu.isAvailable && (
        <div className="absolute top-6 left-6 z-20">
          <span className="bg-white/90 backdrop-blur-md text-[10px] tracking-[0.3em] px-4 py-2 uppercase text-stone-500 font-medium border border-stone-100">
            Fully Committed
          </span>
        </div>
      )}

      {/* Name - Always Visible at Bottom */}
      <div className="absolute bottom-[108px] left-0 w-full bg-white backdrop-blur-sm p-6 transition-all duration-700">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-2xl font-serif text-stone-900 tracking-widest uppercase">
            {menu.name}
          </h3>
          <div className="w-8 h-[1px] bg-amber-500 mt-3 transition-all duration-700 group-hover:w-24"></div>
        </div>
      </div>

      {/* Description - Only visible on hover (slides from below) */}
      <div className="absolute bottom-[108px] left-0 w-full bg-white p-5 pt-8 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
        <p className="text-[16px] text-stone-700 leading-relaxed text-center">
          {menu.description}
        </p>
      </div>

      {/* Price & Action - Always Visible with Gold Highlight */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-stone-100 py-8 px-4">
        <div className="flex items-center gap-6">
          {/* Gold Highlighted Price Section */}
          <div className="flex flex-col bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500 px-6 py-2.5 ">
            <p className="text-xl font-light text-stone-900 font-serif">
              <span className="text-xs mr-1 font-sans">£</span>{menu.price}
            </p>
          </div>

          {/* Gold Styled Add to Cart Button */}
            <button
              onClick={() => addToCart(menu._id)}
              disabled={!menu.isAvailable}
              className="group/btn relative flex-1 flex items-center justify-center gap-2 py-4 bg-stone-900 text-white text-[11px] tracking-[0.15em] uppercase transition-all duration-500 hover:bg-[#C5A059] hover:text-stone-800 disabled:bg-stone-200"
            >
              <span className="font-bold">{menu.isAvailable ? "Add to Order" : "Reserved"}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-transform duration-500 group-hover/btn:translate-x-1"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
        </div>
      </div>
    </div>
  );
};
export default MenuCard;
