import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const categoryService = {
  getCategories: () => apiClient.get(API_ENDPOINTS.CATEGORIES.LIST),
  getCategoryBySlug: (slug) => apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(slug)),
}
