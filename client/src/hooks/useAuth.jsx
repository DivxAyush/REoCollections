import { useSelector, useDispatch } from 'react-redux'
import {
  selectUser,
  selectIsAuthenticated,
  selectIsInitializing,
  selectAuthLoading,
  selectAuthError,
} from '@/redux/selectors/authSelectors'
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
} from '@/redux/slices/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isInitializing = useSelector(selectIsInitializing)
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const login = (credentials) => dispatch(loginUser(credentials))
  const register = (userData) => dispatch(registerUser(userData))
  const logout = () => dispatch(logoutUser())
  const dismissError = () => dispatch(clearError())

  return {
    user,
    isAuthenticated,
    isInitializing,
    isLoading,
    error,
    login,
    register,
    logout,
    dismissError,
  }
}
