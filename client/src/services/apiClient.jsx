import axios from 'axios'
import env from '@/config/env'
import { tokenStorage } from '@/utils/tokenStorage'

// ============================================================
// AXIOS INSTANCE — REo Collection API Client
// ============================================================

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================
// REQUEST INTERCEPTOR — Attach JWT token
// ============================================================

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ============================================================
// RESPONSE INTERCEPTOR — Handle 401 / common errors
// ============================================================

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage
      // The auth slice will handle the UI redirect
      tokenStorage.remove()
    }
    return Promise.reject(error)
  }
)

export default apiClient
