import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartService } from '@/services/cartService'

// ============================================================
// HELPERS
// ============================================================

const CART_STORAGE_KEY = 'reo_cart'

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // noop
  }
}

function generateCartItemId(productId, variantKey) {
  return `${productId}_${variantKey || 'default'}`
}

// ============================================================
// ASYNC THUNKS (for authenticated users)
// ============================================================

export const syncCartFromServer = createAsyncThunk(
  'cart/syncFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart()
      return data.items || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync cart')
    }
  }
)

export const syncCartToServer = createAsyncThunk(
  'cart/syncToServer',
  async (items, { rejectWithValue }) => {
    try {
      await cartService.syncCart(items)
      return items
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync cart')
    }
  }
)

// ============================================================
// SLICE
// ============================================================

const initialState = {
  items: loadCartFromStorage(),
  isLoading: false,
  error: null,
  isSyncing: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { product, variant, quantity = 1 } = action.payload
      const variantKey = variant
        ? `${variant.color || ''}_${variant.size || ''}`
        : 'default'
      const itemId = generateCartItemId(product._id, variantKey)

      const existingItem = state.items.find((item) => item.itemId === itemId)

      if (existingItem) {
        // Don't exceed stock
        const maxStock = variant?.stock ?? product.stock ?? 99
        existingItem.quantity = Math.min(existingItem.quantity + quantity, maxStock)
      } else {
        state.items.push({
          itemId,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          image: variant?.image || product.images?.[0]?.url || '',
          price: variant?.price ?? product.price,
          compareAtPrice: product.compareAtPrice || null,
          variant: variant || null,
          quantity,
          stock: variant?.stock ?? product.stock ?? 99,
        })
      }

      saveCartToStorage(state.items)
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.itemId !== action.payload)
      saveCartToStorage(state.items)
    },

    updateQuantity(state, action) {
      const { itemId, quantity } = action.payload
      const item = state.items.find((i) => i.itemId === itemId)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.itemId !== itemId)
        } else {
          item.quantity = Math.min(quantity, item.stock)
        }
        saveCartToStorage(state.items)
      }
    },

    clearCart(state) {
      state.items = []
      saveCartToStorage([])
    },

    setCartItems(state, action) {
      state.items = action.payload
      saveCartToStorage(state.items)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartFromServer.pending, (state) => {
        state.isSyncing = true
      })
      .addCase(syncCartFromServer.fulfilled, (state, action) => {
        state.isSyncing = false
        state.items = action.payload
        saveCartToStorage(state.items)
      })
      .addCase(syncCartFromServer.rejected, (state, action) => {
        state.isSyncing = false
        state.error = action.payload
      })
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
} = cartSlice.actions

export default cartSlice.reducer
