import { useMemo } from 'react';
import { getApplicableOffers } from '../utils/offerCalculations';

/**
 * Hook to enrich menu items with their applicable offers
 * This is the single source of truth for offer resolution in the frontend
 * 
 * @param {Array} menus - Array of menu items
 * @param {Array} offers - Array of all offers
 * @param {Object} userInfo - Optional user info for birthday/anniversary offers
 * @returns {Array} - Menu items enriched with applicable offers
 */
export const useOfferEngine = (menus, offers, userInfo = null) => {
  const enrichedMenus = useMemo(() => {
    if (!menus || menus.length === 0) return [];
    if (!offers || offers.length === 0) return menus.map(m => ({ ...m, offers: [] }));

    return menus.map(menuItem => {
      const applicableOffers = getApplicableOffers(
        menuItem,
        offers,
        new Date(),
        userInfo
      );

      return {
        ...menuItem,
        offers: applicableOffers,
      };
    });
  }, [menus, offers, userInfo]);

  return enrichedMenus;
};
