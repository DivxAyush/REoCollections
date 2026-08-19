import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import AppRoutes from '@/routes/AppRoutes'
import { fetchCurrentUser } from '@/redux/slices/authSlice'
import { tokenStorage } from '@/utils/tokenStorage'
import CookieConsent from '@/components/layout/CookieConsent'

// ============================================================
// AUTH INITIALIZER
// ============================================================

function AuthInitializer() {
  useEffect(() => {
    // If a token exists in localStorage, verify it with the server
    if (tokenStorage.exists()) {
      store.dispatch(fetchCurrentUser())
    } else {
      store.dispatch({ type: 'auth/setInitialized' })
    }
  }, [])

  return null
}

// ============================================================
// APP ROOT
// ============================================================

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer />
        <AppRoutes />
        <CookieConsent />
      </BrowserRouter>
    </Provider>
  )
}
