import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ArrowLeft, ShoppingCart, Minus, Plus, Tag, Award, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { getApplicableOffers } from "../utils/offerCalculations";

const MenuDetails = () => {
  const { id } = useParams();
  const { menus, navigate, addToCart, user, axios, offers } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 5,
    reviewCount: 0,
  });
  // Random menu cards
  const [randomMenus, setRandomMenus] = useState([]);
  // Import MenuCard
  // ...existing code...

  const menu = menus?.find((item) => item._id === id);
  
  // Get applicable offers for this menu item using the offer engine
  const applicableOffers = menu ? getApplicableOffers(menu, offers) : [];

  useEffect(() => {
    if (menu) {
      setReviewStats({
        averageRating: menu.averageRating ?? 5,
        reviewCount: menu.reviewCount ?? 0,
      });
    }
    console.log('menu',menu)
  }, [menu]);

  // Pick 3 random menu items (excluding current)
  useEffect(() => {
    if (menus && menus.length > 1) {
      const filtered = menus.filter((item) => item._id !== id);
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      setRandomMenus(shuffled.slice(0, 3));
    }
  }, [menus, id]);

  useEffect(() => {
    if (!menu) return;

    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const { data } = await axios.get(`/api/review/menu/${menu._id}`);
        if (data.success) {
          setReviews(data.reviews || []);
          if (typeof data.averageRating === "number") {
            setReviewStats({
              averageRating: data.averageRating ?? 5,
              reviewCount: data.reviewCount ?? 0,
            });
          }
        } else {
          toast.error(data.message || "Failed to load reviews");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [menu, axios]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a review");
      navigate("/login");
      return;
    }

    if (submitLoading) return;

    try {
      setSubmitLoading(true);
      const { data } = await axios.post("/api/review/add", {
        menuId: menu._id,
        rating,
        comment,
      });

      if (data.success) {
        setReviews((prev) => [data.review, ...prev]);
        setReviewStats({
          averageRating: data.averageRating ?? reviewStats.averageRating,
          reviewCount: data.reviewCount ?? reviewStats.reviewCount,
        });
        setRating(5);
        setComment("");
        toast.success(data.message || "Review submitted");
      } else {
        toast.error(data.message || "Unable to submit review");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to submit review");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = (value) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            value >= star ? "w-4 h-4 text-[#C5A059]" : "w-4 h-4 text-gray-300"
          }
          fill={value >= star ? "currentColor" : "none"}
          style={
            value >= star
              ? { filter: "drop-shadow(0 0 6px rgba(197, 160, 89, 0.8))" }
              : {}
          }
        />
      ))}
    </div>
  );

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
    <div className="min-h-screen bg-[#FBF5EB] text-[#1A1A1A]  ">
      {/* Navigation */}
      <div className="max-w-8xl mx-auto px-5 md:px-10 py-10">
        <button
          onClick={() => navigate("/menu")}
          className="flex cursor-pointer items-center gap-2 text-[#1A1A1A]  transition-all  group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 duration-300 transition-transform" />
          <span className="uppercase tracking-[0.1em] text-sm font-bold">Back to Menu</span>
        </button>
      </div>

      <div className="max-w-8xl mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: Image Section */}
          <div className="lg:col-span-7">
            <div className="relative group overflow-hidden rounded-sm ">
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full h-[450px] sm:h-[450px] md:h-[450px] lg:h-[600px] object-cover"
            />
              <div className="absolute top-0 left-0 w-full h-full border-[16px] border-white/10 pointer-events-none"></div>
              {menu.isAvailable && (
                <div className="absolute top-6 left-6 bg-stone-900 rounded-md text-white px-6 py-1 tracking-[0.1em] text-xs font-bold uppercase">
                  Available Today
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Details Section */}
          <div className="lg:col-span-5 space-y-8">
            <header className="border-b border-gray-400 pb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-1 w-10 bg-[#855d14]/60"></span>
                <span className="text-[#855d14] font-black tracking-[0.3em] uppercase text-[14px]">
                  {menu.category?.name || "Fine Dining"}
                </span>
              </div>
              <h1 className="text-5xl font-serif font-semibold leading-tight mb-4">{menu.name}</h1>
              <p className="text-3xl  text-[#1A1A1A] tracking-tight">£{menu.price.toFixed(2)}</p>
            </header>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="uppercase tracking-[0.2em] text-xs font-black text-gray-600">Description</h3>
              <p className="text-xl leading-relaxed font-medium text-gray-800">
                {menu.description}
              </p>
            </div>

            {/* Applicable Offers from Offer Engine */}
            {applicableOffers?.length > 0 && (
              <div className="space-y-4">
                <h3 className="uppercase tracking-[0.2em] text-xs font-black text-gray-600">Exclusive Offers</h3>
                <div className="grid gap-3">
                  {applicableOffers.map((offer) => (
                    <div key={offer._id} className="flex items-center gap-4 p-4 border border-[#C5A059] bg-[#F9F9F9] rounded-sm">
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
            <div className="bg-[#F9F9F9] border border-gray-400 p-8  space-y-6">
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
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-md">Total Price.</span>
                  <span className="text-5xl font-serif font-semibold text-[#7c5712]">£{totalPrice}</span>
                </div>

                <button
                  disabled={!menu.isAvailable}
                  onClick={() => addToCart(menu._id, quantity)}
                  className={`w-full cursor-pointer py-5 rounded-none font-bold tracking-[0.2em] uppercase text-sm transition-all duration-500 flex items-center justify-center gap-3 ${
                    menu.isAvailable
                      ? "bg-[#1A1A1A] text-white hover:bg-[#C5A059] shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {menu.isAvailable ? "Add to Order" : "Currently Unavailable"}
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-0 mt-24 pb-20">
        <div className="border-t border-gray-900/50 pt-16 grid lg:grid-cols-12 gap-16">
          
          {/* Left Column: Summary Stats */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-4xl font-serif font-semibold text-[#1A1A1A] mb-2">Customer Reviews</h2>
              <p className="text-md text-gray-600 font-medium">Honest feedback from our happy clients.</p>
            </div>

            <div className="flex items-end gap-4">
              <div className="text-6xl font-serif text-[#1A1A1A]">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div className="pb-2">
                <div className="flex mb-1">{renderStars(Math.round(reviewStats.averageRating))}</div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-gray-900 font-bold">
                  Based on {reviewStats.reviewCount} Experiences
                </p>
              </div>
            </div>

            {/* Visual Rating Breakdown - The "Famous Site" Look */}
            <div className="space-y-3 pt-6">
              {[5, 4, 3, 2, 1].map((num) => (
                <div key={num} className="flex items-center gap-4 text-sm font-medium text-gray-700">
                  <span className="w-3">{num}</span>
                  <div className="flex-1 h-[2px] bg-gray-100">
                    <div 
                      className="h-full bg-[#C5A059]" 
                      style={{ width: `${num === 5 ? 85 : num === 4 ? 10 : 5}%` }} // Replace with dynamic logic if available
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form & List */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Premium Review Form */}
            <form
              onSubmit={handleSubmitReview}
              className="bg-[#F9F9F9] border border-gray-400 p-8 rounded-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A] font-bold">
                  Write a Review
                </h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform cursor-pointer hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${rating >= star ? "text-[#C5A059]" : "text-gray-300"}`}
                        fill={rating >= star ? "currentColor" : "none"}
                        style={
                          rating >= star
                            ? { filter: "drop-shadow(0 0 8px rgba(197, 160, 89, 0.9))" }
                            : {}
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Describe your dining experience..."
                className="w-full bg-transparent border-b-2 border-gray-400 py-3 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors resize-none font-medium"
              />

              <div className="flex items-center justify-between pt-2">



                <button
                  type="submit"
                  disabled={!user || submitLoading}
                  className="px-10 py-4 text-xs uppercase tracking-[0.2em] font-bold bg-[#1A1A1A] text-white hover:bg-[#C5A059] transition-all duration-500 disabled:bg-gray-300"
                >
                  {submitLoading ? "Processing..." : "Post Review"}
                </button>
              </div>
            </form>

            {/* Review Feed */}
            <div className="space-y-10">
              {reviewsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse text-sm uppercase tracking-widest font-bold">Loading...</div>
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-center py-10 text-gray-500 font-medium">No reviews yet. Be the first to grace our wall.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="group border-b px-4 md:px-0 border-gray-500 pb-10 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-md uppercase tracking-[0.15em] text-[#1A1A1A]">
                          {review.user?.name || "Distinguished Guest"}
                        </h4>
                        <p className="text-[12px] font-bold text-gray-500 mt-1 uppercase">
                          {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex gap-0.5">

                        {renderStars(review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-2xl text-gray-800 font-serif leading-relaxed font-semibold max-w-2xl">
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      
    {/* Random Menu Cards Section */}
    {randomMenus.length > 0 && (
      <div className="max-w-8xl mx-auto px-6 md:px-4 pb-32">
        <div className="flex flex-col items-center justify-center 
                        text-center px-4 sm:px-6 lg:px-8 
                        pb-12 sm:pb-12">

          <h2 className="text-3xl sm:text-4xl md:text-5xl 
                        font-serif font-semibold 
                        text-[#1A1A1A] 
                        leading-tight">
            Discover More Dishes
          </h2>

          <div className="mt-4 h-[3px] w-16 sm:w-20 
                          bg-gradient-to-r 
                          from-[#BFA37E] to-[#D6C2A1] 
                          rounded-full">
          </div>

        </div> 

        <div className="grid md:grid-cols-3 gap-6">
          {randomMenus.map((item) => (
            <MenuCard key={item._id} menu={item} />
          ))}
        </div>
      </div>
    )}
    </div>


  );
};

import MenuCard from "../components/MenuCard";
export default MenuDetails;