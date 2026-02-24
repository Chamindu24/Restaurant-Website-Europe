/**
 * ==========================================
 * OFFER ENGINE - SINGLE SOURCE OF TRUTH
 * ==========================================
 * 
 * This module handles ALL offer/discount logic.
 * Used by both backend (order calculation) and frontend (display).
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
 * @param {Object} offer - The offer object
 * @param {Date} currentDate - Current date/time (defaults to now)
 * @param {Object} userInfo - Optional user info for birthday/anniversary offers
 * @returns {boolean}
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
 * @param {Object} offer - The offer object
 * @param {Object} menuItem - The menu item object
 * @returns {boolean}
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
 * Calculate discount amount for a single item (quantity = 1)
 * @param {Number} price - Item price
 * @param {Object} offer - The offer object
 * @param {Number} quantity - Quantity of items (for bxgy)
 * @returns {Number} - Total discount amount
 */
export const calculateDiscountForItem = (price, offer, quantity = 1) => {
  if (!offer || price <= 0 || quantity <= 0) return 0;

  switch (offer.offerType) {
    case 'percentage':
    case 'happyHour': // happyHour is just a percentage with time restrictions
      return (price * offer.discountValue) / 100 * quantity;

    case 'fixed':
      // Fixed discount per item, but never exceed item price
      return Math.min(offer.discountValue, price) * quantity;

    case 'bxgy': {
      // Buy X Get Y free
      const buyQty = offer.buyQuantity || 1;
      const getQty = offer.getQuantity || 1;
      const totalPerSet = buyQty + getQty;
      
      // How many complete sets?
      const completeSets = Math.floor(quantity / totalPerSet);
      
      // Free items = completeSets * getQty
      const freeItems = completeSets * getQty;
      
      // Discount is the price of free items
      return freeItems * price;
    }

    case 'birthday':
    case 'anniversary':
      // These typically work like percentage offers
      return offer.discountValue ? (price * offer.discountValue) / 100 * quantity : 0;

    default:
      return 0;
  }
};

/**
 * Get all valid offers that apply to a menu item
 * @param {Object} menuItem - The menu item
 * @param {Array} allOffers - Array of all offers
 * @param {Date} currentDate - Current date/time
 * @param {Object} userInfo - Optional user info
 * @returns {Array} - Array of valid applicable offers
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
 * @param {Number} price - Item price
 * @param {Number} quantity - Item quantity
 * @param {Array} applicableOffers - Array of applicable offers
 * @returns {Array} - Offers with calculated discount amounts, sorted by best discount
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
        discountAmount, // Total discount for all items
        discountedPrice, // Price per item after discount
        totalAfterDiscount, // Total price after discount
        savingPercentage: price > 0 ? ((discountAmount / (price * quantity)) * 100).toFixed(1) : 0,
      };
    })
    .sort((a, b) => b.discountAmount - a.discountAmount); // Best discount first
};

/**
 * Get the best offer for an item
 * @param {Number} price - Item price
 * @param {Number} quantity - Item quantity
 * @param {Array} applicableOffers - Array of applicable offers
 * @returns {Object|null} - Best offer with calculations or null
 */
export const getBestOffer = (price, quantity, applicableOffers) => {
  const offersWithDiscounts = calculateOffersWithDiscounts(price, quantity, applicableOffers);
  return offersWithDiscounts.length > 0 ? offersWithDiscounts[0] : null;
};

/**
 * Calculate total for a cart item with best offer applied
 * @param {Object} cartItem - Cart item with { menuItem, quantity }
 * @param {Array} allOffers - All available offers
 * @param {Object} userInfo - Optional user info
 * @returns {Object} - { subtotal, discount, total, appliedOffer }
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
  };
};

/**
 * Calculate totals for entire cart
 * @param {Array} cartItems - Array of cart items
 * @param {Array} allOffers - All available offers
 * @param {Object} userInfo - Optional user info
 * @returns {Object} - { subtotal, totalDiscount, grandTotal, itemBreakdown }
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
