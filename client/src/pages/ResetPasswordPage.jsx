import { useEffect } from 'react'
import Container from '@/components/ui/Container'

export default function ResetPasswordPage() {
  useEffect(() => { document.title = 'Reset Password — REo Collection' }, [])
  return (
    <div className="rounded-xl border border-[#E5E5E3] bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[#111111]">Reset Password</h1>
      <p className="mt-2 text-sm text-[#5F5F5F]">Coming in Phase 5.</p>
    </div>
  )
}
