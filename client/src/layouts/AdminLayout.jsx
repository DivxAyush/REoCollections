import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard, PlusCircle, LogOut, Store, Grid, PackageSearch } from 'lucide-react'

export default function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin-ayush2133k', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin-ayush2133k/categories', icon: Grid },
    { name: 'Products', path: '/admin-ayush2133k/products', icon: PackageSearch },
    { name: 'Add Product', path: '/admin-ayush2133k/add-product', icon: PlusCircle },
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-sm">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Store size={20} className="text-blue-400" />
            REo Admin
          </h2>
          <p className="text-slate-400 text-xs mt-1">v1.0.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <Store size={18} className="text-blue-600" />
            REo Admin
          </h2>
          <button onClick={logout} className="text-slate-500">
            <LogOut size={20} />
          </button>
        </header>

        {/* Mobile Nav */}
        <nav className="md:hidden bg-slate-900 text-white flex overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex justify-center py-3 text-xs font-medium transition-colors border-b-2 ${
                  isActive ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
