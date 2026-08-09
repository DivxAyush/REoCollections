import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const authService = {
  register: (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  login: (credentials) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  getMe: () => apiClient.get(API_ENDPOINTS.AUTH.ME),
  forgotPassword: (email) =>
    apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  resetPassword: (token, password) =>
    apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
}
