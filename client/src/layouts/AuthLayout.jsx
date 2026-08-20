import { Outlet, Link } from 'react-router-dom'
import { Suspense } from 'react'
import { ROUTES } from '@/constants/routes'
import { InlineLoader } from '@/components/ui/Loader'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7F6]">
      {/* Minimal header */}
      <header className="flex h-14 items-center justify-center border-b border-[#E5E5E3] bg-white">
        <Link to={ROUTES.HOME} aria-label="REo Collection — Home">
          <span className="font-['Outfit'] text-xl font-bold tracking-tight text-[#111111]">
            REo<span className="text-[#C9AD8B]">.</span>
          </span>
        </Link>
      </header>

      {/* Auth content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Suspense fallback={<InlineLoader className="min-h-[30vh]" />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
