import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const homepageService = {
  getHomepageData: () => apiClient.get(API_ENDPOINTS.HOMEPAGE),
}
