import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Layers,
  ShoppingBag,
  CalendarCheck,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  X,
  Menu,
  BarChart3,
  Bell,
  Search,
  ChefHatIcon
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const AdminLayout = () => {
  const { setAdmin, axios } = useContext(AppContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Expanded to 11 Categories for a full, professional feel
  const menuItems = [
    { path: "/admin", name: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/admin/add-category", name: "Create Category", icon: PlusCircle },
    { path: "/admin/categories", name: "All Categories", icon: Layers },
    { path: "/admin/add-menu", name: "Add New Menu", icon: Package },
    { path: "/admin/menus", name: "All Menus", icon: Package },
    { path: "/admin/orders", name: " Orders", icon: ShoppingBag },
    { path: "/admin/bookings", name: "Bookings", icon: CalendarCheck },

  ];

  const isActive = (path) => location.pathname === path;

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        toast.success("Securely logged out");
        setAdmin(false);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCFB]">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-5 left-5 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl bg-stone-900 text-amber-400 shadow-2xl"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-stone-950 text-stone-300 transform transition-all duration-500 ease-in-out border-r border-stone-800
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.4)]" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand Identity */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center">
                <ChefHatIcon className="text-stone-950 w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-white font-serif text-xl tracking-tight">Black Pepper</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3.5 text-sm font-light transition-all duration-300 rounded-xl group
                    ${active 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                      : "hover:bg-stone-900 hover:text-white border border-transparent"}
                  `}
                >
                  <Icon size={18} className={`mr-4 transition-colors ${active ? "text-amber-400" : "text-stone-500 group-hover:text-amber-400"}`} />
                  <span className={active ? "font-medium" : ""}>{item.name}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer: Admin Profile */}
          <div className="p-6 bg-stone-900/50 border-t border-stone-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-500 font-serif">
                  A
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-stone-900 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-100"> Admin User</div>
                <div>admin@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-stone-100 flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-semibold font-serif text-stone-900">
              {menuItems.find((item) => isActive(item.path))?.name || "Registry Overview"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
              <Search size={16} className="text-stone-400 mr-2" />
              <input type="text" placeholder="Quick search..." className="bg-transparent text-sm outline-none w-48 font-light" />
            </div>
            
            <button className="relative text-stone-400 hover:text-stone-900 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
            </button>

            <div className="h-6 w-[1px] bg-stone-200 mx-2" />

            <button 
              onClick={logout}
              className="flex cursor-pointer items-center gap-2 text-stone-500 hover:text-red-600 transition-all text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#F9F8F6]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;