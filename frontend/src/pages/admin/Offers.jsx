import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Pencil, Tag, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const Offers = () => {
  const { axios, navigate } = useContext(AppContext);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/offer/all");
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (error) {
      console.error("Failed to load offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      const { data } = await axios.delete(`/api/offer/delete/${id}`);
      if (data.success) {
        toast.success(data.message || "Offer deleted");
        fetchOffers();
      } else {
        toast.error(data.message || "Unable to delete offer");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete offer");
    }
  };

  return (
    <div className="py-10 px-6 min-h-screen bg-[#FDFCFB]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold font-serif text-slate-900 tracking-tight">
              Offers & Promotions
            </h1>
          </div>
          <button
            onClick={() => navigate("/admin/add-offer")}
            className="px-5 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all"
          >
            Create Offer
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Title</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Type</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Applies To</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Status</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {offers.map((offer) => (
                <tr key={offer._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-lg font-medium text-slate-800 tracking-tight">
                      {offer.title}
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">
                      {offer.description || "No description"}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-600">
                    {offer.offerType}
                  </td>
                  <td className="px-8 py-6 text-slate-600">
                    {offer.appliesTo === "menu" && offer.menuItem?.name
                      ? `Menu: ${offer.menuItem.name}`
                      : offer.appliesTo === "category" && offer.category?.name
                      ? `Category: ${offer.category.name}`
                      : "All Items"}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full ${
                        offer.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-offer/${offer._id}`)}
                        className="p-3 cursor-pointer rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                        title="Edit Offer"
                      >
                        <Pencil size={20} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => deleteOffer(offer._id)}
                        className="p-3 cursor-pointer rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                        title="Delete Offer"
                      >
                        <Trash2 size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && offers.length === 0 && (
            <div className="py-20 text-center">
              <Tag className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 italic">No offers created yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offers;
