import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, Phone, History, ArrowRightLeft, Scroll } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Auth = () => {
    const { loading, setLoading, axios, setUser, navigate } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", address: "", city: "" });

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
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post("/api/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
            });
            if (data.success) {
                toast.success(data.message);
                setIsLogin(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div 
      className="relative min-h-screen w-full bg-white overflow-hidden font-serif flex items-start justify-center"
    >
    {/* 2. THE MAIN CANVAS */}
    <div className="relative w-full max-w-7xl h-[85vh] bg-[#FDFCF9]/5  flex overflow-hidden border border-white">
        {/* THE ROLLING WING */}
        <motion.div 
            animate={{ x: isLogin ? "0%" : "-50%" }} 
            transition={{ duration: 1.4, ease: [0.85, 0, 0.15, 1] }}
            className="flex w-[200%] h-full flex-shrink-0"
        >
            {/* SECTION I: LOGIN */}
            <div className="w-1/2 h-full flex flex-col md:flex-row items-center px-12 md:px-24">
                <div className="w-full md:w-1/2 md:pr-20 space-y-10">
                    <div className="space-y-4">

                        <h2 className="text-[70px] lg:text-[90px] leading-[0.8] tracking-tighter text-zinc-950 font-light">
                            Welcome <br/> <span className=" text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 font-normal">Back.</span>
                        </h2>
                    </div>
                    
                    <p className="text-[18px] leading-relaxed text-zinc-800 font-serif max-w-sm">
                        Access your table. View your preferences and manage your bookings.
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="group flex flex-col gap-2 items-start"
                    >
                        <span className="text-[12px] tracking-[0.2em] uppercase font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors">Not a Member?</span>
                        <span className="text-[14px] tracking-[0.2em] font-bold text-zinc-950 border-b border-zinc-950 pb-1 group-hover:border-[#D4AF37] transition-all">Create Account</span>
                    </button>
                </div>
                
                <div className="w-full md:w-1/2 bg-white p-12 shadow-[0_20px_50px_rgba(0,0,0,0.01)] border border-zinc-50">
                                        <form className="space-y-12" onSubmit={handleLoginSubmit}>
                                                <ScrollInput
                                                    label="Email Address"
                                                    type="email"
                                                    name="email"
                                                    placeholder="alex.morgan@example.eu"
                                                    value={formData.email}
                                                    onChange={onChangeHandler}
                                                    required
                                                />
                                                <ScrollInput
                                                    label="Password"
                                                    type="password"
                                                    name="password"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={onChangeHandler}
                                                    required
                                                />
                        <button type="submit" className="w-full py-4 bg-zinc-950 text-white text-[14px] tracking-[0.6em] uppercase font-bold hover:bg-[#D4AF37] transition-all duration-500 shadow-xl">
                            {loading ? "Confirming..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>

            {/* SECTION II: REGISTER */}
            <div className="w-1/2 h-full flex flex-col md:flex-row items-center px-12 md:px-24 ">
                <div className="w-full md:w-1/2 md:pr-20 space-y-10">
                    <div className="space-y-4">

                        <h2 className="text-[70px] lg:text-[90px] leading-[0.8] tracking-tighter text-zinc-950 font-light">
                            Begin Your <br/> <span className=" text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 font-normal">Journey.</span>
                        </h2>
                    </div>

                    <p className="text-[18px] leading-relaxed text-zinc-800 font-serif max-w-sm">
                        Create your account to unlock priority bookings and exclusive invitations to our dining collection.
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="group flex flex-col gap-2 items-start"
                    >
                        <span className="text-[12px] tracking-[0.2em] uppercase font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors">Already Have an Account?</span>
                        <span className="text-[14px] tracking-[0.2em] font-bold text-zinc-950 border-b border-zinc-950 pb-1 group-hover:border-[#D4AF37] transition-all">Return to Login</span>
                    </button>
                </div>
                
                <div className="w-full md:w-1/2 bg-white p-12 shadow-[0_20px_50px_rgba(0,0,0,0.01)] border border-zinc-50">
                                        <form className="space-y-8" onSubmit={handleRegisterSubmit}>
                        <div className="grid grid-cols-2 gap-8">
                                                        <ScrollInput
                                                            label="Full Name"
                                                            name="name"
                                                            placeholder="Alex Morgan"
                                                            value={formData.name}
                                                            onChange={onChangeHandler}
                                                            required
                                                        />
                                                        <ScrollInput
                                                            label="Phone Number"
                                                            name="phone"
                                                            placeholder="+44 20 7946 0958"
                                                            value={formData.phone}
                                                            onChange={onChangeHandler}
                                                            required
                                                        />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                                                        <ScrollInput
                                                            label="Email Address"
                                                            type="email"
                                                            name="email"
                                                            placeholder="alex.morgan@example.eu"
                                                            value={formData.email}
                                                            onChange={onChangeHandler}
                                                            required
                                                        />
                                                        <ScrollInput
                                                            label="Password"
                                                            type="password"
                                                            name="password"
                                                            placeholder="••••••••"
                                                            value={formData.password}
                                                            onChange={onChangeHandler}
                                                            required
                                                        />
                        </div>
                                                <ScrollInput
                                                    label="Delivery Address"
                                                    name="address"
                                                    placeholder="14 Baker Street"
                                                    value={formData.address}
                                                    onChange={onChangeHandler}
                                                    required
                                                />
                                                <ScrollInput
                                                    label="City / Area"
                                                    name="city"
                                                    placeholder="London"
                                                    value={formData.city}
                                                    onChange={onChangeHandler}
                                                    required
                                                />
                                                <button type="submit" className="w-full py-4 bg-zinc-950  text-white text-[14px] tracking-[0.6em] uppercase font-bold hover:bg-[#B8860B] transition-all duration-500 shadow-xl">
                            {loading ? "Processing..." : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    </div>
</div>
  );
};

const ScrollInput = ({ label, ...props }) => (
  <div className="group relative">
    <label className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold text-zinc-700 mb-2 block group-focus-within:text-[#B8860B] transition-colors">
      {label}
    </label>
    <input 
      {...props}
      className="w-full bg-transparent border-b border-zinc-400 pb-3 text-lg text-zinc-800 outline-none focus:border-zinc-900 transition-all font-serif  placeholder:text-zinc-500"
    />
  </div>
);

export default Auth;