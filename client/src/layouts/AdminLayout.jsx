import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom'
import { Suspense, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { InlineLoader } from '@/components/ui/Loader'
import {
  LayoutDashboard, ShoppingBag, Grid3x3, Store, PlusCircle,
  Tag, ImagePlay, LogOut, ChevronLeft, ChevronRight,
  Package, Warehouse, Users, BarChart3, Settings,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin-ayush2133k', icon: LayoutDashboard, exact: true },
      { name: 'Analytics', path: '/admin-ayush2133k/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Orders',
    items: [
      { name: 'All Orders', path: '/admin-ayush2133k/orders', icon: ShoppingBag },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Products', path: '/admin-ayush2133k/products', icon: Store },
      { name: 'Add Product', path: '/admin-ayush2133k/add-product', icon: PlusCircle },
      { name: 'Categories', path: '/admin-ayush2133k/categories', icon: Tag },
      { name: 'Banners', path: '/admin-ayush2133k/banners', icon: ImagePlay },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { name: 'Stock Manager', path: '/admin-ayush2133k/inventory', icon: Warehouse },
    ],
  },
  {
    label: 'Users',
    items: [
      { name: 'Customers', path: '/admin-ayush2133k/customers', icon: Users },
    ],
  },
]

function NavItem({ item, collapsed }) {
  const location = useLocation()
  const isActive = item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path)

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.name : undefined}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative outline-none focus:outline-none',
        isActive
          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full" />
      )}
      <item.icon
        size={18}
        className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')}
      />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-[#0F172A] transition-all duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-60'
        )}
      >
        {/* Brand */}
        <div className={cn(
          'flex items-center border-b border-slate-800 h-16 shrink-0',
          collapsed ? 'justify-center px-2' : 'px-5 gap-3'
        )}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Package size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-none">REo Admin</p>
              <p className="text-slate-500 text-[10px] mt-0.5">v2.0 · Industrial</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.path} item={item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-3 space-y-2 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors text-xs"
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
          </button>

          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-default">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm uppercase shrink-0">
                {user.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-slate-500 text-[10px] truncate">{user.email}</p>
              </div>
              <button onClick={logout} title="Logout" className="text-slate-500 hover:text-rose-400 transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              title="Logout"
              className="w-full flex items-center justify-center py-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 bg-[#0F172A] text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Package size={14} />
            </div>
            <span className="font-bold text-sm">REo Admin</span>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-white">
            <LogOut size={18} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-100">
          <Suspense fallback={<InlineLoader className="min-h-[50vh]" />}>
            <Outlet />
          </Suspense>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex items-stretch h-16 bg-[#0F172A] border-t border-slate-800 shrink-0">
          {[
            { name: 'Dashboard', path: '/admin-ayush2133k', icon: LayoutDashboard, exact: true },
            { name: 'Orders', path: '/admin-ayush2133k/orders', icon: ShoppingBag },
            { name: 'Products', path: '/admin-ayush2133k/products', icon: Store },
            { name: 'Inventory', path: '/admin-ayush2133k/inventory', icon: Warehouse },
            { name: 'More', path: '/admin-ayush2133k/categories', icon: Grid3x3 },
          ].map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
                  isActive ? 'text-blue-400' : 'text-slate-500'
                )}
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
