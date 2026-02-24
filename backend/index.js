import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinary.js";
dotenv.config();
const app = express();
// database connection
connectDB();
connectCloudinary();
// middlewares
app.use(express.json());
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://blackpepper-five.vercel.app",
  "http://localhost:5173",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello from server");
});
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/review", reviewRoutes);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
