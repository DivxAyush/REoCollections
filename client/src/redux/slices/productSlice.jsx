import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '@/services/productService'

// ============================================================
// ASYNC THUNKS
// ============================================================

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(params)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductBySlug = createAsyncThunk(
  'product/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const data = await productService.getProductBySlug(slug)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Product not found')
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'product/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getFeatured()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products')
    }
  }
)

export const fetchNewArrivals = createAsyncThunk(
  'product/fetchNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getNewArrivals()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals')
    }
  }
)

// ============================================================
// SLICE
// ============================================================

const initialState = {
  // Product listing (shop page)
  products: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  isLoadingProducts: false,

  // Product detail
  currentProduct: null,
  isLoadingProduct: false,

  // Featured / New Arrivals
  featured: [],
  isLoadingFeatured: false,
  newArrivals: [],
  isLoadingNewArrivals: false,

  // Filters state (reflected from query params)
  activeFilters: {},

  error: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setActiveFilters(state, action) {
      state.activeFilters = action.payload
    },
    clearActiveFilters(state) {
      state.activeFilters = {}
    },
    clearCurrentProduct(state) {
      state.currentProduct = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch product list
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoadingProducts = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoadingProducts = false
        state.products = action.payload.products
        state.totalProducts = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoadingProducts = false
        state.error = action.payload
      })

    // Fetch product by slug
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoadingProduct = true
        state.currentProduct = null
        state.error = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoadingProduct = false
        state.currentProduct = action.payload.product
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoadingProduct = false
        state.error = action.payload
      })

    // Featured
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoadingFeatured = true
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoadingFeatured = false
        state.featured = action.payload.products
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoadingFeatured = false
        state.error = action.payload
      })

    // New Arrivals
    builder
      .addCase(fetchNewArrivals.pending, (state) => {
        state.isLoadingNewArrivals = true
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.isLoadingNewArrivals = false
        state.newArrivals = action.payload.products
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.isLoadingNewArrivals = false
        state.error = action.payload
      })
  },
})

export const {
  setActiveFilters,
  clearActiveFilters,
  clearCurrentProduct,
  clearError,
} = productSlice.actions

export default productSlice.reducer
