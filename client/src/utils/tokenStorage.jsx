// ============================================================
// JWT Token Storage — REo Collection
// Manages auth token in localStorage
// ============================================================

const TOKEN_KEY = 'reo_auth_token'

export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
  },

  remove() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // noop
    }
  },

  exists() {
    return Boolean(this.get())
  },
}
