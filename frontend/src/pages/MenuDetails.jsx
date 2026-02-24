import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ArrowLeft, ShoppingCart, Minus, Plus, Tag, Award } from "lucide-react";

const MenuDetails = () => {
  const { id } = useParams();
  const { menus, navigate, addToCart } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);

  const menu = menus?.find((item) => item._id === id);

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-[#1A1A1A] mb-4">Dish Not Found</h2>
          <button onClick={() => navigate("/menu")} className="text-[#C5A059] border-b border-[#C5A059] pb-1">Return to Menu</button>
        </div>
      </div>
    );
  }

  const totalPrice = (menu.price * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] pb-20">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#C5A059] transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-[0.2em] text-sm font-bold">Back to Selection</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: Image Section */}
          <div className="lg:col-span-7">
            <div className="relative group overflow-hidden rounded-sm shadow-2xl">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-0 left-0 w-full h-full border-[12px] border-white/10 pointer-events-none"></div>
              {menu.isAvailable && (
                <div className="absolute top-6 left-6 bg-[#C5A059] text-white px-6 py-1 tracking-[0.1em] text-xs font-bold uppercase">
                  Available Today
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Details Section */}
          <div className="lg:col-span-5 space-y-8">
            <header className="border-b border-gray-200 pb-8">
              <span className="text-[#C5A059] font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
                {menu.category?.name || "Fine Dining"}
              </span>
              <h1 className="text-5xl font-serif leading-tight mb-4">{menu.name}</h1>
              <p className="text-2xl font-light text-[#1A1A1A] tracking-tight">${menu.price.toFixed(2)}</p>
            </header>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="uppercase tracking-[0.2em] text-xs font-black text-gray-400">Description</h3>
              <p className="text-lg leading-relaxed font-medium text-gray-800">
                {menu.description}
              </p>
            </div>

            {/* Offers from Data */}
            {menu.offers?.length > 0 && (
              <div className="space-y-4">
                <h3 className="uppercase tracking-[0.2em] text-xs font-black text-gray-400">Exclusive Offers</h3>
                <div className="grid gap-3">
                  {menu.offers.map((offer) => (
                    <div key={offer._id} className="flex items-center gap-4 p-4 border border-[#C5A059]/30 bg-[#C5A059]/5 rounded-sm">
                      <Tag className="w-5 h-5 text-[#C5A059]" />
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wider">{offer.title}</p>
                        <p className="text-xs text-gray-600 font-medium">{offer.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Checkout */}
            <div className="bg-white border border-gray-100 p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-widest text-sm text-gray-500">Quantity</span>
                <div className="flex items-center border border-gray-300">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  ><Minus className="w-4 h-4" /></button>
                  <span className="px-6 font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  ><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Est.</span>
                  <span className="text-4xl font-serif text-[#C5A059]">${totalPrice}</span>
                </div>

                <button
                  disabled={!menu.isAvailable}
                  onClick={() => addToCart(menu._id, quantity)}
                  className={`w-full py-5 rounded-none font-bold tracking-[0.2em] uppercase text-sm transition-all duration-500 flex items-center justify-center gap-3 ${
                    menu.isAvailable
                      ? "bg-[#1A1A1A] text-white hover:bg-[#C5A059] shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {menu.isAvailable ? "Reserve for Order" : "Currently Unavailable"}
                </button>
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="flex items-center gap-6 pt-4 grayscale opacity-70">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Premium Grade Ingredients</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Hand-crafted at Blackpepper</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;