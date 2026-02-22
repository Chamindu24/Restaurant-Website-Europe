import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
import { toast } from "react-hot-toast";
const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);

  const [cart, setCart] = useState({ items: [] });
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeOffersCount, setActiveOffersCount] = useState(0);

  // 🔹 Initialize guest cart from localStorage on app load
  useEffect(() => {
    if (!user) {
      const guestCart = localStorage.getItem("guestCart");
      if (guestCart) {
        try {
          setCart(JSON.parse(guestCart));
        } catch (error) {
          console.log("Error parsing guest cart:", error);
          setCart({ items: [] });
        }
      }
    }
  }, []);

  // 🔹 Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!user && cart?.items?.length > 0) {
      localStorage.setItem("guestCart", JSON.stringify(cart));
    }
  }, [cart, user]);

  const fetchCartData = async () => {
    // If user is not logged in, cart is already loaded from localStorage
    if (!user) {
      return;
    }
    
    // If user is logged in, fetch from API
    try {
      const { data } = await axios.get("/api/cart/get");
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (cart?.items) {
      const total = cart.items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      );
      setTotalPrice(total);
    }
  }, [cart]);
  const cartCount = cart?.items?.reduce(
    (acc, item) => acc + item.quantity,
    0 || 0
  );
  // 🔹 Add to Cart function
  const addToCart = async (menuId) => {
    // If user is not logged in, add to cart state (synced to localStorage)
    if (!user) {
      try {
        const menuItem = menus.find(m => m._id === menuId);
        if (!menuItem) {
          toast.error("Menu item not found");
          return;
        }
        
        const existingItem = cart.items?.find(item => item.menuItem._id === menuId);
        
        if (existingItem) {
          setCart({
            ...cart,
            items: cart.items.map(item =>
              item.menuItem._id === menuId 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          setCart({
            ...cart,
            items: [...(cart.items || []), {
              menuItem,
              quantity: 1,
              _id: `${menuId}-${Date.now()}`
            }]
          });
        }
        toast.success("Item added to cart!");
        return;
      } catch (error) {
        console.error("Add to guest cart error:", error);
        toast.error("Something went wrong!");
        return;
      }
    }
    
    // If user is logged in, use API
    try {
      const { data } = await axios.post("/api/cart/add", {
        menuId,
        quantity: 1,
      });
      if (data.success) {
        toast.success(data.message);
        fetchCartData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong!");
    }
  };

  // 🔹 Remove from Cart function
  const removeFromCart = async (menuId) => {
    // If guest user, update state (synced to localStorage)
    if (!user) {
      setCart({
        ...cart,
        items: cart.items?.filter(item => item.menuItem._id !== menuId) || []
      });
      toast.success("Item removed from cart");
      return;
    }
    
    // If logged in user, use API
    try {
      const { data } = await axios.delete(`/api/cart/remove/${menuId}`);
      if (data.success) {
        toast.success(data.message);
        fetchCartData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  };

  // 🔹 Update Quantity function
  const updateQuantity = async (menuId, nextQuantity) => {
    // If guest user, update state (synced to localStorage)
    if (!user) {
      setCart({
        ...cart,
        items: cart.items?.map(item =>
          item.menuItem._id === menuId 
            ? { ...item, quantity: nextQuantity }
            : item
        ) || []
      });
      return;
    }
    
    // If logged in user, use API
    try {
      const { data } = await axios.patch(`/api/cart/update/${menuId}`, {
        quantity: nextQuantity,
      });
      if (data.success) {
        fetchCartData();
      } else {
        toast.error(data.message || "Unable to update cart");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update cart");
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/category/all");

      if (data.success) {
        setCategories(data.categories);
      } else {
        console.log("Failed to fetch categories");
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/menu/all");

      if (data.success) {
        setMenus(data.menuItems);
      } else {
        console.log("Failed to fetch menus");
      }
    } catch (error) {
      console.log("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveOffersCount = async () => {
    try {
      const { data } = await axios.get("/api/offer/all");
      if (data.success) {
        const activeCount = data.offers.filter((offer) => offer.isActive).length;
        setActiveOffersCount(activeCount);
      }
    } catch (error) {
      console.log("Error fetching offers:", error);
    }
  };

  const isAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/is-auth");
      if (data.success) {
        setUser(data.user);
        
        // 🔹 Merge guest cart into database cart when user logs in
        const guestCart = localStorage.getItem("guestCart");
        if (guestCart) {
          try {
            const parsedGuestCart = JSON.parse(guestCart);
            if (parsedGuestCart.items && parsedGuestCart.items.length > 0) {
              // Merge guest cart items into server cart
              for (const item of parsedGuestCart.items) {
                await axios.post("/api/cart/add", {
                  menuId: item.menuItem._id,
                  quantity: item.quantity,
                });
              }
              // Clear guest cart from localStorage
              localStorage.removeItem("guestCart");
              // Fetch updated cart from server
              setTimeout(() => fetchCartData(), 500);
            }
          } catch (error) {
            console.log("Error merging guest cart:", error);
          }
        }
      }
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };

  const adminIsAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/admin/is-auth");
      if (data.success) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    } catch (error) {
      setAdmin(false);
    }
  };

  useEffect(() => {
    isAuth();
    adminIsAuth();
    fetchCategories();
    fetchMenus();
    fetchActiveOffersCount();
  }, []);

  // Fetch server cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCartData();
    }
  }, [user]);

  const value = {
    navigate,
    loading,
    setLoading,
    user,
    setUser,
    axios,
    admin,
    setAdmin,
    categories,
    fetchCategories,
    menus,
    fetchMenus,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cart,
    totalPrice,
    fetchCartData,
    activeOffersCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
