import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addReview, getReviewsByMenu } from "../controllers/reviewController.js";

const reviewRoutes = express.Router();

reviewRoutes.post("/add", protect, addReview);
reviewRoutes.get("/menu/:menuId", getReviewsByMenu);

export default reviewRoutes;
