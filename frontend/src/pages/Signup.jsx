import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Fingerprint, ShieldCheck, ArrowRight, ArrowLeft, Table, LogIn, ChefHat } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Auth = () => {
  const { loading, setLoading, axios, setUser, navigate } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: "", email: "", password: "", phone: "", address: "", city: "" 
  });

  const onChangeHandler = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/register", formData);
      if (data.success) {
        toast.success(data.message);
        setIsLogin(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-[#A68966] selection:text-white">
      
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#A68966]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-900/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-7xl h-auto md:h-[85vh] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row overflow-hidden border border-[#E8E1D9]">
        
        {/* LEFT PANEL: CONTENT (40%) */}
        <div className="w-full md:w-[45%] h-full bg-[#1A1A1A] p-12 md:p-20 flex flex-col justify-between text-white relative">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12">
              <ChefHat className="text-[#da9746]" size={24} />
              <span className="text-[12px] tracking-[0.5em] font-bold uppercase text-[#da9746]">
                Black Pepper
              </span>
            </Link>


            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-txt" : "reg-txt"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl md:text-7xl font-serif italic text-[#ffffff] mb-6 leading-tight">
                  {isLogin ? "Member" : "Guest"} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 not-italic font-light">Access</span>
                </h2>
                <p className="text-gray-100 text-xl font-medium font-serif italic max-w-xs leading-relaxed">
                  {isLogin 
                    ? "Verify your credentials to manage your bespoke software portfolio."
                    : "Join our exclusive circle for priority system updates and concierge support."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group flex items-center gap-4 text-[11px] tracking-[0.3em] font-bold uppercase transition-all"
            >
              <span className="text-gray-100 group-hover:text-white transition-colors">
                {isLogin ? "New Client?" : "Returning Client?"}
              </span>
              <div className="flex cursor-pointer items-center gap-2 text-[#f1ba75]">
                {isLogin ? "Create Account" : "Sign In"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>


        </div>

        {/* RIGHT PANEL: FORM (60%) */}
        <div className="w-full md:w-[55%] h-full bg-white p-8 md:p-20 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-form" : "reg-form"}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              <div className="mb-12">
                <p className="text-[#A68966] text-[10px] uppercase tracking-[0.4em] font-bold mb-2">Registry</p>
                <h3 className="text-4xl font-bold font-serif text-[#1A1A1A]">
                  {isLogin ? "Client Login" : "Guest Registration"}
                </h3>
              </div>

              <form className="space-y-10" onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
                {!isLogin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ScrollInput label="Full Name" name="name" placeholder="E.g. Arthur Wellesley" value={formData.name} onChange={onChangeHandler} required />
                    <ScrollInput label="Phone Number" name="phone" placeholder="+44 20 ..." value={formData.phone} onChange={onChangeHandler} required />
                  </div>
                )}

                <ScrollInput label="Email Address" type="email" name="email" placeholder="client@firm.com" value={formData.email} onChange={onChangeHandler} required />
                <ScrollInput label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={onChangeHandler} required />

                {!isLogin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ScrollInput label="Address" name="address" placeholder="Street Name" value={formData.address} onChange={onChangeHandler} required />
                    <ScrollInput label="City" name="city" placeholder="London" value={formData.city} onChange={onChangeHandler} required />
                  </div>
                )}

                <div className="pt-6">
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full cursor-pointer relative group bg-[#1A1A1A] text-white py-5 px-8 flex items-center justify-between overflow-hidden transition-all duration-500 hover:bg-[#c89557]"
                  >
                    <span className="relative z-10 text-[11px] tracking-[0.6em] font-bold uppercase">
                      {loading ? "Authenticating..." : (isLogin ? "Confirm Login" : "Complete Registry")}
                    </span>
                    <Fingerprint className="relative z-10 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                  
                  {isLogin && (
                    <p className="mt-6 text-center text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:text-[#A68966] transition-colors">
                      Forgotten Access Key?
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ScrollInput = ({ label, ...props }) => (
  <div className="group relative">
    <label className="text-[13px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-3 block group-focus-within:text-[#A68966] transition-colors">
      {label}
    </label>
    <div className="relative">
      <input 
        {...props}
        className="w-full bg-transparent border-b border-gray-300 pb-2 text-lg text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-all font-semibold font-serif placeholder:text-gray-400 placeholder:italic"
      />
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#A68966] group-focus-within:w-full transition-all duration-500" />
    </div>
  </div>
);

export default Auth;