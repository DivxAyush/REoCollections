import { Outlet, NavLink } from 'react-router-dom'
import { User, Package, MapPin, Settings, Heart } from 'lucide-react'
import Container from '@/components/ui/Container'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const accountNav = [
  { label: 'Profile', href: ROUTES.ACCOUNT_PROFILE, icon: User },
  { label: 'Orders', href: ROUTES.ACCOUNT_ORDERS, icon: Package },
  { label: 'Wishlist', href: ROUTES.ACCOUNT_WISHLIST, icon: Heart },
  { label: 'Addresses', href: ROUTES.ACCOUNT_ADDRESSES, icon: MapPin },
  { label: 'Settings', href: ROUTES.ACCOUNT_SETTINGS, icon: Settings },
]

export default function AccountLayout() {
  return (
    <Container className="py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <nav aria-label="Account navigation">
            <ul className="flex flex-row gap-1 overflow-x-auto no-scrollbar lg:flex-col">
              {accountNav.map(({ label, href, icon: Icon }) => (
                <li key={href} className="flex-shrink-0 lg:flex-shrink">
                  <NavLink
                    to={href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                        isActive
                          ? 'bg-[#111111] text-white'
                          : 'text-[#5F5F5F] hover:text-[#111111] hover:bg-[#F7F7F6]'
                      )
                    }
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </Container>
  )
}
