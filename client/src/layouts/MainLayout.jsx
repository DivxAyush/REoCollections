import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ToastContainer from '@/components/ui/Toast'
import { InlineLoader } from '@/components/ui/Loader'
import { useScrollTop } from '@/hooks/useScrollTop'

export default function MainLayout() {
  useScrollTop()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Suspense fallback={<InlineLoader className="min-h-[60vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
