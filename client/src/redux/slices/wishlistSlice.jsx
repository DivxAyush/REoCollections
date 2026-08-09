import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { wishlistService } from '@/services/wishlistService'

const WISHLIST_KEY = 'reo_wishlist'

function loadWishlistFromStorage() {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveWishlistToStorage(productIds) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(productIds))
  } catch {
    // noop
  }
}

// ============================================================
// ASYNC THUNKS (authenticated sync)
// ============================================================

export const syncWishlistFromServer = createAsyncThunk(
  'wishlist/syncFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wishlistService.getWishlist()
      return data.productIds || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync wishlist')
    }
  }
)

export const addToWishlistServer = createAsyncThunk(
  'wishlist/addServer',
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistService.addToWishlist(productId)
      return productId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist')
    }
  }
)

export const removeFromWishlistServer = createAsyncThunk(
  'wishlist/removeServer',
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(productId)
      return productId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist')
    }
  }
)

// ============================================================
// SLICE
// ============================================================

const initialState = {
  productIds: loadWishlistFromStorage(), // Array of product ID strings
  isLoading: false,
  error: null,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem(state, action) {
      const productId = action.payload
      const exists = state.productIds.includes(productId)
      if (exists) {
        state.productIds = state.productIds.filter((id) => id !== productId)
      } else {
        state.productIds.push(productId)
      }
      saveWishlistToStorage(state.productIds)
    },

    addToWishlist(state, action) {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload)
        saveWishlistToStorage(state.productIds)
      }
    },

    removeFromWishlist(state, action) {
      state.productIds = state.productIds.filter((id) => id !== action.payload)
      saveWishlistToStorage(state.productIds)
    },

    clearWishlist(state) {
      state.productIds = []
      saveWishlistToStorage([])
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncWishlistFromServer.fulfilled, (state, action) => {
        state.productIds = action.payload
        saveWishlistToStorage(state.productIds)
      })
      .addCase(addToWishlistServer.fulfilled, (state, action) => {
        if (!state.productIds.includes(action.payload)) {
          state.productIds.push(action.payload)
          saveWishlistToStorage(state.productIds)
        }
      })
      .addCase(removeFromWishlistServer.fulfilled, (state, action) => {
        state.productIds = state.productIds.filter((id) => id !== action.payload)
        saveWishlistToStorage(state.productIds)
      })
  },
})

export const {
  toggleWishlistItem,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions

export default wishlistSlice.reducer
