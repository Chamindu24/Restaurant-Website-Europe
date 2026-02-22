import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    offerType: {
      type: String,
      enum: ["percentage", "fixed", "bxgy", "birthday", "anniversary", "happyHour"],
      required: true,
    },
    discountValue: {
      type: Number,
    },
    buyQuantity: Number,
    getQuantity: Number,
    appliesTo: {
      type: String,
      enum: ["menu", "category", "all"],
      required: true,
    },
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    validDays: {
      type: [String],
    },
    startTime: String,
    endTime: String,
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
