// ============================================================
// ROUTE CONSTANTS — REo Collection
// Centralized route paths — never hardcode routes in components
// ============================================================

export const ROUTES = {
  // Public
  HOME: '/',
  SHOP: '/shop',
  SHOP_CATEGORY: '/shop/:category',
  PRODUCT: '/product/:slug',
  SEARCH: '/search',
  CART: '/cart',
  WISHLIST: '/wishlist',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Checkout
  CHECKOUT: '/checkout',

  // Account (protected)
  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ORDER_DETAIL: '/account/orders/:id',
  ACCOUNT_WISHLIST: '/account/wishlist',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_SETTINGS: '/account/settings',

  // Utility
  NOT_FOUND: '/404',
}

// Helper: build dynamic route with params
export const buildRoute = (route, params = {}) => {
  let path = route
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value)
  })
  return path
}
