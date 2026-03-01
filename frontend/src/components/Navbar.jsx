import { useContext, useEffect, useState, useRef } from "react";
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
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const { navigate, user, setUser, axios, cartCount, activeOffersCount } = useContext(AppContext);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen, isCartOpen]);

  // Close profile dropdown on outside click (mobile tap)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

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
    { name: "Rewards", path: "/rewards" },
    { name: "Book Table", path: "/book-table" },
    { name: "Contact", path: "/contact" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`sticky top-0 z-100 transition-colors duration-500 ${
          isScrolled
            ? "bg-[#FCFBFA] border-b border-[#E5E0D8]"
            : "bg-black border-b border-transparent"
        }`}
      >
        {/* Gradient mask for home hero */}
        {isHome && (
          <div
            className={`absolute inset-0 z-[-1] transition-opacity duration-1000 ${
              isScrolled ? "opacity-0" : "opacity-100"
            }`}
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
              height: "200%",
            }}
          />
        )}

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">

            {/* Center - Desktop Navigation */}
            <div className="hidden md:flex font-black items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative transition-all duration-300 font-serif  text-md tracking-[0.2em] uppercase font-black ${
                    isScrolled
                      ? "text-[#1f1e1e] hover:text-[#C5A059]"
                      : "text-[#EDEDED] hover:text-[#C5A059]"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 w-full bg-[#C5A059] transition-all duration-300 ${
                      isActivePath(link.path)
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                    }`}
                    style={{ transformOrigin: "left" }}
                  />
                  {link.name === "Rewards" && activeOffersCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-600 text-white text-[12px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                      {activeOffersCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right - Icons & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-6 ml-auto">

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                //onClick={() => navigate("/cart")}
                className={`relative cursor-pointer p-2 transition-colors group ${
                  isScrolled
                    ? "text-[#4A4A4A] hover:text-[#C5A059]"
                    : "text-[#EDEDED] hover:text-[#C5A059]"
                }`}
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[12px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown — desktop only */}
              <div className="hidden md:block" ref={profileRef}>
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
                    className={`text-white cursor-pointer text-[12px] tracking-[0.2em] uppercase px-7 py-3 transition-all duration-500 font-serif  font-semibold shadow-lg shadow-black/5 ${
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
                className={`md:hidden p-2 transition-colors ${
                  isScrolled ? "text-[#4A4A4A]" : "text-[#EDEDED]"
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-99 md:hidden transition-all duration-700 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop with smooth fade */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-md transition-all duration-700 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer — slides in from right with shadow */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#FDFCFB] to-[#F9F8F6] shadow-[-10px_0_50px_rgba(0,0,0,0.25)] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Elegant decorative top border */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
          
          {/* Drawer Header */}
          <div className="relative flex items-center justify-between px-6 py-5 border-b border-[#E5E0D8]/50">

            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="text-[#4A4A4A] hover:text-[#C5A059] p-2 hover:bg-[#C5A059]/10 rounded-full transition-all duration-300 hover:rotate-90"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>

          {/* Nav Links with staggered animation */}
          <div className="flex flex-col px-6 pt-6 gap-0 flex-1 overflow-y-auto">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`relative group py-5 border-b border-[#E5E0D8]/50 text-[#2A2A2A] text-sm tracking-[0.2em] uppercase font-serif  font-bold hover:text-[#C5A059] hover:pl-2 transition-all duration-500 flex items-center justify-between overflow-hidden ${
                  isActivePath(link.path) ? "text-[#C5A059]" : ""
                } ${
                  isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                }`}
                style={{ 
                  transitionDelay: isMenuOpen ? `${100 + i * 80}ms` : "0ms",
                  transitionProperty: "all"
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isActivePath(link.path) && (
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-pulse" />
                  )}
                  {link.name}
                </span>
                
                {/* Hover gradient effect */}
                <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#C5A059]/10 to-transparent group-hover:w-full transition-all duration-500 -z-0" />
                
                {link.name === "Rewards" && activeOffersCount > 0 && (
                  <span className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-white text-[10px] rounded-full px-2.5 py-1 font-bold shadow-md animate-pulse">
                    {activeOffersCount}
                  </span>
                )}
              </Link>
            ))}

            {/* Account Section with fade in */}
            <div className={`mt-8 transition-all duration-500 ${
              isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: isMenuOpen ? `${100 + navLinks.length * 80}ms` : "0ms" }}>
              {user ? (
                <div className="flex flex-col gap-0">
                  {/* User Profile Card */}
                  <div className="flex items-center gap-4 p-4 mb-3 bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] rounded-sm border border-[#C5A059]/20">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#D4AF37] flex items-center justify-center shadow-lg">
                      <UserCircle size={26} strokeWidth={1.5} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-0.5">Welcome Back</p>
                      <p className="font-serif text-white text-base truncate font-semibold">{user.name}</p>
                    </div>
                  </div>
                  
                  <Link
                    to="/my-bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center gap-3 py-4 px-3 border-b border-[#E5E0D8]/50 text-sm tracking-[0.15em] uppercase text-gray-600 font-serif  font-semibold hover:text-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-300 rounded-sm"
                  >
                    <Calendar size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    My Bookings
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center gap-3 py-4 px-3 border-b border-[#E5E0D8]/50 text-sm tracking-[0.15em] uppercase text-gray-600 font-serif  font-semibold hover:text-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-300 rounded-sm"
                  >
                    <Package size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="group flex items-center gap-3 py-4 px-3 mt-2 text-sm tracking-[0.15em] uppercase text-red-500 font-serif  font-bold text-left hover:bg-red-50 transition-all duration-300 rounded-sm"
                  >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}
                  className="relative w-full mt-4 bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] hover:from-[#C5A059] hover:to-[#D4AF37] text-white text-xs tracking-[0.3em] uppercase py-4 font-serif  font-bold transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-[1.02] overflow-hidden group"
                >
                  <span className="relative z-10">Login / Register</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              )}
            </div>
          </div>

          {/* Drawer Footer with elegant design */}
          <div className={`px-6 py-6 border-t border-[#E5E0D8]/50 bg-gradient-to-b from-transparent to-[#F5F3F0] transition-all duration-500 ${
            isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: isMenuOpen ? `${200 + navLinks.length * 80}ms` : "0ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.25em] text-[#1A1A1A] uppercase font-serif  font-bold mb-1">
                  BlackPepper
                </p>
                <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase font-sans">
                  Fine Dining Experience
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#D4AF37] flex items-center justify-center">
                <span className="text-white text-xs font-bold">BP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;