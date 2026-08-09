import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const reviewService = {
  getReviews: (productId, params) =>
    apiClient.get(API_ENDPOINTS.REVIEWS.LIST(productId), { params }),
  createReview: (productId, data) =>
    apiClient.post(API_ENDPOINTS.REVIEWS.CREATE(productId), data),
}
