import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Package, MapPin, CreditCard, Calendar, ChevronDown, ChevronUp } from "lucide-react";

const MyOrders = () => {
  const { axios } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/my-orders");
      console.log('my orders',data)
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMyOrders();
  }, []);
  return (
<div className="max-w-7xl mx-auto mt-16 px-4 mb-24">
      {/* Royal Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.4em] text-[#9d7c53] uppercase mb-4 block font-bold">
          Review your past purchases and details.
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A1A1A] italic">
          Order History
        </h1>
        <div className="w-24 h-[2px] bg-[#81633d] mx-auto mt-6 opacity-60"></div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFCF9] border border-[#E5D9C6]">
          <Package size={40} strokeWidth={1} className="text-[#A68966] mx-auto mb-4" />
          <p className="text-[#8C7E6A] font-serif font-bold text-2xl italic">Your history is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrders[order._id];
            const itemsToShow = isExpanded ? order.items : order.items.slice(0, 2);
            const hasMore = order.items.length > 2;

            return (
              <div 
                key={order._id} 
                className="bg-white border border-[#E8E1D9] hover:border-[#A68966] transition-colors duration-500 "
              >
                {/* Order Meta Header */}
                <div className="flex flex-wrap justify-between items-center px-8 py-5 border-b border-[#F2EEE9] bg-[#FBF9F6]">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.2em] text-[#A68966] font-bold">Reference</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className="hidden sm:block w-[1px] h-8 bg-[#E8E1D9]"></div>
                    <div className="hidden sm:block">
                      <p className="text-[12px] uppercase tracking-[0.2em] text-[#A68966] font-bold">Date</p>
                      <p className="text-sm text-[#1A1A1A]">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <span className={`px-4 py-1 text-[12px] uppercase tracking-[0.1em] font-bold border ${
                      order.status === "Delivered" 
                        ? "border-green-200 text-green-700 bg-green-50" 
                        : "border-[#A68966] text-[#A68966]"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Main Order Info */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-[#F2EEE9]">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin size={20} className="text-[#A68966] mt-1 shrink-0" />
                      <div>
                        <p className="text-[12px] uppercase tracking-widest text-[#8C7E6A] font-bold">Delivery Address</p>
                        <p className="text-lg text-slate-900 font-serif italic font-semibold leading-relaxed">{order.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end md:text-right">
                     <div className="flex items-start space-x-3 md:flex-row-reverse md:space-x-reverse">
                        <CreditCard size={20} className="text-[#A68966] mt-1 shrink-0" />
                        <div>
                          <p className="text-[12px] uppercase tracking-widest text-[#8C7E6A] font-bold">Payment Method</p>
                          <p className="text-sm text-[#1A1A1A] font-medium">{order.paymentMethod}</p>
                        </div>
                     </div>
                     <div>
                        <p className="text-[12px] uppercase tracking-widest text-[#A68966] font-bold">Order Total</p>
                        <p className="text-3xl font-serif font-bold text-[#1A1A1A]">{formatCurrency(order.totalAmount)}</p>
                     </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="px-8 py-4 bg-[#FFFCF9]">
                  <p className="text-[12px] uppercase tracking-[0.2em] text-[#8C7E6A] font-bold mb-2">Items ({order.items.length})</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {itemsToShow.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 group">
                        <div className="w-24 h-24 bg-white border border-[#E8E1D9] p-1 shrink-0">
                          <img 
                            src={item.menuItem?.image} 
                            alt="" 
                            className="w-full h-full object-cover hover:scale-105 transition-all"
                          />
                        </div>
                        <div className="flex-1 font-semibold">
                          <p className="text-lg font-serif font-semibold italic text-[#1A1A1A]">{item.menuItem?.name}</p>
                          <p className="text-[14px] text-[#8C7E6A] uppercase tracking-tighter">
                            Qty: {item.quantity} • {formatCurrency(item.menuItem?.price || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Collapse / Expand Toggle */}
                  {hasMore && (
                    <button 
                      onClick={() => toggleOrder(order._id)}
                      className="mt-8 flex items-center space-x-2 text-[12px] uppercase tracking-[0.2em] font-bold text-[#A68966] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <><ChevronUp size={14} /> <span>Show Fewer Items</span></>
                      ) : (
                        <><ChevronDown size={14} /> <span>Show {order.items.length - 2} More Selections</span></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default MyOrders;
