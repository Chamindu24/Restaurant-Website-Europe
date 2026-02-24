import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Menu from "../models/menuModel.js";

const updateMenuReviewStats = async (menuId) => {
  const stats = await Review.aggregate([
    { $match: { menu: new mongoose.Types.ObjectId(menuId) } },
    {
      $group: {
        _id: "$menu",
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats.length ? Number(stats[0].avgRating.toFixed(2)) : 5;
  const reviewCount = stats.length ? stats[0].reviewCount : 0;

  await Menu.findByIdAndUpdate(menuId, { averageRating, reviewCount });

  return { averageRating, reviewCount };
};

export const addReview = async (req, res) => {
  try {
    const { menuId, rating, comment } = req.body;

    if (!menuId || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Menu and rating are required" });
    }

    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      menu: menuId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this menu item",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      menu: menuId,
      rating: parsedRating,
      comment,
    });

    const { averageRating, reviewCount } = await updateMenuReviewStats(menuId);
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Review submitted",
      review: populatedReview,
      averageRating,
      reviewCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this menu item",
      });
    }

    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getReviewsByMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findById(menuId).select("averageRating reviewCount");
    if (!menu) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    const reviews = await Review.find({ menu: menuId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
      averageRating: menu.averageRating,
      reviewCount: menu.reviewCount,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
