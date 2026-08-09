import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  useEffect(() => { document.title = 'Profile — REo Collection' }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#111111]">My Profile</h2>
      <div className="mt-6 rounded-lg border border-[#E5E5E3] bg-white p-6">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#5F5F5F]">Name</p>
            <p className="mt-0.5 text-sm text-[#111111]">{user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#5F5F5F]">Email</p>
            <p className="mt-0.5 text-sm text-[#111111]">{user?.email || '—'}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="sm" onClick={logout}>Sign Out</Button>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#5F5F5F]">Full profile editing coming in Phase 5.</p>
    </div>
  )
}
