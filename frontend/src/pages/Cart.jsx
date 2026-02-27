import { useContext, useState } from "react"; 
import { AppContext } from "../context/AppContext";
import { Minus, Plus, UtensilsCrossed, X, Tag, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import {
  calculateOffersWithDiscounts,
  getBestOffer,
  getApplicableOffers,
} from "../utils/offerCalculations";

const Cart = () => {
  const { cart, navigate, removeFromCart, updateQuantity, user, offers } =
    useContext(AppContext);
  
  const [expandedOffers, setExpandedOffers] = useState({});

  // Toggle offer expansion
  const toggleOfferExpand = (itemId) => {
    setExpandedOffers((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Calculate totals using the offer engine
  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;

    cart.items.forEach((item) => {
      const applicableOffers = getApplicableOffers(item.menuItem, offers);
      const bestOffer = getBestOffer(item.menuItem.price, item.quantity, applicableOffers);
      
      const itemSubtotal = item.menuItem.price * item.quantity;
      const discount = bestOffer ? bestOffer.discountAmount : 0;
      
      subtotal += itemSubtotal;
      totalDiscount += discount;
    });

    return {
      subtotal,
      totalDiscount,
      grandTotal: Math.max(0, subtotal - totalDiscount),
    };
  };

  const { subtotal, totalDiscount, grandTotal } = calculateTotals();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-[#FFFCF9] border border-[#E5D9C6] mx-auto max-w-4xl my-12 shadow-sm relative overflow-hidden">
        
        {/* Corner Accents (Optional for that Royal vibe) */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#A68966] opacity-30 m-4"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#A68966] opacity-30 m-4"></div>

        {/* Visual Centerpiece */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Delicate, thin-stroke icon */}
            <UtensilsCrossed size={48} strokeWidth={1} className="text-[#A68966] mb-2" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-px bg-[#A68966]"></div>
          </div>
        </div>

        {/* Typography Suite */}
        <div className="text-center px-6">
          <h2 className="text-4xl font-serif font-medium italic text-[#1A1A1A] mb-4 tracking-tight">
            Your Order Awaits
          </h2>
          
          <p className="text-[#8C7E6A] font-medium text-[11px] uppercase tracking-[0.3em]  leading-loose max-w-sm mx-auto">
            Your meal is ready <br /> to be customized.
          </p>
        </div>

        {/* The "Menu" Button */}
        <div className="mt-12">
          <button 
            onClick={() => navigate("/menu")}
            className="px-10 py-4 bg-[#1A1A1A] text-white hover:bg-[#A68966] transition-all duration-500 shadow-xl group"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold">
              View The Full Menu
            </span>
          </button>
        </div>
      </div>
    );
  }

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error("Please log in to proceed with checkout.");
      navigate("/signup");
      return;
    }
    navigate("/checkout");
  };

  return (
    
    <div className=" mt-16 px-4 mb-24">
      {/* Royal Header Section */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.5em] text-[#A68966] uppercase mb-4 block font-bold">
          Your Handpicked Choices
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A1A1A] italic">
          The Order Hub
        </h1>
        <div className="w-24 h-0.5 bg-[#A68966] mx-auto mt-6 opacity-90"></div>
      </div>

      <div className="max-w-7xl  mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Items Gallery (Left Side) */}
        <div className="lg:col-span-8 space-y-12">
          {cart.items.map((item) => {
            // Get applicable offers for this item
            const applicableOffers = getApplicableOffers(item.menuItem, offers);
            const offersWithValues = calculateOffersWithDiscounts(
              item.menuItem.price, 
              item.quantity, 
              applicableOffers
            );
            const bestOffer = offersWithValues.length > 0 ? offersWithValues[0] : null;
            
            // Calculate item totals
            const itemSubtotal = item.menuItem.price * item.quantity;
            const discount = bestOffer ? bestOffer.discountAmount : 0;
            const itemTotal = itemSubtotal - discount;
            const discountedPrice = bestOffer ? bestOffer.discountedPrice : item.menuItem.price;
            
            const isExpanded = expandedOffers[item._id];
            
            return (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row gap-8 pb-10 border-b-2 border-[#E8E1D9] items-start group"
            >
              {/* Elegant Framed Image */}
              <div className="relative w-full sm:w-48 aspect-square overflow-hidden bg-[#F9F7F5] border border-[#E8E1D9] rounded-sm">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-full h-full object-cover transition-transform "
                />
                {/* Offer Badge - Shows count if multiple */}
                {offersWithValues.length > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center gap-1">
                    <Tag size={12} />
                    {offersWithValues.length > 1 
                      ? `${offersWithValues.length} Offers` 
                      : "1 Offer"}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between self-stretch py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-serif text-[#1A1A1A] font-bold mb-1 leading-tight tracking-tight">
                        {item.menuItem.name}
                      </h3>
                      <p className="text-[12px] uppercase tracking-widest text-[#A68966] font-medium mb-4">
                        Individual Portion
                      </p>
                      
                      {/* Price Display with Best Offer */}
                      <div className="flex items-center gap-3 mb-2">
                        {bestOffer ? (
                          <>
                            <span className="text-[12px] font-bold text-green-600 uppercase tracking-widest">
                              £{discountedPrice.toFixed(2)}
                            </span>
                            <span className="line-through text-[#999] text-[11px]">
                              £{item.menuItem.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-[12px] font-bold text-[#A68966] uppercase tracking-widest">
                            £{item.menuItem.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Offers Section */}
                      {offersWithValues.length > 0 && (
                        <div className="space-y-2">
                          {/* Best Offer Highlight */}
                          <div className="bg-green-50 border border-green-200 p-2 rounded">
                            <p className="text-[10px] text-green-700 font-bold uppercase">
                              Best Offer: {bestOffer.title}
                            </p>
                            <p className="text-[11px] text-red-600 font-semibold">
                              Save £{bestOffer.discountAmount.toFixed(2)} ({bestOffer.offerType === "percentage" ? `${bestOffer.discountValue}%` : 'Fixed'})
                            </p>
                          </div>

                          {/* Show All Offers Toggle */}
                          {offersWithValues.length > 1 && (
                            <button
                              onClick={() => toggleOfferExpand(item._id)}
                              className="flex items-center gap-1 text-[11px] font-semibold text-[#A68966] hover:text-[#1A1A1A] transition-colors"
                            >
                              <ChevronDown
                                size={14}
                                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                              {isExpanded ? "Hide Other Offers" : `See All ${offersWithValues.length - 1} Offers`}
                            </button>
                          )}

                          {/* All Offers List */}
                          {isExpanded && offersWithValues.length > 1 && (
                            <div className="bg-[#FBF9F6] border border-[#E8E1D9] p-3 rounded space-y-2 mt-2">
                              {offersWithValues.slice(1).map((offer, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-start text-xs p-2 bg-white rounded border border-[#E8E1D9]"
                                >
                                  <div>
                                    <p className="font-semibold text-[#1A1A1A]">{offer.title}</p>
                                    <p className="text-[#666]">{offer.offerType === "percentage" ? `${offer.discountValue}%` : `£${offer.discountValue}`}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-green-600">Save £{offer.discountAmount.toFixed(2)}</p>
                                    <p className="text-[#999]">→ £{offer.discountedPrice.toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.menuItem._id)}
                      className="text-[#1A1A1A] opacity-90 hover:opacity-100 hover:text-red-700 transition-all p-1 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <X size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  {/* Minimalist Quantity Toggle */}
                  <div className="flex items-center space-x-6 border border-[#E8E1D9] px-4 py-2 bg-white ">
                    <button
                      onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                      className="text-[#1A1A1A] cursor-pointer hover:scale-110 transition-transform disabled:opacity-20"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-serif font-semibold italic text-xl w-4 text-center text-[#1A1A1A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                      className="text-[#1A1A1A] cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Pricing Logic Fixed */}
                  <div className="text-right">
                    <span className="block text-[12px] font-bold text-[#A68966] uppercase tracking-widest mb-1">
                      Total Selection
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-2xl font-medium text-[#1A1A1A]">
                        £{itemTotal.toFixed(2)}
                      </span>
                      {bestOffer && (
                        <span className="text-xs text-red-500 font-semibold">
                          You save £{discount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Order Summary (Right Side / Sidebar) */}
        <div className="lg:col-span-4">
          <div className="bg-[#FBF9F6] border border-[#E8E1D9] p-8 sticky top-20">
            <h4 className="text-sm uppercase tracking-[0.3em] font-semibold text-[#1A1A1A] mb-8 border-b-2 border-[#E8E1D9] pb-4">
              Order Summary
            </h4>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between font-semibold text-sm text-[#666]">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between font-semibold text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                  <span className="flex items-center gap-2">
                    <Tag size={14} />
                    Total Discount
                  </span>
                  <span>-£{totalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-6 mt-6 border-t-2 border-[#E8E1D9] font-semibold flex justify-between items-baseline">
                <span className="text-lg font-serif italic text-[#1A1A1A]">Grand Total</span>
                <span className="text-3xl font-light text-[#1A1A1A]">£{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full bg-[#1A1A1A] cursor-pointer text-white py-5 group relative overflow-hidden transition-all hover:scale-105 duration-500 hover:bg-[#b77e3a]"
            >
              <span className="relative z-10 text-[11px] uppercase tracking-[0.2em] font-semibold">
                Proceed to Checkout
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
