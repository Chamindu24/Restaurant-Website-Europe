import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  Minus,
  Plus,
  X,
  Tag,
  ChevronDown,
  UtensilsCrossed,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  calculateOffersWithDiscounts,
  getBestOffer,
  getApplicableOffers,
} from "../utils/offerCalculations";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, user, navigate, offers } =
    useContext(AppContext);
  const [expandedOffers, setExpandedOffers] = useState({});

  const items = cart?.items || [];

  const toggleOfferExpand = (itemId) => {
    setExpandedOffers((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const applicableOffers = getApplicableOffers(item.menuItem, offers);
      const bestOffer = getBestOffer(
        item.menuItem.price,
        item.quantity,
        applicableOffers
      );

      subtotal += item.menuItem.price * item.quantity;
      totalDiscount += bestOffer ? bestOffer.discountAmount : 0;
    });

    return {
      subtotal,
      totalDiscount,
      grandTotal: Math.max(0, subtotal - totalDiscount),
    };
  };

  const { subtotal, totalDiscount, grandTotal } = calculateTotals();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to proceed with checkout.");
      onClose();
      navigate("/signup");
      return;
    }

    onClose();
    navigate("/checkout");
  };

  const handleViewMenu = () => {
    onClose();
    navigate("/menu");
  };

  return (
    <div
      className={`fixed inset-0 z-120 transition-opacity duration-700 ease-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none delay-300"
      }`}
    >
      <div 
        className={`absolute inset-0 bg-black/35 transition-all duration-1000 ease-out ${
          isOpen ? "backdrop-blur-[2px] opacity-100" : "backdrop-blur-none opacity-0"
        }`} 
        onClick={onClose} 
      />

      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-[#FFFCF9] border-l border-[#E5D9C6] shadow-2xl flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isOpen ? "translate-x-0 scale-100 opacity-100" : "translate-x-20 scale-95 opacity-0"
        }`}
      >
        <div className={`h-16 px-6 border-b border-[#E8E1D9] flex items-center justify-between bg-[#ffffff] transition-all duration-700 delay-100 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}>
          <div>

            <h3 className="text-2xl font-serif font-semibold italic text-[#1A1A1A] leading-none mt-1">
              The Order Hub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors duration-300"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={`flex-1 flex flex-col items-center justify-center bg-[#FFFCF9] px-6 text-center relative overflow-hidden transition-all duration-700 delay-200 ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}>
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#A68966] opacity-30 m-4" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#A68966] opacity-30 m-4" />

            <div className="relative inline-block mb-7">
              <UtensilsCrossed size={44} strokeWidth={1} className="text-[#A68966] mb-2" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-px bg-[#A68966]" />
            </div>

            <p className="text-[#1A1A1A] font-serif text-3xl italic mb-4">Your Order Awaits</p>
            <p className="text-[#8C7E6A] font-medium text-[11px] uppercase tracking-[0.3em] leading-loose max-w-sm mx-auto mb-8">
              Your meal is ready <br /> to be customized.
            </p>

            <button
              onClick={handleViewMenu}
              className="px-8 py-4 bg-[#1A1A1A] text-white hover:bg-[#A68966] hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">
                View The Full Menu
              </span>
            </button>
          </div>
        ) : (
          <>
            <div className={`flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#FFFCF9] transition-all duration-700 delay-150 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              {items.map((item, index) => {
                const applicableOffers = getApplicableOffers(item.menuItem, offers);
                const offersWithValues = calculateOffersWithDiscounts(
                  item.menuItem.price,
                  item.quantity,
                  applicableOffers
                );
                const bestOffer = offersWithValues.length > 0 ? offersWithValues[0] : null;
                const itemSubtotal = item.menuItem.price * item.quantity;
                const itemDiscount = bestOffer ? bestOffer.discountAmount : 0;
                const itemTotal = itemSubtotal - itemDiscount;
                const discountedPrice = bestOffer
                  ? bestOffer.discountedPrice
                  : item.menuItem.price;
                const isExpanded = expandedOffers[item._id];

                return (
                  <div
                    key={item._id}
                    className={`border-b-2 border-[#E8E1D9] pb-6 flex gap-4 items-start transition-all duration-500 ease-out ${
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${150 + index * 80}ms` }}
                  >
                    <div className="relative w-28 sm:w-32 md:w-36 lg:w-40 aspect-square overflow-hidden bg-[#F9F7F5] border border-[#E8E1D9] group/img">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-110"
                      />
                      {offersWithValues.length > 0 && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-1">
                          <Tag size={10} />
                          {offersWithValues.length > 1
                            ? `${offersWithValues.length} Offers`
                            : "1 Offer"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xl font-serif text-[#1A1A1A] font-bold leading-tight truncate">
                            {item.menuItem.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-[#A68966] font-medium mt-1 mb-2">
                            Individual Portion
                          </p>

                          <div className="flex items-center gap-2 mb-2">
                            {bestOffer ? (
                              <>
                                <span className="text-[11px] font-bold text-green-600 uppercase tracking-widest">
                                  £{discountedPrice.toFixed(2)}
                                </span>
                                <span className="line-through text-[#999] text-[10px]">
                                  £{item.menuItem.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-[11px] font-bold text-[#A68966] uppercase tracking-widest">
                                £{item.menuItem.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {offersWithValues.length > 0 && (
                            <div className="space-y-2 mb-2">
                              <div className="bg-green-50 border border-green-200 p-2 rounded">
                                <p className="text-[10px] text-green-700 font-bold uppercase">
                                  Best Offer: {bestOffer.title}
                                </p>
                                <p className="text-[11px] text-red-600 font-semibold">
                                  Save £{bestOffer.discountAmount.toFixed(2)} (
                                  {bestOffer.offerType === "percentage"
                                    ? `${bestOffer.discountValue}%`
                                    : "Fixed"}
                                  )
                                </p>
                              </div>

                              {offersWithValues.length > 1 && (
                                <button
                                  onClick={() => toggleOfferExpand(item._id)}
                                  className="flex items-center gap-1 text-[11px] font-semibold text-[#A68966] hover:text-[#1A1A1A] hover:gap-2 transition-all duration-300 ease-out"
                                >
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-500 ease-out ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                  />
                                  {isExpanded
                                    ? "Hide Other Offers"
                                    : `See All ${offersWithValues.length - 1} Offers`}
                                </button>
                              )}

                              {isExpanded && offersWithValues.length > 1 && (
                                <div className="bg-[#FBF9F6] border border-[#E8E1D9] p-2 rounded space-y-2 mt-2 opacity-0 translate-y-[-10px] animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                                  {offersWithValues.slice(1).map((offer, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-start text-xs p-2 bg-white rounded border border-[#E8E1D9] hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-out"
                                    >
                                      <div>
                                        <p className="font-semibold text-[#1A1A1A]">
                                          {offer.title}
                                        </p>
                                        <p className="text-[#666]">
                                          {offer.offerType === "percentage"
                                            ? `${offer.discountValue}%`
                                            : `£${offer.discountValue}`}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-green-600">
                                          Save £{offer.discountAmount.toFixed(2)}
                                        </p>
                                        <p className="text-[#999]">
                                          → £{offer.discountedPrice.toFixed(2)}
                                        </p>
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
                          className="text-[#1A1A1A] opacity-80 hover:text-red-700 hover:opacity-100 hover:scale-110 transition-all duration-300 ease-out"
                          aria-label="Remove item"
                        >
                          <X size={18} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        <div className="flex items-center border border-[#E8E1D9] px-3 py-1.5 bg-[#ffffff] gap-3">
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="disabled:opacity-20 hover:scale-110 cursor-pointer  transition-all duration-300 ease-out"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-serif font-semibold italic text-base w-4 text-center text-[#1A1A1A]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                            className="hover:scale-110 cursor-pointer   transition-all duration-300 ease-out"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-[#A68966] uppercase tracking-widest mb-1">
                            Total Selection
                          </span>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xl font-medium text-[#1A1A1A]">
                              £{itemTotal.toFixed(2)}
                            </span>
                            {bestOffer && (
                              <span className="text-xs text-red-500 font-semibold">
                                You save £{itemDiscount.toFixed(2)}
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

            <div className={` bg-[#ffffff] p-6 space-y-4 transition-all duration-700 delay-200 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className="flex justify-between px-3  font-semibold text-sm text-[#666]">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between border border-red-200 font-semibold text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                  <span className="flex items-center gap-2">
                    <Tag size={14} />
                    Total Discount
                  </span>
                  <span>-£{totalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-4 mt-4 border-t-2 px-3  border-[#E8E1D9] font-semibold flex justify-between items-baseline">
                <span className="text-xl  font-serif italic text-[#1A1A1A]">
                  Grand Total
                </span>
                <span className="text-4xl font-semibold font-serif text-[#1A1A1A]">
                  £{grandTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#1A1A1A] text-white py-4 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#b77e3a] hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;