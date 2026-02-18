import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  LogOut,
  Package,
  ShoppingCart,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { navigate, user, setUser, axios, cartCount } = useContext(AppContext);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return undefined;
    }

    const onScroll = () => {
      setIsScrolled(window.scrollY >= 480);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        setUser(null);
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menus", path: "/menu" },
    { name: "Book Table", path: "/book-table" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-[100] transition-colors duration-500 ${
        isScrolled
          ? "bg-[#FCFBFA] border-b border-[#E5E0D8]"
          : "bg-black border-b border-transparent"
      }`}
      
    >
      {/* THE GRADIENT MASK: This hides the gap and adds 'Royal' depth */}
      {isHome && (
        <div
          className={`absolute inset-0 z-[-1] transition-opacity duration-1000 ${
            isScrolled ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
            height: "200%", // This pushes the "fade" deep into the video for a cinematic look
          }}
        ></div>
      )}
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Left - Text Logo 
          <div className="flex items-center">
            <Link to="/" className="group flex flex-col items-start leading-none transition-all duration-500 hover:opacity-80">
              <div className="flex items-baseline gap-1">
                {/* "BLACK" in deep charcoal, "PEPPER" in Gold 
                <span
                  className={`text-2xl md:text-3xl font-black tracking-tighter uppercase transition-colors duration-300 ${
                    isScrolled ? "text-[#1A1A1A]" : "text-[#F5F2EC]"
                  }`}
                >
                  Black
                </span>
                <span
                  className={`text-2xl md:text-3xl font-normal tracking-tighter serif transition-colors duration-300 ${
                    isScrolled ? "text-[#B8860B]" : "text-[#E6C57A]"
                  }`}
                >
                  Pepper
                </span>
              </div>
              

            </Link>
          </div>
          */}
          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-14">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-all duration-300 font-serif italic  text-md tracking-[0.2em] uppercase font-extrabold ${
                  isScrolled
                    ? "text-[#1f1e1e] hover:text-[#C5A059]"
                    : "text-[#EDEDED] hover:text-[#C5A059]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right - Icons & Actions */}
          <div className="flex items-center space-x-3 md:space-x-6">
            
            {/* Cart Icon */}
            <button
              onClick={() => navigate("/cart")}
              className={`relative cursor-pointer p-2 transition-colors group ${
                isScrolled
                  ? "text-[#4A4A4A] hover:text-[#C5A059]"
                  : "text-[#EDEDED] hover:text-[#C5A059]"
              }`}
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span className="absolute top-0 right-0 bg-[#C5A059] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                {cartCount > 0 ? cartCount : 0}
              </span>
            </button>

            {/* Profile Dropdown / Login */}
            <div className="hidden md:block">
              {user ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button className="p-1 border cursor-pointer border-transparent hover:border-[#C5A059]/30 rounded-full transition-all duration-500">
                    <UserCircle
                      size={28}
                      strokeWidth={1.2}
                      className={isScrolled ? "text-[#4A4A4A]" : "text-[#EDEDED]"}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-0 w-56 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-3 border border-[#E5E0D8] animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="px-4 py-2 border-b font-semibold border-gray-50 mb-2">
                        <p className="text-[12px] uppercase tracking-widest text-gray-400 font-bold">Account</p>
                        <p className="text-md font-serif text-[#1A1A1A] truncate">{user.name}</p>
                      </div>
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 font-semibold py-2.5 text-xs tracking-wider text-gray-600 hover:bg-[#FAF9F6] hover:text-[#C5A059] transition-colors"
                      >
                        <Calendar size={16} className="mr-3 opacity-70" />
                        MY BOOKINGS
                      </Link>
                      <Link
                        to="/my-orders"
                        className="flex items-center px-4 py-2.5 font-semibold text-xs tracking-wider text-gray-600 hover:bg-[#FAF9F6] hover:text-[#C5A059] transition-colors"
                      >
                        <Package size={16} className="mr-3 opacity-70" />
                        MY ORDERS
                      </Link>
                      <div className="border-t border-gray-50 mt-2 pt-2">
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-2.5 text-xs tracking-wider text-red-500 hover:bg-red-50 transition-colors font-bold"
                        >
                          <LogOut size={16} className="mr-3" />
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className={`text-white cursor-pointer text-[12px] tracking-[0.2em] uppercase px-7 py-3 transition-all duration-500 font-serif italic font-semibold shadow-lg shadow-black/5 ${
                    isScrolled
                      ? "bg-[#1A1A1A] hover:bg-[#C5A059]"
                      : "bg-transparent border border-white/90 hover:bg-[#1A1A1A]"
                  }`}
                >
                  Join Us
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className={`md:hidden p-2 ${isScrolled ? "text-[#4A4A4A]" : "text-[#EDEDED]"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden pb-8 pt-4 border-t border-[#E5E0D8] bg-[#FCFBFA] animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-5 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#4A4A4A] text-sm tracking-widest uppercase font-serif italic font-semibold hover:text-[#C5A059]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] bg-[#E5E0D8] w-full my-2" />
              {user ? (
                <>
                  <Link to="/my-bookings" className="text-sm tracking-widest uppercase text-gray-500 font-serif italic font-semibold" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
                  <Link to="/my-orders" className="text-sm tracking-widest uppercase text-gray-500 font-serif italic font-semibold" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                  <button onClick={logout} className="text-sm tracking-widest uppercase text-red-500 font-serif italic font-semibold text-left">Logout</button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-[#C5A059] text-white text-xs tracking-widest uppercase py-4 font-serif italic font-semibold"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;