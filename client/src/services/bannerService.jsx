import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const bannerService = {
  getBanners: () => apiClient.get(API_ENDPOINTS.BANNERS.LIST),
  getActiveBanners: () => apiClient.get(API_ENDPOINTS.BANNERS.ACTIVE),
}
