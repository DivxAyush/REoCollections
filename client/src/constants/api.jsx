// ============================================================
// API ENDPOINT CONSTANTS — REo Collection
// ============================================================

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    BATCH: '/products/batch',
    DETAIL: (slug) => `/products/${slug}`,
    FEATURED: '/products/featured',
    NEW_ARRIVALS: '/products/new-arrivals',
    BEST_SELLERS: '/products/best-sellers',
    SEARCH: '/products/search',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (slug) => `/categories/${slug}`,
  },

  // Banners
  BANNERS: {
    LIST: '/banners',
    ACTIVE: '/banners/active',
  },

  // Homepage
  HOMEPAGE: '/homepage',

  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE: (itemId) => `/cart/${itemId}`,
    REMOVE: (itemId) => `/cart/${itemId}`,
    CLEAR: '/cart/clear',
  },

  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist',
    REMOVE: (productId) => `/wishlist/${productId}`,
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
  },

  // Payment
  PAYMENT: {
    CREATE_ORDER: '/payment/razorpay/create-order',
    VERIFY: '/payment/razorpay/verify',
  },

  // Addresses
  ADDRESSES: {
    LIST: '/users/addresses',
    CREATE: '/users/addresses',
    UPDATE: (id) => `/users/addresses/${id}`,
    DELETE: (id) => `/users/addresses/${id}`,
    SET_DEFAULT: (id) => `/users/addresses/${id}/default`,
  },

  // Reviews
  REVIEWS: {
    LIST: (productId) => `/products/${productId}/reviews`,
    CREATE: (productId) => `/products/${productId}/reviews`,
  },

  // Admin
  ADMIN: {
    USERS: '/users/all',
    CREATE_PRODUCT: '/products',
    UPDATE_PRODUCT: (id) => `/products/${id}`,
    DELETE_PRODUCT: (id) => `/products/${id}`,
    CREATE_CATEGORY: '/categories',
    UPDATE_CATEGORY: (id) => `/categories/${id}`,
    DELETE_CATEGORY: (id) => `/categories/${id}`,
    ORDERS: '/orders/admin/all',
    UPDATE_ORDER_STATUS: (id) => `/orders/admin/${id}/status`,
  },

  // Upload
  UPLOAD: '/upload',
}
