import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import AccountLayout from '@/layouts/AccountLayout'
import ProtectedRoute from './ProtectedRoute'
import { PageLoader } from '@/components/ui/Loader'
import { ROUTES } from '@/constants/routes'

// ============================================================
// LAZY-LOADED PAGES
// ============================================================

const HomePage = lazy(() => import('@/pages/HomePage'))
const ShopPage = lazy(() => import('@/pages/ShopPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage'))

// Help Pages
const FaqPage = lazy(() => import('@/pages/help/FaqPage'))
const SizeGuidePage = lazy(() => import('@/pages/help/SizeGuidePage'))

// Auth
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))

// Account (protected)
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'))
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'))
const WishlistAccountPage = lazy(() => import('@/pages/account/WishlistAccountPage'))
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'))
const SettingsPage = lazy(() => import('@/pages/account/SettingsPage'))

// Utility
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Policies
const LazyPrivacyPolicyPage = lazy(() => import('@/pages/policies/PolicyPages').then(m => ({ default: m.PrivacyPolicyPage })))
const LazyTermsOfServicePage = lazy(() => import('@/pages/policies/PolicyPages').then(m => ({ default: m.TermsOfServicePage })))
const LazyShippingPolicyPage = lazy(() => import('@/pages/policies/PolicyPages').then(m => ({ default: m.ShippingPolicyPage })))
const LazyReturnPolicyPage = lazy(() => import('@/pages/policies/PolicyPages').then(m => ({ default: m.ReturnPolicyPage })))
const LazyCookiePolicyPage = lazy(() => import('@/pages/policies/PolicyPages').then(m => ({ default: m.CookiePolicyPage })))

// Admin
import AdminLayout from '@/layouts/AdminLayout'
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminAddProductPage = lazy(() => import('@/pages/admin/AdminAddProductPage'))
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'))
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'))
const AdminEditProductPage = lazy(() => import('@/pages/admin/AdminEditProductPage'))
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'))
const AdminOrderDetailsPage = lazy(() => import('@/pages/admin/AdminOrderDetailsPage'))
const AdminBannersPage = lazy(() => import('@/pages/admin/AdminBannersPage'))
const AdminAddBannerPage = lazy(() => import('@/pages/admin/AdminAddBannerPage'))
const AdminInventoryPage = lazy(() => import('@/pages/admin/AdminInventoryPage'))

// ============================================================
// ROUTES
// ============================================================

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Admin Routes */}
        <Route path="admin-ayush2133k" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/edit/:id" element={<AdminEditProductPage />} />
          <Route path="add-product" element={<AdminAddProductPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="banners/add" element={<AdminAddBannerPage />} />
          <Route path="banners/edit/:id" element={<AdminAddBannerPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="customers" element={<AdminDashboardPage />} />
        </Route>

        {/* Public routes with main layout */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:category" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />

          {/* Policy Pages */}
          <Route path="privacy" element={<LazyPrivacyPolicyPage />} />
          <Route path="terms" element={<LazyTermsOfServicePage />} />
          <Route path="shipping" element={<LazyShippingPolicyPage />} />
          <Route path="returns" element={<LazyReturnPolicyPage />} />
          <Route path="cookies" element={<LazyCookiePolicyPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          
          {/* Help Pages */}
          <Route path="help/faq" element={<FaqPage />} />
          <Route path="help/size-guide" element={<SizeGuidePage />} />

          {/* Checkout — protected */}
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="order-success/:id" element={<OrderSuccessPage />} />

          {/* Account pages — protected */}
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.ACCOUNT_PROFILE} replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="wishlist" element={<WishlistAccountPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Auth routes with minimal layout */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* 404 */}
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
