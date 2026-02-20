import { useContext, useState } from "react";
import { ChefHat, ChefHatIcon, LockIcon, MailIcon, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const AdminLogin = () => {
  const { navigate, loading, setLoading, axios, setAdmin } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/admin/login", formData);

      if (data.success) {
        setAdmin(true);
        toast.success(data.message);
        navigate("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen  items-center justify-center bg-[#FDFCFB] px-4">
      {/* Decorative Background Element (Subtle Royal Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-amber-50/50 to-transparent blur-3xl -z-10" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] bg-white border border-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-10 md:p-12 transition-all"
      >
        {/* Branding/Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-full bg-stone-900 shadow-xl">
            <ChefHat className="text-amber-400 w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-stone-900 text-3xl font-serif tracking-tight">
            Black Pepper <span className="text-amber-600">Admin</span>
          </h1>

        </div>

        <div className="space-y-5">
          {/* Email Input */}
          <div className="group relative">
            <label className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-semibold ml-4 mb-1 block">
              Email Address
            </label>
            <div className="flex items-center w-full bg-stone-50 border border-stone-200 group-focus-within:border-amber-500/50 group-focus-within:bg-white h-13 rounded-xl transition-all overflow-hidden px-5 gap-3">
              <MailIcon className="text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="email"
                placeholder="admin@blackpepper.com"
                className="bg-transparent text-stone-800 placeholder-stone-300 outline-none text-sm w-full h-full"
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group relative">
            <label className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-semibold ml-4 mb-1 block">
              Security Key
            </label>
            <div className="flex items-center w-full bg-stone-50 border border-stone-200 group-focus-within:border-amber-500/50 group-focus-within:bg-white h-13 rounded-xl transition-all overflow-hidden px-5 gap-3">
              <LockIcon className="text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent text-stone-800 placeholder-stone-300 outline-none text-sm w-full h-full"
                name="password"
                value={formData.password}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full cursor-pointer h-14 rounded-xl text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-stone-200 font-medium tracking-wide flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            "Sign In to Dashboard"
          )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-stone-400 text-xs">
            © 2026 Black Pepper  Ltd. 
            <br />
            <span className="opacity-50">London, United Kingdom</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;