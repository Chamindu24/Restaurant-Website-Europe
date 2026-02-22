import Offer from "../models/offerModel.js";

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return undefined;
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  return value === "true";
};

const toObjectIdOrUndefined = (value) => {
  if (!value || value === "") return undefined;
  return value;
};

const validateOffer = (payload) => {
  const errors = [];
  if (!payload.title) errors.push("Title is required");
  if (!payload.offerType) errors.push("Offer type is required");
  if (!payload.appliesTo) errors.push("Applies to is required");

  if (["percentage", "fixed"].includes(payload.offerType)) {
    if (payload.discountValue === undefined) errors.push("Discount value is required");
  }

  if (payload.offerType === "bxgy") {
    if (!payload.buyQuantity || !payload.getQuantity) {
      errors.push("Buy and get quantities are required");
    }
  }

  if (payload.appliesTo === "menu" && !payload.menuItem) {
    errors.push("Menu item is required for menu offers");
  }

  if (payload.appliesTo === "category" && !payload.category) {
    errors.push("Category is required for category offers");
  }

  return errors;
};

export const addOffer = async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      offerType: req.body.offerType,
      discountValue: toNumber(req.body.discountValue),
      buyQuantity: toNumber(req.body.buyQuantity),
      getQuantity: toNumber(req.body.getQuantity),
      appliesTo: req.body.appliesTo,
      menuItem: toObjectIdOrUndefined(req.body.menuItem),
      category: toObjectIdOrUndefined(req.body.category),
      validDays: normalizeArray(req.body.validDays),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      startDate: req.body.startDate || undefined,
      endDate: req.body.endDate || undefined,
      isActive: toBoolean(req.body.isActive),
    };

    const errors = validateOffer(payload);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const offer = await Offer.create(payload);
    res.status(201).json({ success: true, message: "Offer created", offer });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("menuItem", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id)
      .populate("menuItem", "name")
      .populate("category", "name");

    if (!offer) {
      return res
        .status(404)
        .json({ message: "Offer not found", success: false });
    }

    res.status(200).json({ success: true, offer });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);
    if (!offer) {
      return res
        .status(404)
        .json({ message: "Offer not found", success: false });
    }

    const nextPayload = {
      title: req.body.title ?? offer.title,
      description: req.body.description ?? offer.description,
      offerType: req.body.offerType ?? offer.offerType,
      discountValue:
        toNumber(req.body.discountValue) ?? offer.discountValue,
      buyQuantity: toNumber(req.body.buyQuantity) ?? offer.buyQuantity,
      getQuantity: toNumber(req.body.getQuantity) ?? offer.getQuantity,
      appliesTo: req.body.appliesTo ?? offer.appliesTo,
      menuItem: req.body.menuItem !== undefined ? toObjectIdOrUndefined(req.body.menuItem) : offer.menuItem,
      category: req.body.category !== undefined ? toObjectIdOrUndefined(req.body.category) : offer.category,
      validDays: normalizeArray(req.body.validDays) ?? offer.validDays,
      startTime: req.body.startTime ?? offer.startTime,
      endTime: req.body.endTime ?? offer.endTime,
      startDate: req.body.startDate ?? offer.startDate,
      endDate: req.body.endDate ?? offer.endDate,
      isActive: toBoolean(req.body.isActive) ?? offer.isActive,
    };

    const errors = validateOffer(nextPayload);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    offer.title = nextPayload.title;
    offer.description = nextPayload.description;
    offer.offerType = nextPayload.offerType;
    offer.discountValue = nextPayload.discountValue;
    offer.buyQuantity = nextPayload.buyQuantity;
    offer.getQuantity = nextPayload.getQuantity;
    offer.appliesTo = nextPayload.appliesTo;
    offer.menuItem = nextPayload.menuItem;
    offer.category = nextPayload.category;
    offer.validDays = nextPayload.validDays;
    offer.startTime = nextPayload.startTime;
    offer.endTime = nextPayload.endTime;
    offer.startDate = nextPayload.startDate;
    offer.endDate = nextPayload.endDate;
    offer.isActive = nextPayload.isActive;

    await offer.save();
    res
      .status(200)
      .json({ success: true, message: "Offer updated", offer });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) {
      return res
        .status(404)
        .json({ message: "Offer not found", success: false });
    }

    res.status(200).json({ success: true, message: "Offer deleted" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};
