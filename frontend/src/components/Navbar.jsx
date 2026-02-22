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

const Navbar = () => {
  const { navigate, user, setUser, axios, cartCount, activeOffersCount } = useContext(AppContext);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

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

  return (
    <>
      <nav
        className={`sticky top-0 z-[100] transition-colors duration-500 ${
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
            <div className="hidden md:flex items-center space-x-14">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative transition-all duration-300 font-serif italic text-md tracking-[0.2em] uppercase font-extrabold ${
                    isScrolled
                      ? "text-[#1f1e1e] hover:text-[#C5A059]"
                      : "text-[#EDEDED] hover:text-[#C5A059]"
                  }`}
                >
                  {link.name}
                  {link.name === "Rewards" && activeOffersCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-[#C5A059] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
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
                onClick={() => navigate("/cart")}
                className={`relative cursor-pointer p-2 transition-colors group ${
                  isScrolled
                    ? "text-[#4A4A4A] hover:text-[#C5A059]"
                    : "text-[#EDEDED] hover:text-[#C5A059]"
                }`}
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#C5A059] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
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
        className={`fixed inset-0 z-[99] md:hidden transition-all duration-500 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer — slides in from right */}
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-[#FCFBFA] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 h-14 sm:h-16 border-b border-[#E5E0D8]">
            <span className="font-serif italic text-[#C5A059] text-lg font-semibold tracking-wide">
              Menu
            </span>
            <button onClick={() => setIsMenuOpen(false)} className="text-[#4A4A4A] p-1">
              <X size={22} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col px-6 pt-8 gap-1 flex-1 overflow-y-auto">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="py-4 border-b border-[#E5E0D8] text-[#2A2A2A] text-sm tracking-[0.25em] uppercase font-serif italic font-semibold hover:text-[#C5A059] transition-colors flex items-center justify-between"
                style={{ transitionDelay: isMenuOpen ? `${i * 60}ms` : "0ms" }}
              >
                <span>{link.name}</span>
                {link.name === "Rewards" && activeOffersCount > 0 && (
                  <span className="bg-[#C5A059] text-white text-[10px] rounded-full px-2 py-0.5 font-bold">
                    {activeOffersCount}
                  </span>
                )}
              </Link>
            ))}

            {/* Account Section */}
            <div className="mt-6">
              {user ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 py-3 border-b border-[#E5E0D8]">
                    <UserCircle size={22} strokeWidth={1.2} className="text-[#C5A059]" />
                    <span className="font-serif text-[#1A1A1A] text-sm truncate">{user.name}</span>
                  </div>
                  <Link
                    to="/my-bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-4 border-b border-[#E5E0D8] text-sm tracking-[0.2em] uppercase text-gray-500 font-serif italic font-semibold hover:text-[#C5A059] transition-colors"
                  >
                    <Calendar size={16} className="opacity-60" />
                    My Bookings
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-4 border-b border-[#E5E0D8] text-sm tracking-[0.2em] uppercase text-gray-500 font-serif italic font-semibold hover:text-[#C5A059] transition-colors"
                  >
                    <Package size={16} className="opacity-60" />
                    My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 py-4 text-sm tracking-[0.2em] uppercase text-red-500 font-serif italic font-semibold text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}
                  className="w-full mt-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs tracking-[0.3em] uppercase py-4 font-serif italic font-semibold transition-colors duration-300"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-6 border-t border-[#E5E0D8]">
            <p className="text-[10px] tracking-[0.3em] text-stone-400 uppercase font-sans">
              BlackPepper
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;