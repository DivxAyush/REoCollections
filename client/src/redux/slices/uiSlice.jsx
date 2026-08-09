import { createSlice } from '@reduxjs/toolkit'

// ============================================================
// UI SLICE — Global UI State
// Controls: mobile menu, search overlay, drawers, toast queue
// ============================================================

let toastIdCounter = 0

const initialState = {
  // Navigation
  isMobileMenuOpen: false,
  isSearchOpen: false,

  // Drawers
  isFilterDrawerOpen: false,
  isSizeGuideOpen: false,

  // Modals
  isAddressModalOpen: false,
  activeModal: null,

  // Toast notifications
  toasts: [],

  // Page
  isPageLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openMobileMenu(state) {
      state.isMobileMenuOpen = true
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },

    openSearch(state) {
      state.isSearchOpen = true
    },
    closeSearch(state) {
      state.isSearchOpen = false
    },

    openFilterDrawer(state) {
      state.isFilterDrawerOpen = true
    },
    closeFilterDrawer(state) {
      state.isFilterDrawerOpen = false
    },

    openSizeGuide(state) {
      state.isSizeGuideOpen = true
    },
    closeSizeGuide(state) {
      state.isSizeGuideOpen = false
    },

    openModal(state, action) {
      state.activeModal = action.payload
    },
    closeModal(state) {
      state.activeModal = null
    },

    setPageLoading(state, action) {
      state.isPageLoading = action.payload
    },

    // Toast management
    addToast(state, action) {
      const { message, type = 'info', duration = 3000 } = action.payload
      state.toasts.push({
        id: ++toastIdCounter,
        message,
        type,
        duration,
      })
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearToasts(state) {
      state.toasts = []
    },
  },
})

export const {
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  openSearch,
  closeSearch,
  openFilterDrawer,
  closeFilterDrawer,
  openSizeGuide,
  closeSizeGuide,
  openModal,
  closeModal,
  setPageLoading,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions

export default uiSlice.reducer

// ============================================================
// TOAST HELPER — Call from any thunk or component
// ============================================================

export const showToast = (message, type = 'info', duration = 3000) =>
  addToast({ message, type, duration })

export const showSuccess = (message) => addToast({ message, type: 'success' })
export const showError = (message) => addToast({ message, type: 'error' })
export const showInfo = (message) => addToast({ message, type: 'info' })
