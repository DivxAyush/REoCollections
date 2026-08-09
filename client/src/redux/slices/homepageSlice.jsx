import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { homepageService } from '@/services/homepageService'

// ============================================================
// ASYNC THUNKS
// ============================================================

export const fetchHomepageData = createAsyncThunk(
  'homepage/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await homepageService.getHomepageData()
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load homepage'
      )
    }
  }
)

// ============================================================
// SLICE
// ============================================================

const initialState = {
  banners: [],
  sections: [],
  featuredProducts: [],
  categories: [],
  collections: [],
  isLoading: false,
  error: null,
  lastFetched: null,
}

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    clearHomepageError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchHomepageData.fulfilled, (state, action) => {
        state.isLoading = false
        state.banners = action.payload.banners || []
        state.sections = action.payload.sections || []
        state.featuredProducts = action.payload.featuredProducts || []
        state.categories = action.payload.categories || []
        state.collections = action.payload.collections || []
        state.lastFetched = Date.now()
      })
      .addCase(fetchHomepageData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearHomepageError } = homepageSlice.actions
export default homepageSlice.reducer
