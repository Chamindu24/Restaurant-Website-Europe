import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Pencil, Tag } from "lucide-react";
import {
  getBestOffer,
  getApplicableOffers,
} from "../utils/offerCalculations";

const Checkout = () => {
  const { cart, axios, navigate, user, fetchCartData, offers } = useContext(AppContext);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pay at hotel");

  // Calculate totals with discounts using offer engine
  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;

    if (cart?.items && cart.items.length > 0) {
      cart.items.forEach((item) => {
        const applicableOffers = getApplicableOffers(item.menuItem, offers);
        const bestOffer = getBestOffer(item.menuItem.price, item.quantity, applicableOffers);
        
        const itemSubtotal = item.menuItem.price * item.quantity;
        const discount = bestOffer ? bestOffer.discountAmount : 0;
        
        subtotal += itemSubtotal;
        totalDiscount += discount;
      });
    }

    return {
      subtotal,
      totalDiscount,
      grandTotal: Math.max(0, subtotal - totalDiscount),
    };
  };

  const { subtotal, totalDiscount, grandTotal } = calculateTotals();

  useEffect(() => {
    if (user && !address) {
      const fallbackAddress = [user.address, user.city].filter(Boolean).join(", ");
      if (fallbackAddress) {
        setAddress(fallbackAddress);
      }
    }
    if (user && !phone && user.phone) {
      setPhone(user.phone);
    }
  }, [user, address, phone]);

  const handleCheckout = async () => {
    if (!address || !phone) {
      toast.error("Please enter your address and phone");
      return;
    }
    try {
      // SECURITY FIX: Don't send totals from frontend - backend will recalculate
      const { data } = await axios.post("/api/order/place", {
        address,
        phone,
        paymentMethod,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchCartData(); // Refresh cart to reflect the cleared cart
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  return (
      <div className="max-w-7xl mx-auto mt-16 mb-24 px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT SIDE - Guest & Delivery Particulars */}
          <div className="lg:col-span-7">
            <header className="mb-10">
              <h2 className="text-3xl font-serif font-semibold italic text-[#1A1A1A] tracking-tight">
                Guest Information
              </h2>
              <div className="w-16 h-0.5 bg-[#A68966] mt-4"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="border-l border-[#a18664] pl-4">
                <label className="block text-[12px] uppercase tracking-[0.15em] text-[#A68966] font-bold mb-1">
                  Full Name
                </label>
                <p className="text-lg font-semibold font-serif text-[#1A1A1A]">{user?.name || "Valued Guest"}</p>
              </div>
              <div className="border-l border-[#a18664] pl-4">
                <label className="block text-[12px] uppercase tracking-[0.15em] text-[#A68966] font-bold mb-1">
                  Email Address
                </label>
                <p className="text-base font-medium text-[#1A1A1A]">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="group">
                <label className="flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-[#A68966] font-bold mb-2">
                  <Pencil size={14} />
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  placeholder="e.g. +44 20 7946 0000"
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-[#7d6b56] py-3 focus:border-[#1A1A1A] focus:outline-none transition-colors text-lg font-medium"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-[#A68966] font-bold mb-2">
                  <Pencil size={14} />
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  placeholder="Enter the full street address for our concierge..."
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent border-b border-[#7d6b56] py-3 focus:border-[#1A1A1A] focus:outline-none transition-colors text-lg font-medium resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Order Statement */}
          <div className="lg:col-span-5">
            <div className="bg-[#FBF9F6] border border-[#E8E1D9] p-8 lg:p-12 sticky top-10">
              <h2 className="text-sm uppercase tracking-[0.3em] text-[#1A1A1A] font-bold mb-10 text-center border-b border-[#bfab94] pb-6">
                Order Summary
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-[#8C7E6A]">
                  <span className="text-[13px] font-semibold uppercase tracking-widest">Subtotal</span>
                  <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center text-red-600 bg-red-50 px-3 py-2 rounded">
                    <span className="text-[13px] font-semibold uppercase tracking-widest flex items-center gap-2">
                      <Tag size={14} />
                      Total Discount
                    </span>
                    <span className="font-semibold">-£{totalDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#8C7E6A]">
                  <span className="text-[13px] font-semibold uppercase tracking-widest">Gratuity</span>
                  <span className="italic font-semibold text-xs">Included</span>
                </div>
                <div className="pt-6 border-t border-[#a58d70] flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-[0.3em] font-bold text-[#1A1A1A]">Total</span>
                  <span className="text-4xl font-semibold font-serif italic text-[#1A1A1A]">
                    £{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-[12px] uppercase tracking-[0.2em] text-[#A68966] font-bold mb-6 text-center">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  {[
                    { id: "Pay at hotel", label: "Pay at Resturant" },
                    { id: "Online Payment", label: "Online Payment" }
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-all duration-300 ${
                        paymentMethod === method.id 
                        ? "border-[#1A1A1A] bg-white shadow-sm" 
                        : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <span className="text-lg font-semibold font-serif italic text-[#1A1A1A]">{method.label}</span>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#1A1A1A] h-4 w-4"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full cursor-pointer bg-[#1A1A1A] text-[#F5F5F5] py-5 uppercase tracking-[0.4em] text-[12px] font-bold hover:bg-[#A68966] transition-all duration-700 hover:scale-105 shadow-xl"
              >
                Confirm Order
              </button>
              
              
            </div>
          </div>
        </div>
      </div>
  );
};
export default Checkout;
