import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const wishlistService = {
  getWishlist: () => apiClient.get(API_ENDPOINTS.WISHLIST.GET),
  addToWishlist: (productId) =>
    apiClient.post(API_ENDPOINTS.WISHLIST.ADD, { productId }),
  removeFromWishlist: (productId) =>
    apiClient.delete(API_ENDPOINTS.WISHLIST.REMOVE(productId)),
}
