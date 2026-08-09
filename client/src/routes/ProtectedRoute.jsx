import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectIsAuthenticated,
  selectIsInitializing,
} from '@/redux/selectors/authSelectors'
import { PageLoader } from '@/components/ui/Loader'
import { ROUTES } from '@/constants/routes'

/**
 * Protects routes that require authentication.
 * While auth is initializing (checking token), shows a loader.
 * If not authenticated, redirects to login with returnUrl.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isInitializing = useSelector(selectIsInitializing)
  const location = useLocation()

  if (isInitializing) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return children
}
