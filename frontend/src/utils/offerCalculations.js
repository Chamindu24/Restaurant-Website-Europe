/**
 * ==========================================
 * OFFER ENGINE - SINGLE SOURCE OF TRUTH
 * ==========================================
 * 
 * This is a mirror of the backend offerEngine.js
 * Used by frontend for display and validation.
 * 
 * Supported Offer Types:
 * - percentage: X% off
 * - fixed: Fixed amount off
 * - bxgy: Buy X Get Y free
 * - happyHour: Percentage off during specific time windows
 * - birthday: Special offers for birthdays
 * - anniversary: Special offers for anniversaries
 */

/**
 * Check if an offer is valid at the current moment
 */
export const isOfferValid = (offer, currentDate = new Date(), userInfo = null) => {
  if (!offer || !offer.isActive) return false;

  // Check date range
  if (offer.startDate && new Date(offer.startDate) > currentDate) return false;
  if (offer.endDate && new Date(offer.endDate) < currentDate) return false;

  // Check day of week
  if (offer.validDays && offer.validDays.length > 0) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[currentDate.getDay()];
    if (!offer.validDays.includes(currentDay)) return false;
  }

  // Check time window (for happyHour type)
  if (offer.startTime && offer.endTime) {
    const currentTime = currentDate.toTimeString().slice(0, 5); // HH:MM
    if (currentTime < offer.startTime || currentTime > offer.endTime) return false;
  }

  // Check birthday offer
  if (offer.offerType === 'birthday' && userInfo?.dateOfBirth) {
    const userBirthday = new Date(userInfo.dateOfBirth);
    const isBirthday = 
      currentDate.getMonth() === userBirthday.getMonth() &&
      currentDate.getDate() === userBirthday.getDate();
    if (!isBirthday) return false;
  }

  // Check anniversary offer
  if (offer.offerType === 'anniversary' && userInfo?.anniversaryDate) {
    const userAnniversary = new Date(userInfo.anniversaryDate);
    const isAnniversary =
      currentDate.getMonth() === userAnniversary.getMonth() &&
      currentDate.getDate() === userAnniversary.getDate();
    if (!isAnniversary) return false;
  }

  return true;
};

/**
 * Check if an offer applies to a specific menu item
 */
export const doesOfferApplyToItem = (offer, menuItem) => {
  if (!offer || !menuItem) return false;

  if (offer.appliesTo === 'all') return true;

  if (offer.appliesTo === 'menu' && offer.menuItem) {
    const offerMenuId = typeof offer.menuItem === 'object' ? offer.menuItem._id : offer.menuItem;
    const itemId = menuItem._id;
    return offerMenuId?.toString() === itemId?.toString();
  }

  if (offer.appliesTo === 'category' && offer.category) {
    const offerCategoryId = typeof offer.category === 'object' ? offer.category._id : offer.category;
    const itemCategoryId = typeof menuItem.category === 'object' ? menuItem.category._id : menuItem.category;
    return offerCategoryId?.toString() === itemCategoryId?.toString();
  }

  return false;
};

/**
 * Calculate discount amount for a single item
 */
export const calculateDiscountForItem = (price, offer, quantity = 1) => {
  if (!offer || price <= 0 || quantity <= 0) return 0;

  switch (offer.offerType) {
    case 'percentage':
    case 'happyHour':
      return (price * offer.discountValue) / 100 * quantity;

    case 'fixed':
      return Math.min(offer.discountValue, price) * quantity;

    case 'bxgy': {
      const buyQty = offer.buyQuantity || 1;
      const getQty = offer.getQuantity || 1;
      const totalPerSet = buyQty + getQty;
      const completeSets = Math.floor(quantity / totalPerSet);
      const freeItems = completeSets * getQty;
      return freeItems * price;
    }

    case 'birthday':
    case 'anniversary':
      return offer.discountValue ? (price * offer.discountValue) / 100 * quantity : 0;

    default:
      return 0;
  }
};

/**
 * Get offers that apply to a menu item (for display purposes - ignores time/date validity)
 * Used for Rewards page and offer display
 */
