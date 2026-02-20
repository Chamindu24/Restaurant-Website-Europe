import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Trash2, FolderTree } from "lucide-react";
import toast from "react-hot-toast";

const Categories = () => {
  const { categories, fetchCategories, axios } = useContext(AppContext);

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to remove this category?")) return;
    try {
      const { data } = await axios.delete(`/api/category/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="py-10 px-6 min-h-screen bg-[#FDFCFB]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10 border-b border-gold-200 pb-6">
          <div>
            <h1 className="text-4xl font-bold font-serif text-slate-900 tracking-tight">
              Menu Categories
            </h1>

          </div>

        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs uppercase tracking-widest text-slate-500 font-semibold">Preview</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest text-slate-500 font-semibold">Category Name</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest text-slate-500 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="relative w-28 h-28 rounded-lg  duration-500 group-hover:scale-110  bg-white">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform" 
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xl font-medium text-slate-800 tracking-tight">{item.name}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => deleteCategory(item._id)}
                      className="p-3 cursor-pointer rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                      title="Remove Category"
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {categories.length === 0 && (
            <div className="py-20 text-center">
              <FolderTree className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 italic">No categories have been curated yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;