import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Trash2, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";

const Menus = () => {
  const { menus, fetchMenus, axios } = useContext(AppContext);

  const deleteMenu = async (id) => {
    if (!window.confirm("Remove this item from the culinary menu?")) return;
    try {
      const { data } = await axios.delete(`/api/menu/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchMenus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting menu item");
    }
  };

  return (
    <div className="py-10 px-6 min-h-screen bg-[#FDFCFB]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10 border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold font-serif text-slate-900 tracking-tight">
              Food Selections
            </h1>

          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Plate</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Dish Name</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Category</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Price</th>
                <th className="px-8 py-5 text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {menus.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden ring-1 ring-slate-100 shadow-sm bg-white">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xl font-medium text-slate-800 tracking-tight">{item?.name}</p>
                  </td>
                  <td className="px-8 py-6 text-slate-600">
                    <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium uppercase tracking-wider">
                      {item?.category?.name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-2xl font-bold font-serif text-stone-900">${Number(item.price).toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => deleteMenu(item._id)}
                      className="p-3 cursor-pointer rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                      title="Delete Item"
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {menus.length === 0 && (
            <div className="py-24 text-center">
              <UtensilsCrossed className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 italic font-serif">The menu is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menus;