export const getOffersThatApply = (menuItem, allOffers) => {
  if (!menuItem || !allOffers || allOffers.length === 0) return [];

  return allOffers.filter(offer => {
    // Only check: active status and if it applies to this item
    return offer.isActive && doesOfferApplyToItem(offer, menuItem);
  });
};

/**
 * Get all valid offers that apply to a menu item (strict validation for cart/purchase)
 */
export const getApplicableOffers = (menuItem, allOffers, currentDate = new Date(), userInfo = null) => {
  if (!menuItem || !allOffers || allOffers.length === 0) return [];

  return allOffers.filter(offer => {
    return isOfferValid(offer, currentDate, userInfo) && 
           doesOfferApplyToItem(offer, menuItem);
  });
};

/**
 * Calculate discount for each applicable offer and return sorted by best discount
 */
export const calculateOffersWithDiscounts = (price, quantity, applicableOffers) => {
  if (!applicableOffers || applicableOffers.length === 0) return [];

  return applicableOffers
    .map(offer => {
      const discountAmount = calculateDiscountForItem(price, offer, quantity);
      const discountedPrice = Math.max(0, price - discountAmount / quantity);
      const totalAfterDiscount = Math.max(0, price * quantity - discountAmount);

      return {
        ...offer,
        discountAmount,
        discountedPrice,
        totalAfterDiscount,
        savingPercentage: price > 0 ? ((discountAmount / (price * quantity)) * 100).toFixed(1) : 0,
      };
    })
    .sort((a, b) => b.discountAmount - a.discountAmount);
};

/**
 * Get the best offer for an item
 */
export const getBestOffer = (price, quantity, applicableOffers) => {
  const offersWithDiscounts = calculateOffersWithDiscounts(price, quantity, applicableOffers);
  return offersWithDiscounts.length > 0 ? offersWithDiscounts[0] : null;
};

/**
 * Calculate total for a cart item with best offer applied
 */
export const calculateCartItemTotal = (cartItem, allOffers, userInfo = null) => {
  if (!cartItem || !cartItem.menuItem) {
    return { subtotal: 0, discount: 0, total: 0, appliedOffer: null };
  }

  const price = cartItem.menuItem.price;
  const quantity = cartItem.quantity || 1;
  const subtotal = price * quantity;

  const applicableOffers = getApplicableOffers(
    cartItem.menuItem,
    allOffers,
    new Date(),
    userInfo
  );

  const bestOffer = getBestOffer(price, quantity, applicableOffers);

  const discount = bestOffer ? bestOffer.discountAmount : 0;
  const total = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    total,
    appliedOffer: bestOffer,
    // Legacy compatibility
    itemTotal: total,
    totalSavings: discount,
    discountAmount: bestOffer ? bestOffer.discountAmount / quantity : 0,
    discountedPrice: bestOffer ? bestOffer.discountedPrice : price,
  };
};

/**
 * Calculate totals for entire cart
 */
export const calculateCartTotals = (cartItems, allOffers, userInfo = null) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      subtotal: 0,
      totalDiscount: 0,
      grandTotal: 0,
      itemBreakdown: [],
    };
  }

  let subtotal = 0;
  let totalDiscount = 0;
  const itemBreakdown = [];

  cartItems.forEach(cartItem => {
    const itemCalc = calculateCartItemTotal(cartItem, allOffers, userInfo);
    subtotal += itemCalc.subtotal;
    totalDiscount += itemCalc.discount;

    itemBreakdown.push({
      menuItemId: cartItem.menuItem._id,
      quantity: cartItem.quantity,
      price: cartItem.menuItem.price,
      subtotal: itemCalc.subtotal,
      discount: itemCalc.discount,
      total: itemCalc.total,
      appliedOffer: itemCalc.appliedOffer,
    });
  });

  const grandTotal = Math.max(0, subtotal - totalDiscount);

  return {
    subtotal,
    totalDiscount,
    grandTotal,
    itemBreakdown,
  };
};
