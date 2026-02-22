import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Loader2, Save, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddOffer = () => {
  const { id } = useParams();
  const { axios, navigate, categories, menus } = useContext(AppContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerType: "percentage",
    discountValue: "",
    buyQuantity: "",
    getQuantity: "",
    appliesTo: "all",
    menuItem: "",
    category: "",
    validDays: [],
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const fetchOfferDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/offer/${id}`);
      if (data.success) {
        const offer = data.offer;
        setFormData({
          title: offer.title || "",
          description: offer.description || "",
          offerType: offer.offerType || "percentage",
          discountValue: offer.discountValue ?? "",
          buyQuantity: offer.buyQuantity ?? "",
          getQuantity: offer.getQuantity ?? "",
          appliesTo: offer.appliesTo || "all",
          menuItem: offer.menuItem?._id || "",
          category: offer.category?._id || "",
          validDays: offer.validDays || [],
          startTime: offer.startTime || "",
          endTime: offer.endTime || "",
          startDate: offer.startDate ? new Date(offer.startDate).toISOString().split("T")[0] : "",
          endDate: offer.endDate ? new Date(offer.endDate).toISOString().split("T")[0] : "",
          isActive: offer.isActive ?? true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch offer details:", error);
      toast.error("Failed to fetch offer details");
    }
  }, [axios, id]);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchOfferDetails();
    }
  }, [id, fetchOfferDetails]);

  useEffect(() => {
    const offerType = formData.offerType;
    setFormData((prev) => {
      const next = { ...prev };

      if (offerType === "bxgy") {
        next.discountValue = "";
      }

      if (["percentage", "fixed"].includes(offerType)) {
        next.buyQuantity = "";
        next.getQuantity = "";
      }

      if (["happyHour", "birthday", "anniversary"].includes(offerType)) {
        next.buyQuantity = "";
        next.getQuantity = "";
      }

      if (!["happyHour", "bxgy"].includes(offerType)) {
        next.startTime = "";
        next.endTime = "";
        next.validDays = [];
      }

      if (offerType !== "happyHour") {
        next.startTime = "";
        next.endTime = "";
      }

      const changed = Object.keys(next).some((key) => next[key] !== prev[key]);
      return changed ? next : prev;
    });
  }, [formData.offerType]);

  useEffect(() => {
    const appliesTo = formData.appliesTo;
    setFormData((prev) => {
      const next = { ...prev };
      if (appliesTo !== "menu") next.menuItem = "";
      if (appliesTo !== "category") next.category = "";
      const changed = Object.keys(next).some((key) => next[key] !== prev[key]);
      return changed ? next : prev;
    });
  }, [formData.appliesTo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : type === "checkbox" ? checked : value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const nextDays = prev.validDays.includes(day)
        ? prev.validDays.filter((item) => item !== day)
        : [...prev.validDays, day];
      return { ...prev, validDays: nextDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const discountValue = Number(formData.discountValue);
    const buyQuantity = Number(formData.buyQuantity);
    const getQuantity = Number(formData.getQuantity);

    if (["percentage", "fixed"].includes(formData.offerType) && discountValue <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    if (formData.offerType === "bxgy" && (!buyQuantity || !getQuantity)) {
      toast.error("Buy and get quantities are required");
      return;
    }

    if (formData.offerType === "happyHour" && (!formData.startTime || !formData.endTime)) {
      toast.error("Start time and end time are required");
      return;
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        toast.error("End date must be the same or after start date");
        return;
      }
    }

    if (formData.appliesTo === "menu" && !formData.menuItem) {
      toast.error("Please select a menu item");
      return;
    }

    if (formData.appliesTo === "category" && !formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        validDays: formData.validDays,
        isActive: Boolean(formData.isActive),
      };

      const url = isEditMode ? `/api/offer/update/${id}` : "/api/offer/add";
      const method = isEditMode ? "put" : "post";
      const { data } = await axios[method](url, payload);

      if (data.success) {
        toast.success(isEditMode ? "Offer updated" : "Offer created");
        navigate("/admin/offers");
      } else {
        toast.error(data.message || "Unable to save offer");
      }
    } catch (error) {
      console.error("Offer save failed:", error);
      toast.error(error?.response?.data?.message || "Unable to save offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDiscount = ["percentage", "fixed", "happyHour", "birthday", "anniversary"].includes(formData.offerType);
  const showBxgy = formData.offerType === "bxgy";
  const showHappyHour = formData.offerType === "happyHour";
  const showValidDays = ["happyHour", "bxgy"].includes(formData.offerType);

  return (
    <div className="min-h-screen bg-white py-16 flex justify-center">
      <div className="w-full max-w-3xl px-6">
        <div className="mb-12 border-l-4 border-black pl-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
            {isEditMode ? "Edit Offer" : "Create Offer"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">Offer Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Offer Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
                placeholder="e.g. Friday Treat"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Offer Type</label>
              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black appearance-none text-gray-800"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Discount</option>
                <option value="bxgy">Buy X Get Y</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="happyHour">Happy Hour</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800 resize-none"
              placeholder="Describe the offer details..."
            />
          </div>

          {showDiscount && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Discount Value
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
                placeholder="10"
              />
            </div>
          )}

          {showBxgy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Buy Quantity</label>
                <input
                  type="number"
                  name="buyQuantity"
                  value={formData.buyQuantity}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
                  placeholder="2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Get Quantity</label>
                <input
                  type="number"
                  name="getQuantity"
                  value={formData.getQuantity}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
                  placeholder="1"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Applies To</label>
              <select
                name="appliesTo"
                value={formData.appliesTo}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black appearance-none text-gray-800"
              >
                <option value="all">All Items</option>
                <option value="menu">Specific Menu Item</option>
                <option value="category">Specific Category</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</label>
              <select
                name="isActive"
                value={String(formData.isActive)}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black appearance-none text-gray-800"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Menu Item</label>
              <select
                name="menuItem"
                value={formData.menuItem}
                onChange={handleChange}
                disabled={formData.appliesTo !== "menu"}
                className={`w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black appearance-none text-gray-800 ${
                  formData.appliesTo !== "menu" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select a menu item</option>
                {menus.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={formData.appliesTo !== "category"}
                className={`w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black appearance-none text-gray-800 ${
                  formData.appliesTo !== "category" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showValidDays && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Valid Days</label>
              <div className="flex flex-wrap gap-3">
                {dayOptions.map((day) => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                      formData.validDays.includes(day)
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showHappyHour && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-none focus:outline-none focus:border-black transition-colors text-gray-800"
              />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-black cursor-pointer text-white py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                {isEditMode ? "Updating..." : "Publishing..."}
              </>
            ) : (
              <>
                {isEditMode ? <Save size={16} /> : <Tag size={16} />}
                {isEditMode ? "Update Offer" : "Create Offer"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;
