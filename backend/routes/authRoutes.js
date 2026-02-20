import express from "express";
import {
  adminLogin,
  adminIsAuth,
  getProfile,
  isAuth,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/admin/login", adminLogin);
authRoutes.post("/logout", logoutUser);
authRoutes.get("/profile", protect, getProfile);
authRoutes.get("/is-auth", protect, isAuth);
authRoutes.get("/admin/is-auth", adminOnly, adminIsAuth);

export default authRoutes;
