import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const orderService = {
  createOrder: (orderData) => apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData),
  getOrders: (params) => apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params }),
  getOrderById: (id) => apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id)),
  cancelOrder: (id) => apiClient.post(API_ENDPOINTS.ORDERS.CANCEL(id)),
}
