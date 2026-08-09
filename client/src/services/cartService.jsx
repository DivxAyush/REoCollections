import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const cartService = {
  getCart: () => apiClient.get(API_ENDPOINTS.CART.GET),
  addToCart: (item) => apiClient.post(API_ENDPOINTS.CART.ADD, item),
  updateCartItem: (itemId, data) =>
    apiClient.put(API_ENDPOINTS.CART.UPDATE(itemId), data),
  removeCartItem: (itemId) =>
    apiClient.delete(API_ENDPOINTS.CART.REMOVE(itemId)),
  clearCart: () => apiClient.delete(API_ENDPOINTS.CART.CLEAR),
  syncCart: (items) => apiClient.post(API_ENDPOINTS.CART.ADD, { items }),
}
