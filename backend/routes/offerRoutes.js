import express from "express";
import { adminOnly } from "../middlewares/authMiddleware.js";
import {
  addOffer,
  deleteOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
} from "../controllers/offerController.js";

const offerRoutes = express.Router();

offerRoutes.post("/add", adminOnly, addOffer);
offerRoutes.put("/update/:id", adminOnly, updateOffer);
offerRoutes.delete("/delete/:id", adminOnly, deleteOffer);
offerRoutes.get("/all", getAllOffers);
offerRoutes.get("/:id", getOfferById);

export default offerRoutes;
