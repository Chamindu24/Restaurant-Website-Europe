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
  }, [menu]);

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
            <div className="relative group overflow-hidden rounded-sm ">
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
            {applicableOffers?.length > 0 && (
              <div className="space-y-4">
                <h3 className="uppercase tracking-[0.2em] text-xs font-black text-gray-400">Exclusive Offers</h3>
                <div className="grid gap-3">
                  {applicableOffers.map((offer) => (
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

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="border-t border-gray-200 pt-12 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-2xl font-serif">Guest Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-serif text-[#C5A059]">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div>
                {renderStars(Math.round(reviewStats.averageRating))}
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
                  {reviewStats.reviewCount} Review{reviewStats.reviewCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <form
              onSubmit={handleSubmitReview}
              className="border border-gray-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500 font-bold">
                  Leave a Review
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                      aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                    >
                      <Star
                        className={
                          rating >= star
                            ? "w-5 h-5 text-[#C5A059]"
                            : "w-5 h-5 text-gray-300"
                        }
                        fill={rating >= star ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience..."
                className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#C5A059]"
              />
              <div className="flex items-center justify-between">
                {!user && (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-[#C5A059] uppercase tracking-[0.2em] font-bold"
                  >
                    Log in to review
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!user || submitLoading}
                  className="ml-auto px-6 py-3 text-sm uppercase tracking-[0.2em] font-bold bg-[#1A1A1A] text-white transition-all duration-300 hover:bg-[#C5A059] disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {submitLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {reviewsLoading ? (
                <p className="text-sm text-gray-500">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-500">No reviews yet. Be the first to share.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border border-gray-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm uppercase tracking-[0.15em]">
                          {review.user?.name || "Guest"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;