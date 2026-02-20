import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MenuCard = ({ menu }) => {
  const { navigate, addToCart } = useContext(AppContext);

  return (
    <div className="group relative w-full bg-white border border-stone-200 flex flex-col">

      {/* TOP - Image Section (fixed height, clips nothing above, overflows upward on hover) */}
      <div className="relative h-[320px] overflow-visible">
        <div className="absolute cursor-pointer inset-0 ">
          <img
            src={menu.image}
            alt={menu.name}
            className="w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-4 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors " />
        </div>

        {/* Status Tag */}
        {!menu.isAvailable && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-white/90 backdrop-blur-md text-[10px] tracking-[0.3em] px-4 py-2 uppercase text-stone-500 font-medium border border-stone-100">
              Fully Committed
            </span>
          </div>
        )}
      </div>

      {/* BOTTOM - Text + Price Section (static, never moves) */}
      <div className="flex flex-col bg-white z-10">

        {/* Name & Description */}
        <div className="p-6 flex flex-col items-center text-center">
          <h3 className="text-2xl font-semibold font-serif text-stone-900 tracking-widest uppercase">
            {menu.name}
          </h3>
          <div className="w-24 h-[1.5px] bg-amber-500 mt-3 mb-4" />
          <p className="text-[15px] text-stone-700 leading-relaxed">
            {menu.description}
          </p>
        </div>

        {/* Price & Button */}
        <div className="border-t border-stone-100 pb-6 pt-2 px-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500 px-6 py-2.5">
              <p className="text-xl font-bold text-stone-900 font-serif">
                <span className="text-xs mr-1 font-sans">£</span>{menu.price}
              </p>
            </div>
            <button
              onClick={() => addToCart(menu._id)}
              disabled={!menu.isAvailable}
              className="group/btn cursor-pointer relative flex-1 flex items-center justify-center gap-2 py-4 bg-stone-900 text-white text-[11px] tracking-[0.15em] uppercase transition-all duration-500 hover:bg-[#C5A059] hover:text-stone-800 disabled:bg-stone-200"
            >
              <span className="font-bold">
                {menu.isAvailable ? "Add to Order" : "Reserved"}
              </span>
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
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MenuCard;