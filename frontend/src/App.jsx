import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import BookTable from "./pages/BookTable";
import MyBookings from "./pages/MyBookings";
import MyOrders from "./pages/MyOrders";
import Signup from "./pages/Signup";
import Rewards from "./pages/Rewards";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import AdminLayout from "./pages/admin/AdminLayout";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import Loading from "./components/Loading";
import AdminLogin from "./pages/admin/AdminLogin";
import AddCategory from "./pages/admin/AddCategory";
import AddMenu from "./pages/admin/AddMenu";
import AddOffer from "./pages/admin/AddOffer";
import Categories from "./pages/admin/Categories";
import Menus from "./pages/admin/Menus";
import Offers from "./pages/admin/Offers";
import Orders from "./pages/admin/Orders";
import Bookings from "./pages/admin/Bookings";
import Dashboard from "./pages/admin/Dashboard";
const App = () => {
  const location = useLocation();
  const adminPath = location.pathname.includes("admin");
  const isAuthPath = ['/auth', '/login', '/signup'].includes(location.pathname);
  const { admin, loading: adminLoading } = useContext(AppContext); // rename context loading
  const [isPageLoading, setIsPageLoading] = useState(true); // local page loading

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      <Toaster />
      {(isPageLoading || adminLoading) && <Loading />}
      {!adminPath && !isAuthPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu-details/:id" element={<MenuDetails />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/auth" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />

        {/* admin routes  */}
        <Route path="/admin" element={admin ? <AdminLayout /> : <AdminLogin />}>
          <Route index element={admin ? <Dashboard /> : <AdminLogin />} />
          <Route
            path="add-category"
            element={admin ? <AddCategory /> : <AdminLogin />}
          />
          <Route
            path="edit-category/:id"
            element={admin ? <AddCategory /> : <AdminLogin />}
          />
          <Route
            path="add-menu"
            element={admin ? <AddMenu /> : <AdminLogin />}
          />
          <Route
            path="edit-menu/:id"
            element={admin ? <AddMenu /> : <AdminLogin />}
          />
          <Route
            path="add-offer"
            element={admin ? <AddOffer /> : <AdminLogin />}
          />
          <Route
            path="edit-offer/:id"
            element={admin ? <AddOffer /> : <AdminLogin />}
          />
          <Route
            path="categories"
            element={admin ? <Categories /> : <AdminLogin />}
          />
          <Route
            path="offers"
            element={admin ? <Offers /> : <AdminLogin />}
          />
          <Route path="menus" element={admin ? <Menus /> : <AdminLogin />} />
          <Route path="orders" element={admin ? <Orders /> : <AdminLogin />} />
          <Route
            path="bookings"
            element={admin ? <Bookings /> : <AdminLogin />}
          />
        </Route>
      </Routes>
      {!adminPath && !isAuthPath && <Footer />}
    </div>
  );
};
export default App;
