import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export const addressService = {
  getAddresses: () => apiClient.get(API_ENDPOINTS.ADDRESSES.LIST),
  createAddress: (data) => apiClient.post(API_ENDPOINTS.ADDRESSES.CREATE, data),
  updateAddress: (id, data) =>
    apiClient.put(API_ENDPOINTS.ADDRESSES.UPDATE(id), data),
  deleteAddress: (id) => apiClient.delete(API_ENDPOINTS.ADDRESSES.DELETE(id)),
  setDefault: (id) => apiClient.patch(API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id)),
}
