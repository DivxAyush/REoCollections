import { createSelector } from '@reduxjs/toolkit'

const selectAuthState = (state) => state.auth

export const selectUser = createSelector(selectAuthState, (auth) => auth.user)
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
)
export const selectIsInitializing = createSelector(
  selectAuthState,
  (auth) => auth.isInitializing
)
export const selectAuthLoading = createSelector(
  selectAuthState,
  (auth) => auth.isLoading
)
export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
)
