import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ToastContainer from '@/components/ui/Toast'
import { useScrollTop } from '@/hooks/useScrollTop'

export default function MainLayout() {
  useScrollTop()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
