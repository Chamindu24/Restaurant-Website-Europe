import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Tag, Calendar, Clock, Percent, Gift, Diamond } from "lucide-react";
import MenuCard from "../components/MenuCard";

const Rewards = () => {
  const { axios } = useContext(AppContext);
  const [offers, setOffers] = useState([]);
  const [menuItemsWithOffers, setMenuItemsWithOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch offers
        const offersResponse = await axios.get("/api/offer/all");
        if (offersResponse.data.success) {
          const activeOffers = offersResponse.data.offers.filter((offer) => offer.isActive);
          setOffers(activeOffers);
        }

        // Fetch menu items with offers
        const menuResponse = await axios.get("/api/menu/all");
        if (menuResponse.data.success) {
          const itemsWithOffers = menuResponse.data.menuItems.filter(
            (item) => item.offers && item.offers.length > 0
          );
          setMenuItemsWithOffers(itemsWithOffers);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axios]);

  const getOfferIcon = (offerType) => {
    switch (offerType) {
      case "percentage":
      case "fixed":
        return <Percent className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      case "bxgy":
        return <Gift className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      case "happyHour":
        return <Clock className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      case "birthday":
      case "anniversary":
        return <Gift className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
      default:
        return <Tag className="text-[#C5A059]" size={28} strokeWidth={1.5} />;
    }
  };

  const getOfferLabel = (offer) => {
    if (offer.offerType === "percentage") {
      return `${offer.discountValue}% OFF`;
    }
    if (offer.offerType === "fixed") {
      return `£${offer.discountValue} OFF`;
    }
    if (offer.offerType === "bxgy") {
      return `Buy ${offer.buyQuantity} Get ${offer.getQuantity}`;
    }
    if (offer.offerType === "happyHour") {
      return `${offer.discountValue}% OFF`;
    }
    if (offer.offerType === "birthday") {
      return "Birthday Special";
    }
    if (offer.offerType === "anniversary") {
      return "Anniversary Special";
    }
    return "Limited Offer";
  };

  const formatAppliesTo = (offer) => {
    if (offer.appliesTo === "menu" && offer.menuItem?.name) {
      return `On ${offer.menuItem.name}`;
    }
    if (offer.appliesTo === "category" && offer.category?.name) {
      return `On ${offer.category.name}`;
    }
    return "On All Items";
  };

  const formatValidDays = (days) => {
    if (!days || days.length === 0) return "All Week";
    if (days.length === 7) return "All Week";
    if (days.length <= 3) return days.join(", ");
    return `${days.slice(0, 2).join(", ")} +${days.length - 2}`;
  };

  const formatTimeRange = (offer) => {
    if (offer.startTime && offer.endTime) {
      return `${offer.startTime} - ${offer.endTime}`;
    }
    return null;
  };

  const formatDateRange = (offer) => {
    if (offer.startDate && offer.endDate) {
      const start = new Date(offer.startDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      const end = new Date(offer.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      return `${start} - ${end}`;
    }
    if (offer.endDate) {
      const end = new Date(offer.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `Valid Until ${end}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-20">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag className="text-[#C5A059]" size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-bold text-[#1A1A1A] tracking-tight mb-4">
            Exclusive Rewards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our current offers and special promotions. Treat yourself to exceptional dining experiences.
          </p>
          {!loading && offers.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full">
              <span className="text-sm font-semibold text-[#C5A059] uppercase tracking-wider">
                {offers.length} Active {offers.length === 1 ? "Offer" : "Offers"}
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
          </div>
        )}

        {/* Offers Grid */}
        {!loading && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white border border-[#E5E0D8] shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
              >
                {/* Offer Badge */}
                <div className="bg-linear-to-r from-[#1A1A1A] to-[#3A3A3A] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                      {getOfferIcon(offer.offerType)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif italic font-bold text-white mb-1 tracking-tight">
                        {getOfferLabel(offer)}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                        {offer.offerType.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <h4 className="text-xl font-serif font-semibold text-[#1A1A1A] mb-2">
                    {offer.title}
                  </h4>
                  {offer.description && (
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {offer.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Tag size={16} className="text-[#C5A059] mt-0.5 shrink-0" strokeWidth={1.5} />
                      <span className="text-gray-700">{formatAppliesTo(offer)}</span>
                    </div>

                    {offer.validDays && offer.validDays.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar size={16} className="text-[#C5A059] mt-0.5 shrink-0" strokeWidth={1.5} />
                        <span className="text-gray-700">{formatValidDays(offer.validDays)}</span>
                      </div>
                    )}

                    {formatTimeRange(offer) && (
                      <div className="flex items-start gap-2 text-sm">
                        <Clock size={16} className="text-[#C5A059] mt-0.5 shrink-0" strokeWidth={1.5} />
                        <span className="text-gray-700">{formatTimeRange(offer)}</span>
                      </div>
                    )}

                    {formatDateRange(offer) && (
                      <div className="mt-4 pt-4 border-t border-[#E5E0D8]">
                        <span className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">
                          {formatDateRange(offer)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect Bottom Bar */}
                <div className="h-1 bg-linear-to-r from-[#C5A059] to-[#A68966] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && offers.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-[#FAF9F6] p-12 rounded-lg border border-[#E5E0D8] max-w-md mx-auto">
              <Tag className="mx-auto text-gray-300 mb-4" size={64} strokeWidth={1} />
              <h3 className="text-2xl font-serif italic font-semibold text-[#1A1A1A] mb-3">
                No Active Offers
              </h3>
              <p className="text-gray-600">
                Check back soon for exciting new offers and promotions.
              </p>
            </div>
          </div>
        )}

        {/* Menu Items with Offers Section */}
        {!loading && menuItemsWithOffers.length > 0 && (
          <div className="mt-24">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
                <Diamond className="text-[#C5A059]" size={24} strokeWidth={1.5} />
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-[#1A1A1A] tracking-tight mb-3">
                Featured Dishes with Rewards
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our specially selected menu items with exclusive offers
              </p>
            </div>

            {/* Menu Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItemsWithOffers.map((menu) => (
                <div key={menu._id} className="relative">
                  <MenuCard menu={menu} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
