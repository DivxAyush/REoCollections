import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const productService = {
  getProducts: (params) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params }),

  getProductBySlug: (slug) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(slug)),

  getFeatured: (params) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED, { params }),

  getNewArrivals: (params) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS, { params }),

  getBestSellers: (params) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS.BEST_SELLERS, { params }),

  search: (query, params) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { q: query, ...params },
    }),
}
